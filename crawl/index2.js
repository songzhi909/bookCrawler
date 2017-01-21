var cheerio = require('cheerio');
var crawl = require('./crawl'); 

var url = 'http://www.csdn.net';

crawl.crawlUrl(url, function(data) {
  if(data) {
    // console.log(data);

    var $ = cheerio.load(data);
    $('div.news_list>ul>li>a').each(function(index, ele){
      var $ele = $(ele);
      console.log($ele.text() + ':' + $ele.attr("href"));
    })

    console.log('done');
  }else {
    console.log('error');
  }
})