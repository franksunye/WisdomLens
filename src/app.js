// app.js

const fs = require('fs');
const processImage = require('./utils/imageProcessor');
const Quote = require('./models/quoteModel');


// 假设有一个JSON文件包含名人名言和图片信息
const quotesData = JSON.parse(fs.readFileSync('./data/quotes.json', 'utf8')).map(quote => new Quote(quote.celebrity, quote.quotes, quote.lifespan, quote.nationality));

// 异步处理所有图片
async function processAllImages() {
  for (const quoteData of quotesData) {
    for (const quote of quoteData.quotes) {
      const imagePath = `data/celebrities/${quoteData.celebrity}/${quote.imageName}`;
      const options = {
        fontSize: quote.fontSize || 24,
        fontStyle: quote.fontStyle || 'Arial',
        textColor: quote.textColor || 'white',
        x: quote.position.x,
        y: quote.position.y,
        width: quote.width || 800, // 如果需要调整图片大小
        height: quote.height || 600
      };
      try {
        const processedImageBuffer = await processImage(imagePath, quote.text, options);
        fs.writeFileSync(`output/${quoteData.celebrity}-${quote.imageName}`, processedImageBuffer);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
  }
}

// 启动图片处理程序
processAllImages().then(() => {
  console.log('All images processed.');
});

