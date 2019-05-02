import { XlayersNgxEditorModel } from "../codegen.service";

/**
 * Visitor-like pattern used for code generation purposes, by iterating through an AST and
 * delegating the codegen to its subclasses.
 */
export abstract class CodeGen {
  protected visit(
    ast: SketchMSLayer,
    template: string[] = [],
    depth: number = 0
  ): string {
    if (ast.layers && Array.isArray(ast.layers)) {
      ast.layers.forEach(layer => this.visitLayer(layer, template, depth));
    } else {
      if ((ast as any)._class === "text") {
        return this.visitText(ast);
      } else if ((ast as any)._class === "bitmap") {
        return this.visitBitmap(ast);
      } else if ((ast as any).shape) {
        return this.visitShape(ast);
      } else {
        return this.visitOther(ast);
      }
    }
  }

  protected visitLayer(
    layer: SketchMSLayer,
    template: string[],
    depth: number
  ) {
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

  protected abstract generateComponent(content: string): XlayersNgxEditorModel;
  protected abstract generateTest(content: string): XlayersNgxEditorModel;
}
