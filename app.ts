import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";


async function scrape(_options: void, urlArg: string) {
	console.log(`Fetching ${urlArg}`);
	const url = new URL(urlArg);
	url.protocol = "https:";
	const browser = await puppeteer.launch({
		skipDownload: true
	});
	const page = await browser.newPage();
	await page.goto(url.toString());
	const trackTitleEl = await page.waitForSelector('h2.trackTitle'); // select the element
	const trackTitle = await trackTitleEl.evaluate(el => el.textContent); // grab the textContent from the element, by evaluating this function in the browser context
	console.log(`Track Title: ${trackTitle}`)
	return trackTitle
}

await new Command()
	.name("bc-scraper")
	.description("A scraper for a popular music site.")
	.version("v1.0.0")
	.arguments("<url:string>")
	.action(scrape)
	.parse();
