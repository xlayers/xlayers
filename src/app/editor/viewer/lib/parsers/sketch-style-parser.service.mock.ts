import { getNumberMock } from '../sketch.service.mock';

export function sketchColorMockToRGBA(mockColor: SketchMSColor) {
  return {
    red: Math.round(mockColor.red * 255),
    green: Math.round(mockColor.green * 255),
    blue: Math.round(mockColor.blue * 255),
    alpha: mockColor.alpha
  } as SketchMSColor;
}

export function sketchColorMockToString(mockColor: SketchMSColor) {
  return `rgba(${mockColor.red},${mockColor.green},${mockColor.blue},${mockColor.alpha})`;
}

export function sketchColorMockToHex(mockColor: SketchMSColor) {
  return (
    '#' +
    ((256 + mockColor.red).toString(16).substr(1) +
      (((1 << 24) + (mockColor.green << 16)) | (mockColor.blue << 8) | Math.round(mockColor.alpha * 255)).toString(16).substr(1))
  );
}

export function getSketchColorMock() {
  return {
    red: Math.random(),
    green: Math.random(),
    blue: Math.random(),
    alpha: Math.random(),
  } as SketchMSColor;
}

export function sketchShadowToString(mockShadow: SketchMSShadow) {
  const color = sketchColorMockToString(sketchColorMockToRGBA(mockShadow.color));
  return `${mockShadow.offsetX}px ${mockShadow.offsetY}px ${mockShadow.blurRadius}px ${mockShadow.spread}px ${color}`;
}

export function getSketchShadowMock(color: SketchMSColor) {
  return {
    offsetX: getNumberMock(0, 500),
    offsetY: getNumberMock(0, 500),
    blurRadius: getNumberMock(0, 500),
    spread: getNumberMock(0, 500),
    color
  } as SketchMSShadow;
}
