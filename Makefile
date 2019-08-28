all: lib app

lib:
	npm run sketchingestor.build.prod
	npm run sketchutil.build.prod
	npm run csscodegen.build.prod
	npm run svgcodegen.build.prod
	npm run webcodegen.build.prod

app:
	npm run app.build.prod
