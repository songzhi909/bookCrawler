

/**
 * 书籍构造器
 * @param _id: id
 * @param bookName: 书名
 * @param bookUrl: 书籍地址
 * @param auther: 作者
 * @param wordNum: 字数
 * @param lastUpdate: 最后更新日期
 * @param score: 评分 
 */
function Book(_id, bookName, bookUrl, auther, wordNum, lastUpdate,  score ) {
    this._id = _id;
    this.bookName = bookName;
    this.bookUrl = bookUrl;
    this.auther = auther;
    this.wordNum = wordNum;
    this.lastUpdate = lastUpdate;
    this.score = score;
}


function Book() {

}

module.exports = Book; 