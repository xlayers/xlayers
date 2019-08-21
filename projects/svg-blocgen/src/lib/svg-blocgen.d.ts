export interface SvgBlocGenOptions {
  xmlNamespace?: boolean;
  force?: boolean;
}

export interface SvgBlocGenContextPath {
  type: string;
  attributes: string[];
}

export interface SvgBlocGenContext {
  paths?: SvgBlocGenContextPath[];
  attributes?: string[];
  offset?: number;
}
