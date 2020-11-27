import { XlayersNgxEditorModel } from '../../editor-container/codegen/codegen.service';

import { ExportStackblitzSvelteService } from './stackblitz.svelte.service';

describe('Stackblitz Svelte', () => {
  let service: ExportStackblitzSvelteService;

  let files, template, tags;
  const model: XlayersNgxEditorModel = {
    kind: 'svelte',
    uri: 'uri',
    value: 'string',
    language: 'svelte',
  };

  beforeEach(() => {
    service = new ExportStackblitzSvelteService();
    const result = service.prepare([model]);
    files = result.files;
    tags = result.tags;
    template = result.template;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain 5 files', () => {
    expect(Object.keys(files).length).toBe(5);
  });

  it('should have default rollup config file', () => {
    expect(files['rollup.config.js']).toBeTruthy();
  });

  it('should contain uri files', () => {
    expect(files['uri']).toBe('string');
  });

  it('should have default index.html', () => {
    expect(files['index.html']).toBeTruthy();
  });

  it('should have default package.json', () => {
    expect(files['package.json']).toBeTruthy();
  });

  it('should have svelte tag', () => {
    expect(tags).toEqual(['svelte']);
  });

  it('should have javascript template', () => {
    expect(template).toBe('javascript');
  });
});
