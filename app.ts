import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";

async function scrape(_, urlArg) {
	console.log(`Fetching ${urlArg}`);
	const url = new URL(urlArg);
	url.protocol = "https:";
	// url.hostname = domain;
	// url.port = "443";

	// console.log("Proxy request to:", url.href);
	let resp = await fetch(url.href, {
		headers: {},
		method: "GET",
		body: null,
	});
	console.log(`resp: ${await resp.text()}`)

}

await new Command()
	.name("bandcamp-scraper")
	.description("A scraper for bandcamp.")
	.version("v1.0.0")
	.arguments("[url]")
	.action(scrape)
	.parse();
