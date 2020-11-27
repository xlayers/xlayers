import { Injectable } from '@angular/core';
import { XlayersNgxEditorModel } from '../../editor-container/codegen/codegen.service';
import { StackBlitzProjectPayload } from './stackblitz.service';

@Injectable({
  providedIn: 'root',
})
export class ExportStackblitzSvelteService {
  prepare(content: XlayersNgxEditorModel[]): StackBlitzProjectPayload {
    const files = {};
    const mainJsFileName = 'index.js';

    for (let i = 0; i < content.length; i++) {
      for (const prop in content[i]) {
        if (prop === 'uri') {
          files[content[i].uri] = content[i].value;
        }
      }
    }

    files['package.json'] = `\
{
  "name": "my-svelte-app",
  "version": "1.0.0",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "start": "sirv public"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^16.0.0",
    "@rollup/plugin-node-resolve": "^10.0.0",
    "rollup": "^2.3.4",
    "rollup-plugin-css-only": "^3.0.0",
    "rollup-plugin-livereload": "^2.0.0",
    "rollup-plugin-svelte": "^7.0.0",
    "rollup-plugin-terser": "^7.0.0",
    "svelte": "^3.0.0"
  },
  "dependencies": {
    "sirv-cli": "^1.0.0"
  }
}`;

    files['rollup.config.js'] = `\
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
    
const production = !process.env.ROLLUP_WATCH;
    
function serve() {
  let server;
    
  function toExit() {
    if (server) server.kill(0);
  }
    
  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });
    
      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}
    
export default {
  input: 'src/${mainJsFileName}',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production
      }
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),
    
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    
    // In dev mode, call \`npm run start\` once
    // the bundle has been generated
    !production && serve(),
    
    // Watch the \`public\` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),
    
    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};    
    `;

    files['index.html'] = `<div id="root"></div>`;
    files[mainJsFileName] = `\

import App from "./components/page-1.svelte";

const app = new App({
  target: document.querySelector("#root"),
  data: {}
}); 
    
    `;

    return {
      files,
      template: 'javascript',
      tags: ['svelte'],
    };
  }
}
