export interface CssBlocGenOptions {
  generateClassName?: boolean;
  cssPrefix?: string;
  componentDir?: string;
  force?: boolean;
}

export interface RuleSet {
  [key: string]: string;
}

export interface CssBlocGenContext {
  rules?: RuleSet;
  className?: string;
  pseudoElements?: { [key: string]: RuleSet };
}
