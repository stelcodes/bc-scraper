import puppeteer, { ElementHandle, PuppeteerLaunchOptions } from 'puppeteer-core';
import { Command } from 'commander';

const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH;

async function getText(el: ElementHandle) {
	return el.evaluate(element => {
		let text = ''
		for (var i = 0; i < element.childNodes.length; ++i)
			if (element.childNodes[i].nodeType === Node.TEXT_NODE)
				text += element.childNodes[i].textContent;
		return text.trim()
	})
}

async function scrape(urlArg: string, _options: void): Promise<void> {
	console.log(`Fetching ${urlArg}`);
	const url = new URL(urlArg);
	url.protocol = "https:";
	const browser = await puppeteer.launch({
		skipDownload: true,
		executablePath: chromePath
	} as PuppeteerLaunchOptions);
	const page = await browser.newPage();
	await page.goto(url.toString());
	const trackTitleEl = await page.waitForSelector('h2.trackTitle'); // select the element
	const trackTitle = await getText(trackTitleEl); // grab the textContent from the element, by evaluating this function in the browser context
	console.log(`Track Title: ${trackTitle}`)
}

const program = new Command();


// console.log(JSON.stringify(process.env))

program
	.name("bc-scraper")
	.description("A scraper for a popular music site.")
	.version("v1.0.0")

program.command('scrape', { isDefault: true })
	.description('Scrape page')
	.argument('<url>', 'url of the page')
	.action(scrape);

program.parse();
