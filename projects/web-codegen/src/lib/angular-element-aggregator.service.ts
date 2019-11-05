import { Injectable } from '@angular/core';
import { WebCodeGenOptions } from './web-codegen';
import { WebAggregatorService } from './web-aggregator.service';
import { FormatService } from '@xlayers/sketch-lib';
import { AngularAggregatorService } from './angular-aggregator.service';

const ELEMENT_MODULE_FILENAME = 'app.module.ts';
const EXTRA_WEBPACK_CONFIG_FILENAME = 'webpack.extra.js';
const COPY_BUNDLES_SCRIPT_FILENAME = 'copy.bundles.js';
const DIST_FOLDER_NAME = 'dist';
const BUNDLES_TARGET_PATH = `${DIST_FOLDER_NAME}/bundles`;
const SAMPLE_INDEX_FILENAME = 'index.html';
const ELEMENT_BUNDLE_FILENAME = 'main.js';
const ELEMENT_CREATOR_APPNAME = 'element-creator';

@Injectable({
  providedIn: 'root'
})
export class AngularElementAggregatorService {
  constructor(
    private readonly formatService: FormatService,
    private readonly webAggretatorService: WebAggregatorService,
    private readonly angularAggregatorService: AngularAggregatorService
  ) {}

  aggreate(current: SketchMSLayer, options: WebCodeGenOptions) {
    const fileName = this.formatService.normalizeName(current.name);
    const componentPathName = `${options.componentDir}/${fileName}.component`;
    return [
      {
        uri: 'README.md',
        value: this.renderReadme(current.name, options),
        language: 'markdown',
        kind: 'text'
      },
      ...this.webAggretatorService.aggreate(current, options).map(file => {
        switch (file.language) {
          case 'html':
            return {
              ...file,
              kind: 'angular',
              uri: `${options.componentDir}/${fileName}.component.html`
            };

          case 'css':
            return {
              ...file,
              kind: 'angular',
              uri: `${options.componentDir}/${fileName}.component.css`
            };

          default:
            return {
              ...file,
              kind: 'angularElement'
            };
        }
      }),
      {
        uri: `${componentPathName}.ts`,
        value: this.angularAggregatorService.renderComponent(current.name, options),
        language: 'typescript',
        kind: 'angular',
      },
      {
        uri: ELEMENT_MODULE_FILENAME,
        value: this.renderElementModule(current.name, options, componentPathName),
        language: 'typescript',
        kind: 'angularElement'
      },
      {
        uri: EXTRA_WEBPACK_CONFIG_FILENAME,
        value: this.renderWebpackExtra(),
        language: 'javascript',
        kind: 'angularElement'
      },
      {
        uri: COPY_BUNDLES_SCRIPT_FILENAME,
        value: this.renderCopyUmdBundlesScript(),
        language: 'javascript',
        kind: 'angularElement'
      },
      {
        uri: SAMPLE_INDEX_FILENAME,
        value: this.renderSampleIndexHtml(current.name, options),
        language: 'html',
        kind: 'angularElement'
      }
    ];
  }


  private renderReadme(name: string, options: WebCodeGenOptions) {
    const className = this.formatService.className(name);
    const normalizedName = this.formatService.normalizeName(name);
    const tagName = `${options.xmlPrefix}${normalizedName}`;
    const codeSpan = text => '`' + text + '`';
    const codeBlock = '```';
    return `
**Notice:**
The current implement of [Angular Elements](https://angular.io/guide/elements) is in MVP (minimum viable product) state.
Some features like content projection are not supported yet.
Keep in mind that the following build process and feature support will be improved in the future.
The creation of the bundled Angular Element is based on the process defined by [Manfred Steyer](https://twitter.com/manfredsteyer)'s example from
[${codeSpan('ngx-build-plus')}](https://github.com/manfredsteyer/ngx-build-plus).

## How to use the ${codeSpan(name)} Angular Element

1. In order to use an Angular Element as a web component, it first needs to be created, e.g. in the following way:

    a) Use the Angular CLI to create a minimal app which will be used to create the Angular Element:
    ${codeBlock}
    ng new ${ELEMENT_CREATOR_APPNAME} --minimal --style css --routing false
    cd ${ELEMENT_CREATOR_APPNAME}
    ${codeBlock}

    b) Add necessary dependencies for the following steps:
    ${codeBlock}
    ng add @angular/elements
    ng add ngx-build-plus
    npm install @webcomponents/custom-elements --save
    npm install --save-dev copy
    ${codeBlock}

    c) Download and extract the files of this generation. Place the files of the ${codeSpan(className)}
    into your standard ${codeSpan('src/app')} folder. Replace the ${codeSpan(ELEMENT_MODULE_FILENAME)} and remove the sample ${codeSpan('app.component.ts')}.
    Extract the files ${codeSpan(EXTRA_WEBPACK_CONFIG_FILENAME)} and ${codeSpan(COPY_BUNDLES_SCRIPT_FILENAME)} into the project root.

    e) Build the Angular Element:
    ${codeBlock}
    ng build --prod --extraWebpackConfig ${EXTRA_WEBPACK_CONFIG_FILENAME} --output-hashing none --single-bundle true
    ${codeBlock}

2. After the creation of the Angular Element, it can be found as single file
web component ${codeSpan(DIST_FOLDER_NAME + '/' + ELEMENT_CREATOR_APPNAME + '/' + ELEMENT_BUNDLE_FILENAME)} and can be consumed in the following way:
${codeBlock}
  // index.html
  <script src="./${DIST_FOLDER_NAME}/${ELEMENT_CREATOR_APPNAME}/${ELEMENT_BUNDLE_FILENAME}"></script>
  <${tagName}></${tagName}>
${codeBlock}

However due to the bundle splitting approach, the different dependent bundles must be added manually,
e.g. like described in the exported sample file ${codeSpan(SAMPLE_INDEX_FILENAME)}.
In order to get those script you can run the script ${codeSpan(COPY_BUNDLES_SCRIPT_FILENAME)} file.
${codeBlock}
  node ./${COPY_BUNDLES_SCRIPT_FILENAME}
${codeBlock}

>  For more information about [web components and browser support](https://github.com/WebComponents/webcomponentsjs#browser-support)
`;
  }

  private renderElementModule(name: string, options: WebCodeGenOptions, componentPathName: string) {
    const className = this.formatService.className(name);
    const componentName = `${className}Component`;
    const normalizedName = this.formatService.normalizeName(name);
    const tagName = `${options.xmlPrefix}${normalizedName}`;
    return (
      '' +
      `
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { ${componentName} } from './${componentPathName}';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    ${componentName}
  ],
  entryComponents: [
    ${componentName}
  ],
})
export class AppModule {
  constructor(injector: Injector) {
    const element = createCustomElement(${componentName} , { injector });
    customElements.define('${tagName}', element);
  }

  ngDoBootstrap() { }
}
    `
    );
  }

  private renderWebpackExtra() {
    return `
module.exports = {
  "externals": {
      "rxjs": "rxjs",
      "@angular/core": "ng.core",
      "@angular/common": "ng.common",
      "@angular/platform-browser": "ng.platformBrowser",
      "@angular/elements": "ng.elements"
  }
}
    `;
  }

  private renderCopyUmdBundlesScript() {
    return `
//
// This script copies over UMD bundles to the folder dist/bundles
// If you call it manually, call it from your projects root
// > node /${COPY_BUNDLES_SCRIPT_FILENAME}
//

const copy = require('copy');

console.log('Copy UMD bundles ...');

copy('node_modules/@angular/*/bundles/*.umd.js', '${BUNDLES_TARGET_PATH}', {}, _ => {});
copy('node_modules/rxjs/bundles/*.js', '${BUNDLES_TARGET_PATH}/rxjs', {}, _ => {});
copy('node_modules/zone.js/dist/*.js', '${BUNDLES_TARGET_PATH}/zone.js', {}, _ => {});
copy('node_modules/core-js/client/*.js', '${BUNDLES_TARGET_PATH}/core-js', {}, _ => {});
copy('node_modules/@webcomponents/custom-elements/*.js', '${BUNDLES_TARGET_PATH}/custom-elements', {}, _ => {});
copy('node_modules/@webcomponents/custom-elements/src/native-shim*.js', '${BUNDLES_TARGET_PATH}/custom-elements/src', {}, _ => {});
    `;
  }

  private renderSampleIndexHtml(name: string, options: WebCodeGenOptions) {
    const normalizedName = this.formatService.normalizeName(name);
    const tagName = `${options.xmlPrefix}${normalizedName}`;

    return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ElementsLoading</title>
<base href=".">

<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>

<!-- Consider putting the following UMD (!) bundles -->
<!-- into a big one -->

<!-- core-js for legacy browsers -->
<script src="./${BUNDLES_TARGET_PATH}/core-js/core.js"></script>

<!-- Zone.js -->
<!--
    Consider excluding zone.js when creating
    custom Elements by using the noop zone.
-->
<script src="./${BUNDLES_TARGET_PATH}/zone.js/zone.js"></script>

<!--
    Polyfills for Browsers supporting
    Custom Elements. Needed b/c we downlevel
    to ES5. See: @webcomponents/custom-elements
-->
<script src="./${BUNDLES_TARGET_PATH}/custom-elements/src/native-shim.js"></script>

<!-- Polyfills for Browsers not supporting
        Custom Elements. See: @webcomponents/custom-elements
-->
<script src="./${BUNDLES_TARGET_PATH}/custom-elements/custom-elements.min.js"></script>

<!-- Rx -->
<script src="./${BUNDLES_TARGET_PATH}/rxjs/rxjs.umd.js"></script>

<!-- Angular Packages -->
<script src="./${BUNDLES_TARGET_PATH}/core/bundles/core.umd.js"></script>
<script src="./${BUNDLES_TARGET_PATH}/common/bundles/common.umd.js"></script>
<script src="./${BUNDLES_TARGET_PATH}/platform-browser/bundles/platform-browser.umd.js"></script>
<script src="./${BUNDLES_TARGET_PATH}/elements/bundles/elements.umd.js"></script>

<!-- Angular Element -->
<script src="./${DIST_FOLDER_NAME}/${ELEMENT_CREATOR_APPNAME}/${ELEMENT_BUNDLE_FILENAME}"></script>

<!-- Calling Custom Element -->
<${tagName}></${tagName}>

</body>
</html>
    `;
  }
}
