run url="https://pearsonsound.bandcamp.com/album/rubble":
	deno run --allow-net --allow-env --allow-run="/nix/store" --allow-write="/tmp" app.ts {{url}}
