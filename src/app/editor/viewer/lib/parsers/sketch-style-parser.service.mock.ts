import { BorderType } from './sketch-style-parser.service';

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
    red: 0.2,
    green: 0.3,
    blue: 0.1,
    alpha: 0.4,
  } as SketchMSColor;
}

export function sketchShadowToString(mockShadow: SketchMSShadow) {
  const color = sketchColorMockToString(sketchColorMockToRGBA(mockShadow.color));
  return `${mockShadow.offsetX}px ${mockShadow.offsetY}px ${mockShadow.blurRadius}px ${mockShadow.spread}px ${color}`;
}

export function getSketchShadowMock(color: SketchMSColor, number: number = 1) {
  return Array(number).fill({
    offsetX: 873,
    offsetY: 349,
    blurRadius: 98,
    spread: 49,
    color
  } as SketchMSShadow);
}

export function getSketchBlurMock() {
  return {
    radius: 181
  } as SketchMSStyleBlur;
}

export function getSketchBorderMock(boderType: BorderType, number: number = 1) {
  return Array(number).fill({
    thickness: 0.2342112394,
    position: boderType,
    color: getSketchColorMock()
  } as SketchMSBorder);
}

export function sketchBorderToString(mockBorder: SketchMSStyleBorder) {
  const borderType = mockBorder.position === BorderType.INSIDE ? 'inet' : '';
  return `0 0 0 ${mockBorder.thickness}px ${sketchColorMockToString(sketchColorMockToRGBA(mockBorder.color))} ${borderType}`;
}

export function getSketchFillMock(number: number = 1) {
  return Array(number).fill({
    color: getSketchColorMock(),
    gradient: {
      stops: Array(4).fill({
        color: getSketchColorMock(),
        position: 0.275915839018395
      })
    }
  } as SketchMSStyleFill);
}

export function sketchFillToString(mockFill: SketchMSStyleFill) {
  const gradient = mockFill.gradient.stops.map((element) => {
    return `${sketchColorMockToString(sketchColorMockToRGBA(element.color))} ${element.position * 100}%`;
  }).join(',');
  return {
    'background-color': sketchColorMockToString(sketchColorMockToRGBA(mockFill.color)),
    'background': `linear-gradient(90deg, ${gradient})`
  };
}
