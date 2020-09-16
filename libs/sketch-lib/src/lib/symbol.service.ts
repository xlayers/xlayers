import { Injectable } from '@angular/core';
import { SketchMSData, SketchMSLayer } from '@xlayers/sketchtypes';

@Injectable({
  providedIn: 'root',
})
export class SymbolService {
  identify(current: SketchMSLayer) {
    return (current._class as string) === 'symbolInstance';
  }

  lookup(current: SketchMSLayer, data: SketchMSData) {
    const foreignSymbol = data.document.foreignSymbols.find(
      (x) => x.symbolMaster.symbolID === (current as any).symbolID
    );

    return foreignSymbol && foreignSymbol.symbolMaster;
  }
}
