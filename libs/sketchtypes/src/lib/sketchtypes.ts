// export Type definitions for non-npm package the SketchApp 56.0
// Project: https://github.com/xlayers/xlayers
// Definitions by: Wassim Chegham <https://github.com/manekinekko>
//                 Phetsinorath William <https://github.com/shikanime>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

export type SketchMSFillTypeEnum = 0 | 1 | 4 | 5;
export type SketchMSBorderPositionEnum = 0 | 1 | 2 | 3;
export interface SketchMSBorder {
  _class: 'border';
  isEnabled: boolean;
  color: SketchMSColor;
  fillType: SketchMSFillTypeEnum;
  position: SketchMSBorderPositionEnum;
  thickness: number;
}
export type SketchMSBorderLineCapStyle = 0 | 1 | 2;
export type SketchMSBorderLineJoinStyle = 0 | 1 | 2;
export interface SketchMSBorderOptions {
  _class: 'borderOptions';
  isEnabled: boolean;
  dashPattern: number[];
  lineCapStyle: SketchMSBorderLineCapStyle;
  lineJoinStyle: SketchMSBorderLineJoinStyle;
}
export interface SketchMSImageDataReference {
  _class: 'jSONOriginalDataReference';
  _ref: string;
  _ref_class: 'imageData';
  data: {
    _data: string;
  };
  sha1: {
    _data: string;
  };
}
export type SketchMSPatternFillTypeEnum = 0 | 1 | 2 | 3;
export interface SketchMSFill {
  _class: 'fill';
  isEnabled: boolean;
  color?: SketchMSColor;
  fillType: SketchMSFillTypeEnum;
  image?: SketchMSImageDataReference;
  noiseIndex: number;
  noiseIntensity: number;
  patternFillType: SketchMSPatternFillTypeEnum;
  patternTileScale: number;
}
export interface SketchMSShadow {
  _class: 'shadow' | 'MSInnerShadow';
  isEnabled: boolean;
  blurRadius: number;
  color: SketchMSColor;
  contextSettings: SketchMSGraphicsContextSettings;
  offsetX: number;
  offsetY: number;
  spread: number;
}
export interface SketchMSStyleBorder {
  _class: 'styleBorder';
  position: number;
  color: SketchMSColor;
  gradient: SketchMSGradient;
  fillType: number;
  thickness: number;
  contextSettings: SketchMSGraphicsContextSettings;
  isEnabled: number;
}
export interface SketchMSGradientStop {
  _class: 'gradientStop';
  color: SketchMSColor;
  position: number;
}
export interface SketchMSGradient {
  _class: 'gradient';
  from: {
    x: number;
    y: number;
  };
  shouldSmoothenOpacity: boolean;
  gradientType: number;
  stops: SketchMSGradientStop[];
  to: {
    x: number;
    y: number;
  };
  elipseLength: number;
}
export interface SketchMSStyleFill {
  _class: 'styleFill';
  contextSettings: SketchMSGraphicsContextSettings;
  color: SketchMSColor;
  gradient: SketchMSGradient;
  fillType: number;
  noiseIntensity: number;
  patternFillType: number;
  patternTileScale: number;
  noiseIndex: number;
  isEnabled: number;
}
export interface SketchMSStyleShadow {
  _class: 'styleShadow';
  spread: number;
  color: SketchMSColor;
  offsetY: number;
  offsetX: number;
  blurRadius: number;
  contextSettings: SketchMSGraphicsContextSettings;
  isEnabled: number;
}
export interface SketchMSParagraphStyle {
  _class: 'paragraphStyle';
  alignment: number;
  allowsDefaultTighteningForTruncation: number;
}
export interface SketchMSStyleBorderOptions {
  _class: 'styleBorderOptions';
  lineJoinStyle: number;
  isEnabled: number;
  lineCapStyle: number;
  dashPattern: unknown[];
}
export interface SketchMSGraphicsContextSettings {
  _class: 'graphicsContextSettings';
  opacity: number;
  blendMode: SketchMSGraphicsContextSettingsBlendMode;
}
export type SketchMSGraphicsContextSettingsBlendMode =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;
export interface SketchMSStyleBlur {
  _class: 'styleBlur';
  radius: number;
  motionAngle: number;
  isEnabled: number;
  type: number;
  center: {
    x: number;
    y: number;
  };
}
export interface SketchMSStyleReflection {
  _class: 'styleReflection';
  strength: number;
  isEnabled: number;
  distance: number;
}
export interface SketchMSStyleColorControls {
  _class: 'styleColorControls';
  hue: number;
  brightness: number;
  contrast: number;
  isEnabled: number;
  saturation: number;
}
export interface SketchMSFontAttribute {
  _class: 'fontDescriptor';
  attributes: {
    name: string;
    size: number;
  };
}
export interface SketchMSAttributes {
  MSAttributedStringColorAttribute: SketchMSColor;
  MSAttributedStringFontAttribute: SketchMSFontAttribute;
  paragraphStyle: SketchMSParagraphStyle;
  kerning: number;
}
export interface SketchMSStringAttribute {
  _class: 'stringAttribute';
  attributes: SketchMSAttributes;
}
export interface SketchMSTextStyle {
  _class: 'textStyle';
  encodedAttributes: SketchMSAttributes;
}
export interface SketchMSStyle {
  _class: 'style';
  do_objectID: string;
  endMarkerType: number;
  miterLimit: number;
  startMarkerType: number;
  windingRule: number;
  startDecorationType?: number;
  borderOptions?: SketchMSStyleBorderOptions;
  endDecorationType?: number;
  contextSettings?: SketchMSGraphicsContextSettings;
  blur?: SketchMSStyleBlur;
  textStyle?: SketchMSTextStyle;
  reflection?: SketchMSStyleReflection;
  colorControls?: SketchMSStyleColorControls;
  fills?: SketchMSStyleFill[];
  borders?: SketchMSStyleBorder[];
  innerShadows?: SketchMSStyleShadow[];
  shadows?: SketchMSStyleShadow[];
}
export interface SketchMSAttributedString {
  _class: 'attributedString';
  string: string;
  attributes: SketchMSStringAttribute[];
  archivedAttributedString?: {
    _archive: string;
  };
}
export interface SketchMSTextLayer extends SketchMSContainerLayer {
  _class: 'text';
  attributedString: SketchMSAttributedString;
}
export interface SketchMSLayoutSimpleGrid {
  _class: 'simpleGrid';
  thickGridTimes: number;
  isEnabled: number;
  gridSize: number;
}
export interface SketchMSLayoutGrid {
  _class: 'layoutGrid';
  isEnabled: boolean;
  columnWidth: number;
  drawHorizontal: boolean;
  drawHorizontalLines: boolean;
  drawVertical: boolean;
  gutterHeight: number;
  gutterWidth: number;
  guttersOutside: boolean;
  horizontalOffset: number;
  numberOfColumns: number;
  rowHeightMultiplication: number;
  totalWidth: number;
}
export type SketchMSLayout = SketchMSLayoutGrid | SketchMSLayoutSimpleGrid;
export interface SketchMSFlowConnection {
  _class: 'immutableFlowConnection';
  animationType: number;
  destinationArtboardID?: string | 'back';
}
export type SketchMSFlow = SketchMSFlowConnection;
export interface SketchMSImmutableHotspotLayer extends SketchMSLayer {
  _class: 'MSImmutableHotspotLayer';
  flow: SketchMSFlow;
}
export type SketchMSPointString = string;
export type SketchMSCurveMode = 0 | 1 | 2 | 3 | 4;
export interface SketchMSCurvePoint {
  _class: 'curvePoint';
  cornerRadius: number;
  curveFrom: SketchMSPointString;
  curveMode: SketchMSCurveMode;
  curveTo: SketchMSPointString;
  hasCurveFrom: boolean;
  hasCurveTo: boolean;
  point: SketchMSPointString;
}
export type SketchMSPoint = SketchMSCurvePoint;
export interface SketchMSPathLayer extends SketchMSLayer {
  _class: 'path' | 'shapePath' | 'rectangle' | 'oval' | 'triangle';
  edited: boolean;
  isClosed: boolean;
  pointRadiusBehaviour: number;
  points: SketchMSPoint[];
}
export interface SketchMSColor {
  _class: 'color';
  red: number;
  green: number;
  blue: number;
  alpha: number;
}
export interface SketchMSSymbolMasterLayer extends SketchMSPageLayer {
  _class: 'symbolMaster';
  backgroundColor: SketchMSColor;
  hasBackgroundColor: boolean;
  includeBackgroundColorInExport: boolean;
  isFlowHome: boolean;
  resizesContent: boolean;
  includeBackgroundColorInInstance: boolean;
  symbolID: string;
  changeIdentifier: number;
}
export interface SketchMSSymbolInstanceLayer extends SketchMSLayer {
  _class: 'symbolInstance';
  horizontalSpacing: number;
  overrideValues: unknown[];
  scale: number;
  symbolID: string;
  verticalSpacing: number;
}
export interface SketchMSRulerData {
  _class: 'rulerData';
  base: number;
  guides: unknown[];
}
export interface SketchMSPageLayer extends SketchMSContainerLayer {
  _class: 'page' | 'symbolMaster';
  hasClickThrough: boolean;
  horizontalRulerData: SketchMSRulerData;
  includeInCloudUpload: boolean;
  verticalRulerData: SketchMSRulerData;
}
export interface SketchMSRect {
  _class: 'rect';
  constrainProportions: boolean;
  height: number;
  width: number;
  x: number;
  y: number;
}
export type SketchMSLayerBooleanOperation = -1 | 0 | 1 | 2 | 3;
export interface SketchMSLayerExportOptions {
  _class: 'exportOptions';
  exportFormats: unknown[];
  includedLayerIds: unknown[];
  layerOptions: number;
  shouldTrim: boolean;
}
export type SketchMSLayerFrame = SketchMSRect;
export type SketchMSLayerResizingType = 0 | 1 | 2 | 3;
export type SketchMSLayerClippingMaskMode = 0 | 1;
export interface SketchMSContainerLayer extends SketchMSLayer {
  _class: string;
  layers: SketchMSContainerLayer[];
}
export interface SketchMSLayer {
  _class: string;
  do_objectID: string;
  booleanOperation: SketchMSLayerBooleanOperation;
  exportOptions: SketchMSLayerExportOptions;
  frame: SketchMSLayerFrame;
  isFixedToViewport: boolean;
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  isLocked: boolean;
  isVisible: boolean;
  layerListExpandedType: number;
  name: string;
  nameIsFixed: boolean;
  resizingConstraint: number;
  resizingType: SketchMSLayerResizingType;
  rotation: number;
  shouldBreakMaskChain: boolean;
  clippingMaskMode: SketchMSLayerClippingMaskMode;
  hasClippingMask: boolean;
  style: SketchMSStyle;
  layers?: SketchMSLayer[];

  // xLayers custom property
  css?: string;
  web?: XLayersWebCodeGenContext;
}
export interface XLayersWebCodeGenContext {
  components?: string[];
  attributes?: string[];
}

export interface SketchMSSharedStyle {
  _class: 'sharedStyle';
  value: SketchMSStyle;
  name: string;
}
export interface SketchMSImageCollection {
  _class: 'imageCollection';
  images: unknown[];
}
export interface SketchMSDocumentAssets {
  _class: 'assetCollection';
  gradients: unknown[];
  colors: unknown[];
  imageCollection: SketchMSImageCollection;
  images: unknown[];
}
export interface SketchMSImmutableForeignSymbol {
  _class: 'MSImmutableForeignSymbol';
  libraryID: string;
  sourceLibraryName: string;
  symbolPrivate: boolean;
  originalMaster: SketchMSSymbolMasterLayer;
  symbolMaster: SketchMSSymbolMasterLayer;
}
export interface SketchMSSharedStyleContainer {
  _class: 'sharedStyleContainer';
  objects: SketchMSSharedStyle[];
}
export interface SketchMSSymbolContainers {
  _class: 'symbolContainer';
  objects: unknown[];
}
export interface SketchMSSharedTextStyleContainer {
  _class: 'sharedTextStyleContainer';
  objects: unknown[];
}
export interface SketchMSPageReference {
  _class: 'MSJSONFileReference';
  _ref_class: 'MSImmutablePage';
  _ref: string;
}
export interface SketchMSDocument {
  _class: 'documentData';
  do_objectID: string;
  assets: SketchMSDocumentAssets;
  colorSpace: number;
  currentPageIndex: number;
  foreignSymbols: SketchMSImmutableForeignSymbol[];
  foreignTextStyles: unknown[];
  layerStyles: SketchMSSharedStyleContainer;
  layerSymbols: SketchMSSymbolContainers;
  layerTextStyles: SketchMSSharedTextStyleContainer;
  pages: SketchMSPageReference[];
}
export interface SketchMSArtboard {
  frame: SketchMSRect;
  backgroundColor: SketchMSColor;
  hasBackgroundColor: boolean;
  horizontalRulerData?: SketchMSRulerData;
  verticalRulerData?: SketchMSRulerData;
  includeBackgroundColorInExport?: boolean;
  includeInCloudUpload?: boolean;
  isFlowHome?: boolean;
}
export interface SketchMSArtboards {
  name: string;
  artboards: SketchMSArtboard;
}
export interface SketchMSPagesAndArtboards {
  [key: string]: SketchMSArtboards;
}
export interface SketchMSMeta {
  commit: string;
  pagesAndArtboards: SketchMSPagesAndArtboards;
  version: number;
  fonts: string[];
  compatibilityVersion: number;
  app: string;
  autosaved: number;
  variant: string;
  created: {
    commit: string;
    appVersion: string;
    build: number;
    app: string;
    compatibilityVersion: number;
    version: number;
    variant: string;
  };
  saveHistory: string[];
  appVersion: string;
  build: number;
}
export interface SketchMSUserDocument {
  document: {
    pageListHeight: number;
    pageListCollapsed: number;
  };
}
export interface SketchMSUserPages {
  [key: string]: {
    scrollOrigin: SketchMSCurvePoint;
    zoomValue: number;
  };
}

export type SketchMSUser = SketchMSUserPages | SketchMSUserDocument;
export interface SketchMSPreview {
  source: string;
  width: number;
  height: number;
}
export interface SketchMSData {
  pages: SketchMSPageLayer[];
  previews: SketchMSPreview[];
  document: SketchMSDocument;
  user: SketchMSUser;
  meta: SketchMSMeta;
}
