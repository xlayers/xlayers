export interface WebBlocGenOptions {
  generateClassName?: boolean;
  xmlNamespace?: boolean;
  mode?: string;
  jsx?: boolean;
  xmlPrefix?: string;
  cssPrefix?: string;
  componentDir?: string;
  assetDir?: string;
}

export interface WebBlocGenContext {
  className?: string;
  html?: string;
  components?: string[];
}
