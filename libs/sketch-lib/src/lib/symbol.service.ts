import { Injectable } from '@angular/core';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

@Injectable({
  providedIn: 'root',
})
export class SymbolService {
  identify(current: FileFormat.AnyLayer) {
    return (current._class as string) === 'symbolInstance';
  }

  lookup(current: FileFormat.AnyLayer, data: FileFormat.Contents) {
    const foreignSymbol = data.document.foreignSymbols.find(
      (x) => x.symbolMaster.symbolID === (current as any).symbolID
    );

    return foreignSymbol && foreignSymbol.symbolMaster;
  }
}
