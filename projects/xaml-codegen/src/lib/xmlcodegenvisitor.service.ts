import { CodeGenVisitor } from './codegenvisitor.service';
import { RouteConfigLoadEnd } from '@angular/router';

/**
 * @see CodeGenVisitor implementation that can be used to generate code in an XML-based representation.
 */
export abstract class XmlCodeGenVisitor extends CodeGenVisitor {
  private indentationSymbol = '  '; // 2 spaces ftw

  protected openTag(tag: string, attributes = [], autoclose = false): string {
    return `<${tag}${
      attributes.length !== 0 ? ' ' + attributes.join(' ') : ''
    }${autoclose ? ' /' : ''}>`;
  }

  protected closeTag(tag: string): string {
    return `</${tag}>`;
  }

  protected indent(n: number, content: string): string {
    const indentation = !!n ? this.indentationSymbol.repeat(n) : '';
    return indentation + content.split('\n').join('\n' + indentation);
  }
}
