declare interface SketchMSImageCollection {
  do_objectID?: string;
  _class: 'MSImageCollection';
  images: Array<any>;
}
declare interface SketchMSAssetCollection {
  do_objectID?: string;
  _class: 'MSAssetCollection';
  gradients: Array<any>;
  colors: Array<any>;
  imageCollection: SketchMSImageCollection;
  images: Array<any>;
}
declare interface SketchMSStyleBorder {
  position: number;
  color: SketchMSColor;
  do_objectID?: string;
  _class: 'MSStyleBorder';
  gradient: SketchMSGradient;
  fillType: number;
  thickness: number;
  contextSettings: SketchMSGraphicsContextSettings;
  isEnabled: number;
}
declare interface SketchMSGradientStop {
  do_objectID?: string;
  _class: 'MSGradientStop';
  color: SketchMSColor;
  position: number;
}
declare interface SketchMSGradient {
  from: {
    x: number;
    y: number;
  };
  shouldSmoothenOpacity: boolean;
  gradientType: number;
  do_objectID?: string;
  _class: 'MSGradient';
  stops: Array<SketchMSGradientStop>;
  to: {
    x: number;
    y: number;
  };
  elipseLength: number;
}
declare interface SketchMSStyleFill {
  contextSettings: SketchMSGraphicsContextSettings;
  color: SketchMSColor;
  do_objectID?: string;
  _class: 'MSStyleFill';
  gradient: SketchMSGradient;
  fillType: number;
  noiseIntensity: number;
  patternFillType: number;
  patternTileScale: number;
  noiseIndex: number;
  isEnabled: number;
}
declare interface SketchMSStyleShadow {
  spread: number;
  color: SketchMSColor;
  offsetY: number;
  offsetX: number;
  do_objectID?: string;
  _class: 'MSStyleShadow';
  blurRadius: number;
  contextSettings: SketchMSGraphicsContextSettings;
  isEnabled: number;
}
declare interface SketchMSSharedStyle {
  do_objectID?: string;
  _class: 'MSSharedStyle';
  value: SketchMSStyle;
  objectID: string;
  name: string;
}

declare interface SketchMSSharedStyleContainer {
  do_objectID?: string;
  _class: 'MSSharedStyleContainer';
  objects: Array<SketchMSSharedStyle>;
}
declare interface SketchMSStyleBorderOptions {
  lineJoinStyle: number;
  do_objectID?: string;
  _class: 'MSStyleBorderOptions';
  isEnabled: number;
  lineCapStyle: number;
  dashPattern: Array<any>;
}
declare interface SketchMSGraphicsContextSettings {
  do_objectID?: string;
  _class: 'MSGraphicsContextSettings';
  opacity: number;
  blendMode: number;
}
declare interface SketchMSStyleBlur {
  radius: number;
  do_objectID?: string;
  _class: 'MSStyleBlur';
  motionAngle: number;
  isEnabled: number;
  type: number;
  center: {
    x: number;
    y: number;
  };
}
declare interface SketchMSStyleReflection {
  do_objectID?: string;
  _class: 'MSStyleReflection';
  strength: number;
  isEnabled: number;
  distance: number;
}
declare interface SketchMSStyleColorControls {
  hue: number;
  do_objectID?: string;
  _class: 'MSStyleColorControls';
  brightness: number;
  contrast: number;
  isEnabled: number;
  saturation: number;
}
declare interface SketchMSStyle {
  startDecorationType: number;
  borderOptions: SketchMSStyleBorderOptions;
  endDecorationType: number;
  contextSettings: SketchMSGraphicsContextSettings;
  blur: SketchMSStyleBlur;
  reflection: SketchMSStyleReflection;
  do_objectID?: string;
  _class: 'MSStyle';
  miterLimit: number;
  colorControls: SketchMSStyleColorControls;
  fills: Array<SketchMSStyleFill>;
  borders: Array<SketchMSStyleBorder>;
  innerShadows: Array<any>;
  shadows: Array<SketchMSStyleShadow>;
}
declare interface SketchMSRulerData {
  do_objectID?: string;
  _class: 'MSRulerData';
  base: number;
  guides: Array<any>;
}
declare interface SketchMSRect {
  y: number;
  do_objectID?: string;
  _class: 'MSRect';
  constrainProportions: number;
  height: number;
  width: number;
  x: number;
}
declare interface SketchMSExportOptions {
  shouldTrim: number;
  do_objectID?: string;
  _class: 'MSExportOptions';
  includedLayerIds: Array<any>;
  layerOptions: number;
  exportFormats: Array<any>;
}
declare interface SketchMSColor {
  do_objectID?: string;
  _class: 'MSColor';

  /**
   * ex: "#FFFFFF"
   * ex: rgb(1,0,1)
   */
  value: string;
}
declare interface SketchMSSimpleGrid {
  do_objectID?: string;
  _class: 'MSSimpleGrid';
  thickGridTimes: number;
  objectID: string;
  isEnabled: number;
  gridSize: number;
}
declare interface SketchMSLayoutGrid {
  columnWidth: number;
  totalWidth: number;
  drawHorizontalLines: number;
  objectID: string;
  gutterWidth: number;
  horizontalOffset: number;
  isEnabled: number;
  do_objectID?: string;
  _class: 'MSLayoutGrid';
  gutterHeight: number;
  drawHorizontal: number;
  guttersOutside: number;
  numberOfColumns: number;
  drawVertical: number;
  rowHeightMultiplication: number;
}
declare interface SketchMSSymbolMaster {
  isFlippedHorizontal: number;
  includeBackgroundColorInInstance: number;
  objectID: string;
  horizontalRulerData: SketchMSRulerData;
  frame: SketchMSRect;
  hasClickThrough: number;
  includeInCloudUpload: number;
  exportOptions: SketchMSExportOptions;
  hasBackgroundColor: number;
  layerListExpandedType: number;
  resizesContent: number;
  backgroundColor: SketchMSColor;
  rotation: number;
  style: SketchMSStyle;
  verticalRulerData: SketchMSRulerData;
  isFlippedVertical: number;
  do_objectID?: string;
  _class: 'MSSymbolMaster';
  name: string;
  layers: Array<any>;
  isVisible: boolean;
  nameIsFixed: number;
  grid: SketchMSSimpleGrid;
  resizingType: number;
  userInfo: any;
  isLocked: boolean;
  layout: SketchMSLayoutGrid;
  shouldBreakMaskChain: number;
  resizingConstraint: 63 | number;
  includeBackgroundColorInExport: number;
}
declare interface SketchMSPage {
  isFlippedHorizontal: number;
  style: SketchMSStyle;
  horizontalRulerData: SketchMSRulerData;
  frame: SketchMSRect;
  hasClickThrough: number;
  includeInCloudUpload: number;
  exportOptions: SketchMSExportOptions;
  objectID: string;
  id: string;
  rotation: number;
  layerListExpandedType: number;
  verticalRulerData: SketchMSRulerData;
  isFlippedVertical: number;
  resizingType: number;
  do_objectID?: string;
  _class: 'MSPage';
  layers: Array<SketchMSSymbolMaster>;
  isVisible: boolean;
  nameIsFixed: number;
  name: string;
  isLocked: boolean;
  shouldBreakMaskChain: number;
  resizingConstraint: number;
}
declare interface SketchMSSharedTextStyleContainer {
  do_objectID?: string;
  _class: 'MSSharedTextStyleContainer';
  objects: Array<any>;
}
declare interface SketchMSSymbolContainers {
  do_objectID?: string;
  _class: 'MSSymbolContainer';
  objects: Array<any>;
}
declare interface SketchMSDocumentData {
  assets: SketchMSAssetCollection;
  currentPageIndex: number;
  foreignSymbols: Array<any>;
  layerStyles: SketchMSSharedStyleContainer;
  pages: Array<SketchMSPage>;
  enableSliceInteraction: number;
  do_objectID?: string;
  _class: 'MSDocumentData';
  layerTextStyles: SketchMSSharedTextStyleContainer;
  enableLayerInteraction: number;
  layerSymbols: SketchMSSymbolContainers;
  objectID: string;
}
declare interface SketchMSArtboards {
  name: string;
  artboards: SketchMSArtboard;
}
declare interface SketchMSArtboard {
  [name: string]: string;
}
declare interface SketchMSPagesAndArtboards {
  [key: string]: SketchMSArtboards;
}
declare interface SketchMSMetadata {
  commit: string;
  pagesAndArtboards: SketchMSPagesAndArtboards;
  version: number;
  fonts: Array<string>;
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
  saveHistory: Array<string>;
  appVersion: string;
  build: number;
}
