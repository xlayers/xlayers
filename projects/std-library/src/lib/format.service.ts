import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  indent(n: number, content: string) {
    const indentation = !!n ? '  '.repeat(n) : '';
    return indentation + content;
  }

  normalizeName(name: String) {
    return name.replace(/[^a-zA-Z ]/g, "");
  }
}
