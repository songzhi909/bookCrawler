var cheerio = require('cheerio');
var crawl = require('./lib/crawl');
var BookRank = require('./lib/bookrank');
var Book = require('./lib/book');
var db = require('./lib/db');


var host = 'http://www.yousuu.com';

/** 扫描书单列表 */
function crawlBookRanks(url) {
  console.log('crawl url: \t' + url);
  crawl.crawlUrl(url, function(data) {
    if (data) {
      var $ = cheerio.load(data);
      $('table .list-item').each(function(index, tr) {

        //解析书单
        var $tr = $(tr);
        var bookType = $tr.find('td').eq(1).find('h4>small').text();
        var rankName = $tr.find('td').eq(1).find('h4>a').text();
        var rankUrl = $tr.find('td').eq(1).find('h4>a').attr("href");
        var author = $tr.find('td').eq(2).find('p').eq(0).find('a').text();
        var bookNum = $tr.find('td').eq(3).find('p').eq(0).text();
        var createDate = $tr.find('td').eq(4).find('p').eq(0).text();
        var attentNum = $tr.find('td').eq(5).find('p').eq(0).text();

        var bookRank = new BookRank();
        bookRank._id = rankUrl.substr(rankUrl.lastIndexOf('/') + 1);
        bookRank.bookType = bookType;
        bookRank.rankName = rankName;
        bookRank.rankUrl = rankUrl;
        bookRank.author = author;
        bookRank.bookNum = parseInt(bookNum);
        bookRank.createDate = createDate;
        bookRank.attentNum = parseInt(attentNum);


        // console.log(bookRank);

        //存入数据库  
        // FileUtil.writeFile(bookRank, __dirname + '/book.txt');
        db.bookranks.insert(bookRank);

        // if(index == 1)  
          crawlBooks(host + rankUrl);

      })

      //判断是否有下一页，有下一页则继续爬取下一页
      if($('table .list-item').length != 0) {
        var word = $('.right2center li').eq('1').find('a').attr('onclick');
        if (word) {
          word = word.split("'")[3];
          nextPageUrl(word);
        }
      }
      // console.log('done');
    } else {
      console.log('error');
    }
  })
}

/** 查询下一页 */
function nextPageUrl(word) {
  var url = host + '/booklist?s=digest&t=' + word;
  crawlBookRanks(url);
}

/** 扫描书单书籍列表 */
function crawlBooks(url) {
  console.log('crawl books url: \t' + url);
  crawl.crawlUrl(url, function(data) {
    if (data) {
      var $ = cheerio.load(data);
      $('.ro .booklist-item').each(function(index, div) {

        //解析书单
        var $div = $(div);
        var bookName = $div.find('.booklist-subject .title a').text();
        var bookUrl = $div.find('.booklist-subject .title a').attr('href');

        var content = $div.find('.booklist-subject .abstract').text();
        console.log(content)
        var author = content.split('字数:')[0].split('作者:')[1];
        var wordNum = content.split('字数:')[1].split('最后更新:')[0]
        var lastUpdate = content.split('最后更新:')[1] ? content.split('最后更新:')[1].split('推荐指数:')[0] : '';
        var score = content.split('推荐指数:')[1]
        // var score = $div.find('.booklist-subject .abstract .num2star i[style="color:#4D7BD61"]').length;

        var book = new Book();
        book._id = bookUrl.substr(bookUrl.lastIndexOf('/') + 1);
        book.bookName = bookName;
        book.bookUrl = bookUrl;
        book.author = author;
        book.wordNum = parseInt(wordNum);
        book.lastUpdate = lastUpdate;
        book.score = parseInt(score);
 


        console.log(book);

        //存入数据库  
        // FileUtil.writeFile(bookRank, __dirname + '/book.txt');
        db.books.insert(book);

      })

      //判断是否有下一页，有下一页则继续爬取下一页
      // if($('table .list-item').length != 0) {
      //   var word = $('.right2center li').eq('1').find('a').attr('onclick');
      //   if (word) {
      //     word = word.split("'")[3];
      //     nextPageUrl(word);
      //   }
      // }
      // console.log('done');
    } else {
      console.log('error');
    }
  })
}

var _url = host + '/booklist?s=digest';
crawlBookRanks(_url);
