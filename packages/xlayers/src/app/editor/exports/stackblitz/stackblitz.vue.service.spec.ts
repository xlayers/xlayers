import { ExportStackblitzVueService } from '@app/editor/code/exports/stackblitz/stackblitz.vue.service';
import { XlayersNgxEditorModel } from '@app/editor/code/editor-container/codegen/codegen.service';

describe('StackBlitz vue', () => {
  let service: ExportStackblitzVueService;
  let files, template, tags;
  const model: XlayersNgxEditorModel = {
    kind: 'vue',
    uri: 'uri',
    value: 'string',
    language: 'vue'
  };
  beforeEach(() => {
    service = new ExportStackblitzVueService();
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

  it('should have default file', () => {
    expect(files['index.js']).toBeTruthy();
  });

  it('should contain uri files', () => {
    expect(files['src/app/xlayers/uri']).toBe('string');
  });

  it('should have default index.html', () => {
    expect(files['index.html']).toBeTruthy();
  });

  it('should have vue tag', () => {
    expect(tags).toEqual(['vuejs']);
  });

  it('should have javascript template', () => {
    expect(template).toBe('javascript');
  });
});
