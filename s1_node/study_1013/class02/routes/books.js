var express = require('express');
var router = express.Router();
var db = require('../db');

/* 도서 검색 */
router.get('/', function (req, res, next) {
    res.render('index', { title: '도서검색', pageName: 'books/search.ejs' });
});

/* 도서검색결과 저장 */
router.post('/search/insert', function (req, res) {
    const title = req.body.title;
    const authors = req.body.authors;
    const price = req.body.price;
    const publisher = req.body.publisher;
    const image = req.body.thumbnail;
    const contents = req.body.contents;
    const isbn = req.body.isbn;

    // console.log(title, authors, price, publisher, image, contents, isbn);

    // 책이 중복되서 저장되지 않도록 고유값인 isbn을 사용해서 체크
    const sql1 = 'select * from books where isbn=?';
    db.get().query(sql1, [isbn], function(err, rows) {
        if(rows.length > 0) { // 도서가 이미 있는 경우
            res.send('1');
        } else { // 도서가 없는 경우
            const sql = 'insert into books(title, authors, price, publisher, image, contents, isbn) values(?,?,?,?,?,?,?)';
            db.get().query(sql, [title, authors, price, publisher, image, contents, isbn], function(err, rows){
                if(err) {
                    console.log("도서저장 오류 =============", err);
                }
                res.send('0');
            });
        }
    });

});

module.exports = router;
