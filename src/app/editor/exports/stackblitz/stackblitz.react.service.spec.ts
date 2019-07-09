import { ExportStackblitzReactService } from '@app/editor/code/exports/stackblitz/stackblitz.react.service';
import { XlayersNgxEditorModel } from '@app/editor/code/editor-container/codegen/codegen.service';

describe('StackBlitz React', () => {
  let service: ExportStackblitzReactService;
  let files, template, tags;
  const model: XlayersNgxEditorModel = {
    kind: 'react',
    uri: 'uri',
    value: 'string',
    language: 'react'
  };
  beforeEach(() => {
    service = new ExportStackblitzReactService();
    const result = service.prepare([model]);
    files = result.files;
    tags = result.tags;
    template = result.template;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain 4 files', () => {
    expect(Object.keys(files).length).toBe(4);
  });

  it('should have default index file', () => {
    expect(files['src/index.js']).toBeTruthy();
  });

  it('should contain uri files', () => {
    expect(files['src/uri']).toBe('string');
  });

  it('should have default index.html', () => {
    expect(files['public/index.html']).toBeTruthy();
  });

  it('should have react tag', () => {
    expect(tags).toEqual(['react']);
  });

  it('should have create-react-app template', () => {
    expect(template).toBe('create-react-app');
  });
});
