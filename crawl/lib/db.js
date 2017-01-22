const Datastore = require('nedb');
const path = require('path');

function getUserHome() {
    return __dirname;
    // return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// const db = new Datastore({filename: getUserHome()+'/.electronapp/crawl/bookrank.db', autoload: true});

const db = {};
db.bookranks = new Datastore({filename: path.join(getUserHome(), '../db/bookranks.db') , autoload: true});
db.books = new Datastore({filename: path.join( getUserHome(), '../db/books.db'), autoload: true});

module.exports = db;
