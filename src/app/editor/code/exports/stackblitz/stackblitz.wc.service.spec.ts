import { ExportStackblitzWCService } from '@app/editor/code/exports/stackblitz/stackblitz.wc.service';
import { XlayersNgxEditorModel } from '@app/editor/code/editor-container/codegen/codegen.service';

describe('StackBlitz WC', () => {
  let service: ExportStackblitzWCService;
  let files, template, tags;
  const model: XlayersNgxEditorModel = {
    kind: 'wc',
    uri: 'uri',
    value: 'string',
    language: 'wc'
  };
  beforeEach(() => {
    service = new ExportStackblitzWCService();
    const result = service.prepare([model]);
    files = result.files;
    tags = result.tags;
    template = result.template;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain 2 files', () => {
    expect(Object.keys(files).length).toBe(2);
  });

  it('should contain uri files', () => {
    expect(files['uri']).toBe('string');
  });

  it('should have default index.html', () => {
    expect(files['index.html']).toBeTruthy();
  });

  it('should have web component tag', () => {
    expect(tags).toEqual(['web component']);
  });

  it('should have javascript template', () => {
    expect(template).toBe('javascript');
  });
});
