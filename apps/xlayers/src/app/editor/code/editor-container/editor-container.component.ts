import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { CodeGenKind, CodeGenService } from './codegen/codegen.service';
import { PAGE_DOWN, PAGE_UP } from '@angular/cdk/keycodes';
import {
  CodeGenSettings,
  CodeGen,
  CodeGenState,
} from '../../../core/state/page.state';
import { codeGenList, UICodeGen } from '@xlayers-apps/shared/codegen-list';

const githubIssueLink =
  // eslint-disable-next-line max-len
  'https://github.com/xlayers/xlayers/issues/new?assignees=&labels=Priority%3A+Low%2C+Scope%3A+CodeGen%2C+community-help%2C+effort2%3A+medium+%28days%29%2C+good+first+issue%2C+type%3A+discussion+%2F+RFC&template=codegen--add---technology---support.md&title=CodeGen%3A+add+%5B%5Btechnology%5D%5D+support';

@Component({
  selector: 'xly-editor-container',
  templateUrl: './editor-container.component.html',
  styleUrls: ['./editor-container.component.css'],
})
export class EditorContainerComponent implements OnInit {
  codeSetting: CodeGenSettings;
  @ViewChild('codeContentEditor') codeEditor: ElementRef;

  public frameworks: UICodeGen[] = codeGenList;

  public selectedFramework: UICodeGen = this.frameworks[0];

  constructor(
    private readonly codegen: CodeGenService,
    private readonly store: Store
  ) {}

  ngOnInit() {
    this.store.select(CodeGenState.codegen).subscribe((codegen) => {
      if (codegen.kind) {
        this.selectedFramework = this.frameworks.find(
          (framework) => framework.codegenType === codegen.kind
        );
        this.codeSetting = this.codegen.generate(codegen.kind);
      }
    });
  }

  onChange(event: any) {
    const {
      value: { codegenType },
    } = event;
    this.codeSetting = this.codegen.generate(codegenType);
    this.updateState();
  }

  onEditorInit(editor: any, ctrl: HTMLElement) {
    ctrl.focus();
  }

  generateSvelte() {
    this.codeSetting = this.codegen.generate(CodeGenKind.Svelte);
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
