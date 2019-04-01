import { ExportStackblitzLitElementService } from '@app/editor/code/exports/stackblitz/stackblitz.lit-element.service';
import { XlayersNgxEditorModel } from '@app/editor/code/editor-container/codegen/codegen.service';

describe('StackBlitz Lit Element', () => {
  let service: ExportStackblitzLitElementService;
  let files, template, tags;
  const model: XlayersNgxEditorModel = {
    kind: 'litElement',
    uri: 'uri',
    value: 'string',
    language: 'lit'
  };

  beforeEach(() => {
    service = new ExportStackblitzLitElementService();
    const result = service.prepare([model]);
    files = result.files;
    tags = result.tags;
    template = result.template;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain 3 files', () => {
    expect(Object.keys(files).length).toBe(3);
  });

  it('should contain uri files', () => {
    expect(files['uri']).toBe('string');
  });

  it('should have default index.js', () => {
    expect(files['index.js']).toBe(`import './x-layers-element.js';`);
  });

  it('should have web component and lit-element tag', () => {
    expect(tags).toEqual(['web component', 'lit-element']);
  });

  it('should have javascript template', () => {
    expect(template).toBe('javascript');
  });
});
