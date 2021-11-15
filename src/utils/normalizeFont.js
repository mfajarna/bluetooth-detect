import {Dimensions, PixelRatio} from 'react-native';
import {getWidthHeight} from '../utils/getWidthHeight';

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const {width, height} = getWidthHeight();

export const isTablet = () => {
  let pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return (
      pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    );
  }
};
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const normalizeFont = (size, factor = 0.5) => {
  return isTablet()
    ? size + (scale(size) - size) * factor - 6
    : size + (scale(size) - size) * factor;
};

export {scale, verticalScale, normalizeFont};