import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StyleHelperService {
  parseColors(color: SketchMSColor) {
    const { red, green, blue, alpha } = color;
    return {
      red: this.percentToRgba(red),
      green: this.percentToRgba(green),
      blue: this.percentToRgba(blue),
      alpha
    };
  }

  parseColorAsRgba(color: SketchMSColor) {
    const colorObject = this.parseColors(color);
    const colorString = [
      colorObject.red,
      colorObject.green,
      colorObject.blue,
      colorObject.alpha
    ].join(",");
    return `rgba(${colorString})`;
  }

  parseColorAsHex(color: SketchMSColor) {
    const colorObject = this.parseColors(color);

    return (
      "#" +
      ((256 + this.percentToRgba(colorObject.red)).toString(16).substr(1) +
        (
          ((1 << 24) + (this.percentToRgba(colorObject.green) << 16)) |
          (this.percentToRgba(colorObject.blue) << 8) |
          this.percentToRgba(colorObject.alpha)
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
