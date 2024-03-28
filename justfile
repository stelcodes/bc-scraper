build:
	tsc

run url="https://pearsonsound.bandcamp.com/album/rubble": build
	node ./dist/app.js

