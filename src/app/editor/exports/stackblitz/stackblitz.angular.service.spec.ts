import { ExportStackblitzAngularService } from '@app/editor/code/exports/stackblitz/stackblitz.angular.service';
import { XlayersNgxEditorModel } from '@app/editor/code/editor-container/codegen/codegen.service';

describe('StackBlitz Angular', () => {
  let service: ExportStackblitzAngularService;
  let files, template, tags;
  const model: XlayersNgxEditorModel = {
    kind: 'angular',
    uri: 'uri',
    value: 'string',
    language: 'angular'
  };
  beforeEach(() => {
    service = new ExportStackblitzAngularService();
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

  it('should contain a app.component', () => {
    expect(files['src/app/app.component.ts']).toBeTruthy();
  });

  it('should contain uri files', () => {
    expect(files['src/app/xlayers/uri']).toBe('string');
  });

  it('should have default index.html', () => {
    expect(files['src/index.html']).toBe('<my-app>loading</my-app>');
  });

  it('should have angular tag', () => {
    expect(tags).toEqual(['angular']);
  });

  it('should have angular-cli template', () => {
    expect(template).toBe('angular-cli');
  });
});
