const http = require('http');
const cheerio = require('cheerio');
const ipcMain = require('electron').ipcMain;

const BookRank = require('./bookrank');
const Book = require('./book');
const db = require('./db');

const crawl = {};
const host = 'http://www.yousuu.com';

// 爬取网页
function crawlUrl(url, callback) {
    http.get(url, function(res) {
        let data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            // console.log(data);
            callback(data);
        })
    }).on('error', function(){
        callback(null);
    });
}

/** 扫描书单列表 */
function crawlBookRanks(url) {
  console.log('crawl url: \t' + url);
  crawlUrl(url, function(data) {
    if (data) {
      let $ = cheerio.load(data);
      $('table .list-item').each(function(index, tr) {

        //解析书单
        let $tr = $(tr);
        let bookType = $tr.find('td').eq(1).find('h4>small').text();
        let rankName = $tr.find('td').eq(1).find('h4>a').text();
        let rankUrl = $tr.find('td').eq(1).find('h4>a').attr("href");
        let author = $tr.find('td').eq(2).find('p').eq(0).find('a').text();
        let bookNum = parseInt($tr.find('td').eq(3).find('p').eq(0).text());
        let createDate = $tr.find('td').eq(4).find('p').eq(0).text();
        let attentNum = parseInt($tr.find('td').eq(5).find('p').eq(0).text());

        let _id = rankUrl.substr(rankUrl.lastIndexOf('/') + 1);

        let bookRank = new BookRank(_id, bookType, rankName, rankUrl, author, bookNum, attentNum, createDate)
        // console.log(bookRank);

        //存入数据库  
        // FileUtil.writeFile(bookRank, __dirname + '/book.txt');
        db.bookranks.insert(bookRank);

        // if(index == 1)  
        crawlBooks(host + rankUrl);
      })

      //判断是否有下一页，有下一页则继续爬取下一页
      if($('table .list-item').length != 0) {
        let word = $('.right2center li').eq('1').find('a').attr('onclick');
        if (word) {
          word = word.split("'")[3];
          nextPageUrl(word);
        }
      }
    } else {
      console.log('error');
    }
  })
}

/** 查询下一页 */
function nextPageUrl(word) {
  let url = host + '/booklist?s=digest&t=' + word;
  crawlBookRanks(url);
}

/** 扫描书单书籍列表 */
function crawlBooks(url) {
  console.log('crawl books url: \t' + url);
  crawlUrl(url, function(data) {
    if (data) {
      let $ = cheerio.load(data);
      $('.ro .booklist-item').each(function(index, div) {

        let bookUrl = $div.find('.booklist-subject .title a').attr('href'); //书籍地址
        crawlUrl(host + bookUrl, (data)=>{
            let $ = cheerio.load(data);

            //解析书单
            let $div = $('.sokk-body>div.container>div').find('div.row').eq(0);
            let bookName = $div.find('div').eq(0).find('span').text();;  //书名
            let bookPic =  $div.find('div').eq(0).find('img').attr('src');  //书籍图片
            let content = $div.find('.booklist-subject .abstract').text();
            let author =  $div.find('div').eq(0).find('.ys-bookmain li a').text();
            let wordNum = $div.find('div').eq(0).find('.ys-bookmain li').eq(1).text();
            let lastUpdate = $div.find('div').eq(0).find('.ys-bookmain li').eq(4).text();   //最后更新日期
            let score = $div.find('.ys-book-averrate span').text().trim();  //平均评分
            let scorePerson = '';
            let chapterNum = $div.find('div').eq(0).find('.ys-bookmain li').eq(2).text(); //章节数
            let lastChapter = $div.find('div').eq(0).find('.ys-bookmain li').eq(5).text();  //最后章节
            // let score = $div.find('.booklist-subject .abstract .num2star i[style="color:#4D7BD61"]').length;
            let _id = bookUrl.substr(bookUrl.lastIndexOf('/') + 1);

            let book = new Book(_id, bookName, bookUrl, bookPic, author, wordNum, lastUpdate, score);

            //存入数据库  
            // FileUtil.writeFile(bookRank, __dirname + '/book.txt');
            db.books.insert(book);

        });

        

      })

      //判断是否有下一页，有下一页则继续爬取下一页
      // if($('table .list-item').length != 0) {
      //   let word = $('.right2center li').eq('1').find('a').attr('onclick');
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


crawl.bindListener = function() {
    // 按条件查询小说列表
    ipcMain.on('search-keyword', (event, keyword) => {
        console.log('channel "search-keyword" on msg:' + keyword);

        let match = {$regex: eval('/' + keyword + '/')};
        var query = keyword ? {$or: [{bookName: match}]} : {};
        db.books.find(query)
            .sort({score: -1})  //按评分排序
            .limit(100) //TODO: 分页查询
            .exec(function(err, books){
                event.sender.send('search-reply', books);
            });
    })

    //从网站同步小说
    ipcMain.on('start-crawl', (event, arg) => {
        console.log('channel "start-crawl" on msg:' + arg);
        
        //TODO
    })
}

/**
 * 1. get total page size
 * 2. iterator from page 1 to totalSize
 *    2.1 fetch mails summary list on 1 page
 *    2.2 iterator from mails 1 to maxItems mails summary in 1 page
 *        2.2.1 fetch mails detail from url
 *        2.2.2 save mail to db
 *    2.3 test if none of mails in current page updated? if none, stop crawling or continue step 2.
 *
 * @param url
 */
function crawler(updater) {
    // new UrlCrawler('http://12345.chengdu.gov.cn/moreMail').startCrawl(($) => {
    //     var totalSize = $('div.pages script').html().match(/iRecCount = \d+/g)[0].match(/\d+/g)[0],
    //         totalPageSize = Math.ceil(totalSize / 15),
    //         pagesCollection = [],
    //         crawProgress = {skip: false};
    //     for (let i = 1; i <= totalPageSize; i++) {
    //         pagesCollection.push(i);
    //     }
    //     async.eachSeries(pagesCollection, function (page, crawlNextPage) {
    //         pageCrawl(page, totalPageSize, updater, crawlNextPage, crawProgress);
    //     })
    // });
}

crawl.crawlBookRanks = crawlBookRanks;
module.exports = crawl;