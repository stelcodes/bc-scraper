import puppeteer, { Browser, ElementHandle, Page, PuppeteerLaunchOptions } from 'puppeteer-core';
import { Command } from 'commander';

const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH;

async function getPage(browser: Browser, url: URL) {
	const page = await browser.newPage();
  await page.setRequestInterception(true);
	page.on('request', request => {
		if (request.resourceType() === 'image') {
			request.abort();
		} else {
			request.continue();
		}
	});
	await page.goto(url.toString());
	return page
}

async function getText(el: ElementHandle) {
	return el.evaluate(element => {
		let text = ''
		for (var i = 0; i < element.childNodes.length; ++i)
			if (element.childNodes[i].nodeType === Node.TEXT_NODE)
				text += element.childNodes[i].textContent;
		return text.trim()
	})
}

async function waitSelector(el: Page | ElementHandle, sel: string) {
	return el.waitForSelector(sel, { timeout: 3000, visible: true })
}

async function scrape(urlArg: string, _options: void): Promise<void> {
	console.log(`Fetching ${urlArg}`);
	const url = new URL(urlArg);
	url.protocol = "https:";
	const browser = await puppeteer.launch({
		skipDownload: true,
		executablePath: chromePath
	} as PuppeteerLaunchOptions);
	const page = await getPage(browser, url);

	const trackViewEl = await waitSelector(page, 'div.trackView')
	const trackTitleEl = await waitSelector(trackViewEl, 'div#name-section h2'); // select the element
	const trackTitle = await getText(trackTitleEl); // grab the textcontent from the element, by evaluating this function in the browser context
	const trackArtistEl = await waitSelector(trackViewEl, 'div#name-section h3 a')
	const trackArtist = await getText(trackArtistEl); // grab the textContent from the element, by evaluating this function in the browser context

	const deetsEl = await waitSelector(trackViewEl, 'div.middleColumn div.deets')
	while (true) {
		try {
			let moreButton = await waitSelector(deetsEl, 'div.deets a.more-thumbs')
			await moreButton.click() // Don't forget to await promises! Even if they don't return something.
			console.log("Clicked more button")
		} catch (error) {
			console.log(`Message: ${error.message}`)
			console.log("Could not click 'more' button anymore")
			break
		}
	}
	const fanPicEls = await deetsEl.$$('a.pic')
	const fanCommentEls = await deetsEl.$$('div.writing div.text')
	const comments = await Promise.all(fanCommentEls.map(getText))

	// PRINTING
	console.log(`Track Title: ${trackTitle}`)
	console.log(`Track Artist: ${trackArtist}`)
	console.log()
	console.log(`Comments: ${fanCommentEls.length}`)
	comments.forEach(x => console.log(x))
	console.log()
	console.log(`Fans: ${fanPicEls.length}`)


	process.exit()
}

const program = new Command();


// console.log(JSON.stringify(process.env))

program
	.name("bc-scraper")
	.description("A scraper for a popular music site.")
	.version("v0.0.0")

program.command('scrape', { isDefault: true })
	.description('Scrape page')
	.argument('<url>', 'url of the page')
	.action(scrape);

program.parse();
