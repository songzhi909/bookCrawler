var http = require('http');

// 爬取网页
function crawlUrl(url, callback) {
    http.get(url, function(res) {
        var data = '';
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

exports.crawlUrl = crawlUrl;