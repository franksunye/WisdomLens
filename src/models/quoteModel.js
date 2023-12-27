// models/quoteModel.js

class Quote {
  constructor(celebrity, quotes, lifespan, nationality) {
    this.celebrity = celebrity;
    this.quotes = quotes; // 这里quotes是一个对象数组，包含文本、图片名等
    this.lifespan = lifespan;
    this.nationality = nationality;
  }

  // 可以添加更多方法，如格式验证或数据转换方法
}

module.exports = Quote;

  