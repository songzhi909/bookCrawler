

/**
 * @param _id: id
 * @param bookType: 类型
 * @param rankName: 书单名称
 * @param rankUrl: 书单URL
 * @param auther: 作者
 * @param bookNum: 书单书籍数量
 * @param attentNum: 关注数量
 * @param createDate: 创建日期 
 */
function BookRank(_id, bookType, rankName, rankUrl, auther, bookNum, attentNum, createDate) {
    this._id = _id;
    this.bookType = bookType;
    this.rankName = rankName;
    this.rankUrl = rankUrl;
    this.auther = auther;
    this.bookNum = bookNum;
    this.attentNum = attentNum;
    this.createDate = createDate;
}


function BookRank() {

}

module.exports = BookRank; 