import { Injectable } from '@angular/core';
import { BplistService } from './bplist.service';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

type TextLayers = Extract<FileFormat.AnyLayer, FileFormat.Text>;

@Injectable({
  providedIn: 'root',
})
export class TextService {
  constructor(private binaryHelperService: BplistService) {}

  identify(current: TextLayers) {
    return (current._class as string) === 'text';
  }

  lookup(current: TextLayers) {
    return (
      current.attributedString.string ||
      this.extractAttributedStringText(current)
    );
  }

  private extractAttributedStringText(current: TextLayers) {
    const obj = current.attributedString;

    if (obj && obj.hasOwnProperty('archivedAttributedString')) {
      const archive = this.binaryHelperService.parse64Content(
        (obj as any).archivedAttributedString._archive
      );

      if (archive) {
        return this.decodeArchiveString(archive);
      }
    }

    return '';
  }

  private decodeArchiveString(archive) {
    switch (archive.$key) {
      case 'ascii':
        return archive.$value;
      default:
        return '';
    }
  }
}
