import { Injectable } from '@angular/core';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
type SymbolLayers = Extract<
  FileFormat.AnyLayer,
  | FileFormat.SymbolInstance
  | FileFormat.SymbolMaster
  | FileFormat.SymbolContainer
>;

@Injectable({
  providedIn: 'root',
})
export class SymbolService {
  identify(current: SymbolLayers) {
    return (current._class as string) === 'symbolInstance';
  }

  lookup(current: SymbolLayers, data: FileFormat.Contents) {
    const foreignSymbol = data.document.foreignSymbols.find(
      (x) => x.symbolMaster.symbolID === (current as any).symbolID
    );

    return foreignSymbol && foreignSymbol.symbolMaster;
  }
}
