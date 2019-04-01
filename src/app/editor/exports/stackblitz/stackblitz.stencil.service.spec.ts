import { ExportStackblitzStencilService } from '@app/editor/code/exports/stackblitz/stackblitz.stencil.service';
import { XlayersNgxEditorModel } from '@app/editor/code/editor-container/codegen/codegen.service';

describe('StackBlitz Stencil', () => {
  let service: ExportStackblitzStencilService;
  let files, template, tags;
  const model: XlayersNgxEditorModel = {
    kind: 'stencil',
    uri: 'uri',
    value: 'string',
    language: 'stencil'
  };
  beforeEach(() => {
    service = new ExportStackblitzStencilService();
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

  it('should have default config file', () => {
    expect(files['stencil.config.ts']).toBeTruthy();
  });

  it('should contain uri files', () => {
    expect(files['src/components/x-layers-component/uri']).toBe('string');
  });

  it('should have default index.html', () => {
    expect(files['src/index.html']).toBeTruthy();
  });

  it('should have stencil tag', () => {
    expect(tags).toEqual(['stencil']);
  });

  it('should have typescript template', () => {
    expect(template).toBe('typescript');
  });
});
