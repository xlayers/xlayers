import { Injectable } from '@angular/core';
import { BplistService } from './bplist.service';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

@Injectable({
  providedIn: 'root',
})
export class TextService {
  constructor(private binaryHelperService: BplistService) {}

  identify(current: FileFormat.AnyLayer) {
    return (current._class as string) === 'text';
  }

  lookup(current: FileFormat.Text) {
    return (
      current.attributedString.string ||
      this.extractAttributedStringText(current)
    );
  }

  private extractAttributedStringText(current: FileFormat.Text) {
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
