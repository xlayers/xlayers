import { Injectable } from '@angular/core';
import { XlayersNgxEditorModel } from '../code-editor/editor-container/codegen/codegen.service';

@Injectable({
  providedIn: 'root'
})
export class ExportStackblitzService {

  constructor() { }

  async export(content: Array<XlayersNgxEditorModel>) {
    const url = 'https://stackblitz.com/run';

    const body = new FormData();

    for (let i = 0; i < content.length; i++) {
      for (let prop in content[i]) {
        if (prop === 'uri') {
          body.append(`project[files][${content[i].uri}]`, content[i].value);
        }
      }
    }

    body.append("project[tags][]", "xlayers.app");
    body.append("project[description]", "Auto-generated component by xLayers.app");
    body.append("project[dependencies]", "");
    body.append("project[template]", "typescript");
    body.append("project[settings]", "");

    debugger;

    return await fetch(url, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      redirect: "follow",
      referrer: "no-referrer",
      body
    })
  }
}
