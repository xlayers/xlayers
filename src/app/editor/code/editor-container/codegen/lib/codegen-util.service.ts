import { Injectable } from '@angular/core';

/**
 * @see CodeGenVisitor implementation that can be used to generate code in an XML-based representation.
 */
@Injectable({
  providedIn: 'root'
})
export class CodeGenUtilService {
  colorRatioToHex(color: SketchMSColor) {
    return (
      '#' +
      Math.round(color.red * 255)
        .toString(16)
        .padStart(2, '0') +
      Math.round(color.green * 255)
        .toString(16)
        .padStart(2, '0') +
      Math.round(color.blue * 255)
        .toString(16)
        .padStart(2, '0')
    );
  }

  // return colorhex: string or false
  checkLayersForBorder(ast: SketchMSLayer): string | boolean {
    let border: string | boolean = false;
    for (const layer of ast.layers) {
      border = this.checkForBorder(ast, layer);
      if (border !== false) {
        return border;
      }
    }
    return border;
  }

  // return colorhex: string or false
  private checkForBorder(
    parent: SketchMSLayer,
    ast: SketchMSLayer
  ): string | boolean {
    if (
      ast.frame.x === 0 &&
      ast.frame.y === 0 &&
      parent.frame.width === ast.frame.width &&
      parent.frame.height === ast.frame.height &&
      !!ast.style.borders
    ) {
      (ast as any).shapeVisited = true;
      return this.colorRatioToHex(ast.style.borders[0].color);
    }
    return false;
  }

  // return colorhex: string or false
  checkLayersForBackground(ast: SketchMSLayer): string | boolean {
    let background: string | boolean = false;
    for (const layer of ast.layers) {
      background = this.checkForBackground(ast, layer);
      if (background !== false) {
        return background;
      }
    }
    return background;
  }

  // return colorhex: string or false
  private checkForBackground(
    parent: SketchMSLayer,
    ast: SketchMSLayer
  ): string | boolean {
    if (
      ast.frame.x === 0 &&
      ast.frame.y === 0 &&
      parent.frame.width === ast.frame.width &&
      parent.frame.height === ast.frame.height &&
      !!ast.style.fills &&
      ast.style.fills[0].color.alpha !== 0
    ) {
      (ast as any).shapeVisited = true;
      return this.colorRatioToHex(ast.style.fills[0].color);
    }
    return false;
  }
}
