export interface CssBlocGenOptions {
  cssPrefix?: string;
  componentDir?: string;
}

export interface CssBlocGenContext {
  rules?: { [key: string]: string };
  className?: string;
}
