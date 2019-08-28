export interface SvgCodeGenOptions {
  xmlNamespace?: boolean;
  force?: boolean;
}

export interface SvgCodeGenContextPath {
  type: string;
  attributes: string[];
}

export interface SvgCodeGenContext {
  paths?: SvgCodeGenContextPath[];
  attributes?: string[];
  offset?: number;
}
