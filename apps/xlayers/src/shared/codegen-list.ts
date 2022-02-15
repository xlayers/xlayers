import { CodeGenKind } from '../app/editor/code/editor-container/codegen/codegen.service';

export interface UICodeGen {
  label: string;
  svgIcon: string;
  codegenType: CodeGenKind;
}

export const codeGenList: UICodeGen[] = [
  {
    label: 'Angular',
    svgIcon: 'angular',
    codegenType: CodeGenKind.Angular,
  },
  {
    label: 'Angular Element',
    svgIcon: 'angularElement',
    codegenType: CodeGenKind.AngularElement,
  },
  {
    label: 'Vue',
    svgIcon: 'vue',
    codegenType: CodeGenKind.Vue,
  },
  {
    label: 'React',
    svgIcon: 'react',
    codegenType: CodeGenKind.React,
  },
  {
    label: 'WebComponents',
    svgIcon: 'wc',
    codegenType: CodeGenKind.WC,
  },
  {
    label: 'Stencil',
    svgIcon: 'stencil',
    codegenType: CodeGenKind.Stencil,
  },
  {
    label: 'LitElement',
    svgIcon: 'litElement',
    codegenType: CodeGenKind.LitElement,
  },
  {
    label: 'Svelte',
    svgIcon: 'svelte',
    codegenType: CodeGenKind.Svelte,
  },
];
