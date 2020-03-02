import { Injectable } from '@angular/core';
import { XmlCodeGenVisitor } from './xmlcodegenvisitor.service';
import { Shape } from './shape.service';
import { SvgCodeGenService } from '@xlayers/svg-codegen';

/**
 * @see XmlCodeGenVisitor implementation that can be used to generate Xamarin.Forms code.
 */
@Injectable({
  providedIn: 'root'
})
export class XamarinFormsCodeGenVisitor extends XmlCodeGenVisitor {
  constructor(private readonly svgCodeGen: SvgCodeGenService) {
    super();
  }

  fileList = [];

  protected visitLayer(
    layer: SketchMSLayer,
    template: string[] = [],
    depth: number = 0
  ) {
    let content;

    if ((layer as any)._class === 'group') {
      template.push(this.indent(depth, this.openGroup(layer)));
      content = this.visit(layer, template, depth + 1);
      template.push(this.indent(depth + 1, this.closeTag('AbsoluteLayout')));
      template.push(this.indent(depth, this.closeTag('Frame')));
    } else {
      content = this.visit(layer, template, depth + 1);
    }

    if (content) {
      template.push(this.indent(depth + 1, content));
    }
  }

  protected visitBitmap(ast: SketchMSLayer): string {
    return `<Image Source="${(ast as any).image._ref}">`;
  }

  protected visitText(ast: SketchMSTextLayer): string {
    const attr: any = {};
    const string = ast.attributedString;
    const fontAttribute =
      string.attributes[0].attributes.MSAttributedStringFontAttribute
        .attributes;
    const colorAttribute = (string.attributes[0].attributes as any)
      .MSAttributedStringColorAttribute;

    attr.Text = string.string;
    attr.FontSize = fontAttribute.size;
    attr.FontFamily = fontAttribute.name;
    attr.TextColor = this.colorRatioToHex(colorAttribute);
    attr.Opacity = colorAttribute.alpha;
    attr['AbsoluteLayout.LayoutBounds'] = `${Math.round(
      ast.frame.x
    )}, ${Math.round(ast.frame.y)}, ${Math.round(
      ast.frame.width
    )}, ${Math.round(ast.frame.height)}`;

    return (
      '<Label ' +
      Object.keys(attr)
        .map(function(key) {
          return key + '="' + attr[key] + '"';
        })
        .join('\n' + ' '.repeat(7)) +
      '/>'
    );
  }

  protected visitShape(ast: SketchMSLayer): string {
    if ((ast as any).shapeVisited === true) {
      return null;
    }

    const a = new Shape((ast as any).points);
    if (a.isRound()) {
      return this.visitRound(ast);
    } else if (a.isRectangle()) {
      return this.visitRectangle(ast);
    } else if (a.isLine()) {
      return this.visitLine(ast);
    } else {
      return this.visitSvg(ast);
    }
  }

  protected visitOther(ast: SketchMSLayer): string {
    if ((ast as any).shapeVisited === true) {
      return null;
    }

    if (
      (ast as any)._class === 'oval' ||
      ((ast as any)._class === 'rectangle' &&
        (!!ast.style.fills || !!ast.style.borders))
    ) {
      return (
        `<Frame ` +
        this.generateAbsoluteLayout(ast) +
        ` CornerRadius="${
          (ast as any)._class === 'oval' ? ast.frame.width / 2 : '0'
        }"` +
        (!!ast.style.fills
          ? ' BackgroundColor="' +
            this.colorRatioToHex(ast.style.fills[0].color) +
            '" Opacity="' +
            ast.style.fills[0].color.alpha +
            '"'
          : ' BackgroundColor="Transparent"') +
        (!!ast.style.borders
          ? ' BorderColor="' +
            this.colorRatioToHex(ast.style.borders[0].color) +
            '"'
          : '') +
        ' HasShadow="false" />'
      );
    }
  }

  protected visitRound(ast: SketchMSLayer): string {
    return (
      `<Frame ` +
      this.generateAbsoluteLayout(ast) +
      ` CornerRadius="${ast.frame.width / 2}"` +
      (!!ast.style.fills
        ? ' BackgroundColor="' +
          this.colorRatioToHex(ast.style.fills[0].color) +
          '" Opacity="' +
          ast.style.fills[0].color.alpha +
          '"'
        : ' BackgroundColor="Transparent"') +
      (!!ast.style.borders
        ? ' BorderColor="' +
          this.colorRatioToHex(ast.style.borders[0].color) +
          '"'
        : '') +
      ' HasShadow="false" />'
    );
  }

  protected visitRectangle(ast: SketchMSLayer): string {
    if (!!ast.style.borders) {
      return (
        `<Frame ` +
        this.generateAbsoluteLayout(ast) +
        ` CornerRadius="0"` +
        ` BorderColor="${this.colorRatioToHex(ast.style.borders[0].color)}"` +
        (!!ast.style.fills
          ? ` BackgroundColor="${this.colorRatioToHex(
              ast.style.fills[0].color
            )}"` + ` Opacity="${ast.style.fills[0].color.alpha}"`
          : ` BackgroundColor="Transparent"`) +
        ` HasShadow="false" />`
      );
    } else if (!!ast.style.fills) {
      return (
        `<BoxView ` +
        this.generateAbsoluteLayout(ast) +
        ` Color="${this.colorRatioToHex(ast.style.fills[0].color)}"` +
        ` Opacity="${ast.style.fills[0].color.alpha}" />`
      );
    } else {
      return '';
    }
  }

  protected visitLine(ast: SketchMSLayer): string {
    return (
      `<BoxView AbsoluteLayout.LayoutBounds="${Math.round(
        ast.frame.x
      )}, ${Math.round(ast.frame.y)}, ${Math.round(ast.frame.width)}, 1"` +
      (!!ast.style.fills
        ? ` Color="${this.colorRatioToHex(ast.style.fills[0].color)}"` +
          ` Opacity="${ast.style.fills[0].color.alpha}" />`
        : ` Color="${this.colorRatioToHex(ast.style.borders[0].color)}"` +
          ` Opacity="${ast.style.borders[0].color.alpha}" />`)
    );
  }

  protected visitSvg(ast: SketchMSLayer): string {
    const svgFileName = this.sanitizeSvgFileName(ast.do_objectID);
    this.fileList.push({
      ...this.svgCodeGen.aggregate(ast)[0],
      uri: svgFileName,
      kind: 'xamarinForms'
    });

    return (
      `<ffSvg:SvgCachedImage Source="resource://xLayers.path.to.${svgFileName}"` +
      `\n` +
      ` `.repeat(22) +
      this.generateAbsoluteLayout(ast) +
      `/>`
    );
  }

  protected openGroup(ast: SketchMSLayer): string {
    const border = this.checkLayersForBorder(ast);
    const background = this.checkLayersForBackground(ast);

    return (
      `<Frame ` +
      this.generateAbsoluteLayout(ast) +
      ` CornerRadius="0" Padding="0"` +
      (border !== false ? ' BorderColor="' + border + '"' : '') +
      ' BackgroundColor="' +
      (background !== false ? background : 'Transparent') +
      '"' +
      ` HasShadow="false">` +
      `\n  <AbsoluteLayout>`
    );
  }

  private sanitizeSvgFileName(name: string): string {
    return '_' + name.toLowerCase().replace(/[^a-z0-9\_]/g, '_') + '.svg';
  }

  private generateAbsoluteLayout(ast: SketchMSLayer): string {
    return `AbsoluteLayout.LayoutBounds="${Math.round(
      ast.frame.x
    )}, ${Math.round(ast.frame.y)}, ${Math.round(
      ast.frame.width
    )}, ${Math.round(ast.frame.height)}"`;
  }

  consumeFileList(): any {
    const tempFileList = this.fileList;
    this.fileList = [];
    return tempFileList;
  }
}
