export interface CssCodeGenOptions {
  generateClassName?: boolean;
  cssPrefix?: string;
  componentDir?: string;
  force?: boolean;
}

export interface RuleSet {
  [key: string]: string;
}

export interface CssCodeGenContext {
  rules?: RuleSet;
  className?: string;
  pseudoElements?: { [key: string]: RuleSet };
}
