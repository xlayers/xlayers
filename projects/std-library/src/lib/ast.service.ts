import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AstService {
  maybeFindSymbolMaster(current: SketchMSLayer, data: SketchMSData) {
    const foreignSymbol = data.document.foreignSymbols.find(
      x => x.symbolMaster.symbolID === (current as any).symbolID
    );

    return foreignSymbol.symbolMaster;
  }
}
