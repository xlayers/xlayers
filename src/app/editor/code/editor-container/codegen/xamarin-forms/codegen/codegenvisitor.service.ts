import { Template } from '../../shared-codegen.service';

/**
 * Visitor-like pattern used for code generation purposes, by iterating through an AST and
 * delegating the codegen to its subclasses.
 */
export abstract class CodeGenVisitor {
    /**
     * Generates a string template by visiting the tree
     * @param ast The Sketch AST
     */
    generateTemplate(ast: SketchMSLayer, mainPageTemplate: (string) => string): string {
      const template: Array<string> = [];
      this.visit(ast, template, 2);
      return mainPageTemplate(template.join('\n'));
    }

    protected visit(ast: SketchMSLayer, template: string[] = [], depth: number = 0): string {
      if (ast.layers && Array.isArray(ast.layers)) {
          ast.layers.forEach(layer => this.visitLayer(layer, template, depth));
      } else {
        if ((ast as any)._class === 'text') {
          return this.visitText(ast);
        } else if ((ast as any)._class === 'bitmap') {
          return this.visitBitmap(ast);
        } else if ((ast as any).shape) {
          return this.visitShape(ast);
        } else {
          return this.visitOther(ast);
        }
      }
    }

    protected visitLayer(layer: SketchMSLayer, template: string[], depth: number) {
      const content = this.visit(layer, template, depth + 1);
      if (content) {
        template.push(content);
      }
    }

    protected visitShape(ast: SketchMSLayer): string {
      return (ast as any).shape;
    }

    protected abstract visitText(ast: SketchMSLayer): string;
    protected abstract visitBitmap(ast: SketchMSLayer): string;
    protected abstract visitOther(ast: SketchMSLayer): string;
    protected abstract openTag(tag: string): string;
    protected abstract closeTag(tag: string): string;

    protected colorRatioToHex(color: SketchMSColor) {
      return '#' + Math.round(color.red * 255).toString(16).padStart(2, '0')
        + Math.round(color.green * 255).toString(16).padStart(2, '0')
        + Math.round(color.blue * 255).toString(16).padStart(2, '0');
    }

    // return colorhex: string or false
    protected checkLayersForBorder(ast: SketchMSLayer): string | boolean {
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
    private checkForBorder(parent: SketchMSLayer, ast: SketchMSLayer): string | boolean {
      if ( ast.frame.x === 0
        && ast.frame.y === 0
        && parent.frame.width === ast.frame.width
        && parent.frame.height === ast.frame.height
        && !!ast.style.borders) {
          (ast as any).shapeVisited = true;
          return this.colorRatioToHex(ast.style.borders[0].color);
      }
      return false;
    }

    // return colorhex: string or false
    protected checkLayersForBackground(ast: SketchMSLayer): string | boolean {
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
    private checkForBackground(parent: SketchMSLayer, ast: SketchMSLayer): string | boolean {
      if ( ast.frame.x === 0
        && ast.frame.y === 0
        && parent.frame.width === ast.frame.width
        && parent.frame.height === ast.frame.height
        && !!ast.style.fills
        && ast.style.fills[0].color.alpha !== 0) {
          (ast as any).shapeVisited = true;
          return this.colorRatioToHex(ast.style.fills[0].color);
      }
      return false;
    }
}
