import { Injectable } from '@angular/core';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
@Injectable({
  providedIn: 'root',
})
export class StyleService {
  parseColor(color: FileFormat.Color) {
    return {
      red: this.percentToRgba(color.red),
      green: this.percentToRgba(color.green),
      blue: this.percentToRgba(color.blue),
      alpha: color.alpha,
    };
  }

  parseColorAsRgba(color: FileFormat.Color) {
    const c = this.parseColor(color);
    const colorString = [c.red, c.green, c.blue, c.alpha.toFixed(2)].join(',');
    return `rgba(${colorString})`;
  }

  parseColorAsHex(color: FileFormat.Color) {
    const c = this.parseColor(color);

    return (
      '#' +
      ((256 + c.red).toString(16).substr(1) +
        (
          ((1 << 24) + (c.green << 16)) |
          (c.blue << 8) |
          this.percentToRgba(c.alpha)
        )
          .toString(16)
          .substr(1))
    );
  }

  private percentToRgba(v: number) {
    const color = Math.round(v * 255);
    return color > 0 ? color : 0;
  }
}
