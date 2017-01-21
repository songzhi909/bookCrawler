const Datastore = require('nedb');

function getUserHome() {
    return __dirname;
    // return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// const db = new Datastore({filename: getUserHome()+'/.electronapp/crawl/bookrank.db', autoload: true});

const db = {};
db.bookrank = new Datastore({filename: getUserHome()+'/bookranks.db', autoload: true});
db.books = new Datastore({filename: getUserHome()+'/books.db', autoload: true});

module.exports = db;
