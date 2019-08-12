export interface CssBlocGenOptions {
  generateClassName?: boolean;
  cssPrefix?: string;
  componentDir?: string;
}

export interface CssBlocGenContext {
  rules?: { [key: string]: string };
  className?: string;
}
