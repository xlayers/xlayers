all: lib app

lib:
	npm run sketchingestor.build.prod
	npm run sketchutil.build.prod
	npm run cssblocgen.build.prod
	npm run svgblocgen.build.prod
	npm run webblocgen.build.prod

app:
	npm run app.build.prod
