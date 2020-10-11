import { Injectable } from '@angular/core';
import { FormatService } from './format.service';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private readonly formatService: FormatService) {}

  identify(current: FileFormat.AnyLayer) {
    return (current._class as string) === 'bitmap';
  }

  lookup(current: FileFormat.AnyLayer, data: FileFormat.Contents) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  aggregate(
    current: FileFormat.AnyLayer,
    data: FileFormat.Contents,
    options: any
  ) {
    return [
      {
        kind: 'png',
        value: this.getImageDataFromRef(data, (current as any).image._ref),
        language: 'base64',
        uri: `${options.assetDir}/${this.formatService.normalizeName(
          current.name
        )}.png`,
      },
    ];
  }

  private getImageDataFromRef(data: FileFormat.Contents, reference: string) {
    console.error(reference);
    return (data as any).images[reference];
  }
}
