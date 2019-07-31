export interface WebBlocGenOptions {
  mode?: string;
  jsx?: boolean;
  xmlPrefix?: string;
  cssPrefix?: string;
  componentDir?: string;
  assetDir?: string;
}

export interface WebBlocGenContext {
  className?: string;
  html?: string[];
  css?: string[];
  components?: string[];
}
