// utils/imageProcessor.js

const sharp = require('sharp');
const { createCanvas, loadImage, registerFont } = require('canvas');

/**
 * 动态调整字体大小以适应图片宽度
 * @param {CanvasRenderingContext2D} ctx - canvas的上下文
 * @param {string} text - 要绘制的文本
 * @param {number} maxWidth - 文本的最大宽度
 * @param {string} fontStyle - 字体样式
 * @returns {string} 调整后的字体设置
 */
function getFittingFontSize(ctx, text, maxWidth, fontStyle) {
  let fontSize = 100; // 初始字体大小
  let textWidth;

  do {
    ctx.font = `${fontSize}px ${fontStyle}`;
    textWidth = ctx.measureText(text).width;
    fontSize -= 2; // 每次减少字体大小
  } while (textWidth > maxWidth && fontSize > 10); // 确保字体大小不小于10

  return `${fontSize}px ${fontStyle}`;
}

async function processImage(imagePath, text, options) {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  // 调整字体大小以适应图片宽度
  const fittingFontSize = getFittingFontSize(ctx, text, image.width - 20, options.fontStyle); // 20为边缘留白
  ctx.font = fittingFontSize;
  ctx.fillStyle = options.textColor;
  ctx.textAlign = options.textAlign || 'center';

  // 文字水平居中、垂直位置由外部指定
  const textWidth = ctx.measureText(text).width;
  const x = (image.width - textWidth) / 2;
  const y = options.y;

  ctx.fillText(text, x, y);

  // 使用sharp处理图像
  const processedImage = await sharp(canvas.toBuffer())
    .resize(options.width, options.height)
    .toFormat('jpeg', { quality: 90 })
    .toBuffer();

  return processedImage;
}

module.exports = processImage;