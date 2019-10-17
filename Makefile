all: lib app

lib:
	npm run sketchingestor.build.prod
	npm run sketchutil.build.prod
	npm run csscodegen.build.prod
	npm run svgcodegen.build.prod
	npm run webcodegen.build.prod
	npm run angularcodegen.build.prod
	npm run litelementcodegen.build.prod
	npm run reactcodegen.build.prod
	npm run stencilcodegen.build.prod
	npm run vuecodegen.build.prod
	npm run webcomponentcodegen.build.prod
	npm run xamlcodegen.build.prod

app:
	npm run app.build.prod
