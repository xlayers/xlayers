import {
  AfterContentInit,
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CodeGen, CodeGenSettings } from '@app/core/state/page.state';
import { Store } from '@ngxs/store';
import { CodeGenKind, CodeGenService } from './codegen/codegen.service';
import { PAGE_DOWN, PAGE_UP } from '@angular/cdk/keycodes';

const githubIssueLink =
  // tslint:disable-next-line:max-line-length
  'https://github.com/xlayers/xlayers/issues/new?assignees=&labels=Priority%3A+Low%2C+Scope%3A+CodeGen%2C+community-help%2C+effort2%3A+medium+%28days%29%2C+good+first+issue%2C+type%3A+discussion+%2F+RFC&template=codegen--add---technology---support.md&title=CodeGen%3A+add+%5B%5Btechnology%5D%5D+support';

@Component({
  selector: 'xly-editor-container',
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.css']
})
export class EditorContainerComponent implements OnInit, AfterContentInit {
  codeSetting: CodeGenSettings;
  @ViewChild('codeContentEditor', { static: false }) codeEditor: ElementRef;

  frameworks: Array<{
    title: string;
    logo: FunctionStringCallback;
  }>;

  constructor(private codegen: CodeGenService, private readonly store: Store) {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.generateAngular();
  }

  onEditorInit(editor: any, ctrl: HTMLElement) {
    ctrl.focus();
  }

  generateAngular() {
    this.codeSetting = this.codegen.generate(CodeGenKind.Angular);
    this.updateState();
  }

  generateAngularElement() {
    this.codeSetting = this.codegen.generate(CodeGenKind.AngularElement);
    this.updateState();
  }

  generateReact() {
    this.codeSetting = this.codegen.generate(CodeGenKind.React);
    this.updateState();
  }

  generateVue() {
    this.codeSetting = this.codegen.generate(CodeGenKind.Vue);
    this.updateState();
  }

  generateWc() {
    this.codeSetting = this.codegen.generate(CodeGenKind.WC);
    this.updateState();
  }

  generateStencil() {
    this.codeSetting = this.codegen.generate(CodeGenKind.Stencil);
    this.updateState();
  }

  generateLitElement() {
    this.codeSetting = this.codegen.generate(CodeGenKind.LitElement);
    this.updateState();
  }

  generateXamarinForms() {
    this.codeSetting = this.codegen.generate(CodeGenKind.XamarinForms);
    this.updateState();
  }

  updateState() {
    this.store.dispatch(
      new CodeGen(
        this.codeSetting.kind,
        this.codeSetting.content,
        this.codeSetting.buttons
      )
    );
  }

  simulateContentEditorScroll($event) {
    const keyCode = $event.keyCode || $event.charCode || $event.which;
    const scroll = Math.round(0.9 * this.codeEditor.nativeElement.clientHeight);

    // Page Down
    if (
      keyCode === PAGE_DOWN ||
      $event.key === 'PageDown' ||
      $event.code === 'PageDown'
    ) {
      this.codeEditor.nativeElement.scrollTop += scroll;
      return false;
    }
    // Page Up
    if (
      keyCode === PAGE_UP ||
      $event.key === 'PageUp' ||
      $event.code === 'PageUp'
    ) {
      this.codeEditor.nativeElement.scrollTop -= scroll;
      return false;
    }

    return true;
  }
}
