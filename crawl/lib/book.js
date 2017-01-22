

/**
 * 书籍构造器
 * @param _id: id
 * @param bookName: 书名
 * @param bookUrl: 书籍地址
 * @param bookPic: 书籍图片
 * @param auther: 作者
 * @param wordNum: 字数
 * @param lastUpdate: 最后更新日期
 * @param score: 评分 
 * @param chapterNum: 章节数 
 * @param introduction: 简介 
 * @param lastChapter: 最新章节
 */
function Book(_id, bookName, bookUrl, bookPic, auther, wordNum, lastUpdate,  score , chapterNum, introduction, lastChapter) {
    this._id = _id;
    this.bookName = bookName;
    this.bookUrl = bookUrl;
    this.bookPic = bookPic;
    this.auther = auther;
    this.wordNum = wordNum;
    this.lastUpdate = lastUpdate;
    this.score = score;
    this.chapterNum = chapterNum;
    this.introduction = introduction;
    this.lastChapter = lastChapter;
}


function Book() {

}

module.exports = Book; 