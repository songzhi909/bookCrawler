var cheerio = require('cheerio');
var crawl = require('./lib/crawl'); 
var BookRank = require('./lib/bookrank');
var db = require('./lib/db');
 

var host = 'http://www.yousuu.com';
/** 扫描书籍榜单 */
function crawlBookRanks() {
  var url = host + '/booklist?s=digest';
  crawl.crawlUrl(url, function(data) {
    if(data) {
      var $ = cheerio.load(data);
      $('table .list-item').each(function(index, tr){

        //解析书单
        var $tr = $(tr);
        var bookType =    $tr.find('td').eq(1).find('h4>small').text();
        var rankName =    $tr.find('td').eq(1).find('h4>a').text();
        var rankUrl =     $tr.find('td').eq(1).find('h4>a').attr("href");
        var author =      $tr.find('td').eq(2).find('p').eq(0).find('a').text();
        var bookNum =     $tr.find('td').eq(3).find('p').eq(0).text();
        var createDate =  $tr.find('td').eq(4).find('p').eq(0).text();
        var attentNum =   $tr.find('td').eq(5).find('p').eq(0).text();

        var bookRank = new BookRank();
        bookRank._id = rankUrl.substr(rankUrl.lastIndexOf('/') + 1);
        bookRank.bookType = bookType;
        bookRank.rankName = rankName;
        bookRank.rankUrl = rankUrl;
        bookRank.author = author;
        bookRank.bookNum = parseInt( bookNum );
        bookRank.createDate = createDate;
        bookRank.attentNum = parseInt(attentNum);


        // console.log(bookRank);

        //存入数据库  
        // FileUtil.writeFile(bookRank, __dirname + '/book.txt');
        db.insert(bookRank);
      })

      // console.log('done');
    }else {
      console.log('error');
    }
  })
}

crawlBookRanks();
