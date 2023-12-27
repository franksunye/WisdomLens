const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

// 动态调整字体大小
function getFittingFontSize(ctx, text, maxWidth, fontStyle) {
  let fontSize = 100;
  let textWidth;

  do {
    ctx.font = `${fontSize}px ${fontStyle}`;
    textWidth = ctx.measureText(text).width;
    fontSize -= 2;
  } while (textWidth > maxWidth && fontSize > 10);

  return `${fontSize}px ${fontStyle}`;
}

// 处理图片的函数
async function processImage(imagePath, text, options) {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  const fittingFontSize = getFittingFontSize(ctx, text, image.width - 20, options.fontStyle);
  ctx.font = fittingFontSize;
  ctx.fillStyle = options.textColor;
  const textWidth = ctx.measureText(text).width;
  const x = (image.width - textWidth) / 2;
  const y = options.y;

  ctx.fillText(text, x, y);

  const processedImage = await sharp(canvas.toBuffer())
    .resize(options.width, options.height)
    .toFormat('jpeg', { quality: 90 })
    .toBuffer();

  return processedImage;
}

// 主要的执行逻辑
async function main() {
  // 简化的名言数据
  const quoteData = {
    celebrity: "Albert Einstein",
    text: "Imagination(想象力) is more important than knowledge.",
    imageName: "einstein1.png", // 替换为实际图片文件名
    // fontStyle: "Microsoft YaHei",
    fontStyle: "KaiTi",
    textColor: "white",
    position: { y: 100 },
    width: 800,
    height: 600
  };

  const formattedText = `“${quoteData.text}” - ${quoteData.celebrity}`;
  const imagePath = `./${quoteData.imageName}`; // 替换为实际图片路径
  const options = {
    fontStyle: quoteData.fontStyle,
    textColor: quoteData.textColor,
    y: quoteData.position.y,
    width: quoteData.width,
    height: quoteData.height
  };

  try {
    const imageBuffer = await processImage(imagePath, formattedText, options);
    fs.writeFileSync(`output/${quoteData.imageName}`, imageBuffer);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

main();