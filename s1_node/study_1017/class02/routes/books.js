var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');

// 도서 이미지 업로드함수
var upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, done) => {
            done(null, './public/upload/book')
        },
        filename: (req, file, done) => {
            var fileName = Date.now() + ".jpg";
            done(null, fileName);
        }
    })
});

// 도서 검색
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

// 도서상품목록 JSON
router.get('/list.json', function(req, res) {
    const page = req.query.page;
    const start = (parseInt(page)-1) * 5;
    const key = req.query.key;
    const query = '%' + req.query.query + '%';
    const sql = 'select * from books where ' + key + ' like ? order by bid desc limit ?, 5';
    db.get().query(sql, [query, start], function(err, rows) {
        if(err) console.log('도서목록JSON : ', err);
        res.send(rows);
    });
});

// 도서상품목록 페이지 이동
router.get('/list', function(req, res) {
    res.render('index', {title:'도서상품목록', pageName:'books/list.ejs'});
});

// 데이터 개수 출력
router.get('/count', function(req, res) {
    const key = req.query.key;
    const query = '%' + req.query.query + '%';
    const sql= 'select count(*) total from books where ' + key + ' like ?';
    db.get().query(sql, [query], function(err, rows) {
        if(err) console.log("데이터 개수 출력 : ", err);
        res.send(rows[0]);
    })
});

// 도서 삭제
router.post('/delete', function(req, res) {
    const bid = req.body.bid;
    const sql = 'delete from books where bid = ?';
    db.get().query(sql, [bid], function(err) {
        if(err) console.log("도서 삭제 에러 : ", err);
        res.sendStatus(200);
    });
});

// 도서정보 페이지 이동
router.get('/read', function(req, res) {
    const bid=req.query.bid;
    const sql="select *, format(price,0) fmtprice, date_format(regdate, '%Y-%m-%d') fmtdate from books where bid=?";
    db.get().query(sql, [bid], function(err, rows) {
        if(err) console.log("도서 정보 에러 : ", err);
        res.render('index', {title: '도서정보', pageName:'books/read.ejs', book:rows[0]});
    });
});

// 도서수정 페이지 이동
router.get('/update', function(req, res){
    const bid=req.query.bid;//read.ejs에서 링크를 물음표로 받아서 query
    const sql='select*, format(price, 0) fmtprice, date_format(regdate, "%Y-%m-%d") fmtdate from books where bid=?';
    db.get().query(sql, [bid], function(err,rows){
        if(err) console.log('도서정보 : ', err);
        res.render('index', {title:'정보수정', pageName:'books/update.ejs', book:rows[0]});
    });
});

// 도서수정
router.post('/update', function(req, res){
    const bid = req.body.bid;
    const title = req.body.title;
    const authors = req.body.authors;
    const publisher = req.body.publisher;
    const price = req.body.price;
    const contents = req.body.contents;

    // console.log(bid, title, authors, publisher, price, contents);

    const sql = 'update books set title=?, authors=?, publisher=?, price=?, contents=? where bid=?';
    db.get().query(sql, [title, authors, publisher, price, contents, bid], function(err) {
        if(err) console.log("도서 수정 submit 오류 : ", err);
        res.redirect('/books/read?bid=' + bid);
    })
});

// 이미지 업로드
router.post('/upload', upload.single('file'), function(req, res) {
    if(req.file) {
        const bid = req.body.bid;
        // console.log('파일 이름 : ', bid, req.file.filename);
        const image = '/upload/book/' + req.file.filename;
        const sql = "update books set image=? where bid=?";
        db.get().query(sql, [image, bid], function(err) {
            if(err) console.log('이미지 업로드 오류 : ', err);
            res.redirect('/books/read?bid=' + bid);
        });
    }
});

// 도서정보 페이지 출력
router.get('/info', function(req, res) {
    const bid = req.query.bid;
    const sql = 'select*, format(price, 0) fmtprice, date_format(regdate, "%Y-%m-%d") fmtdate from books where bid=?';
    db.get().query(sql, [bid], function(err, rows) {
        res.render('index', {title:'도서정보', pageName:'books/info.ejs', book:rows[0]});
    });
});

// 좋아요 추가
router.post('/like/insert', function(req, res) {
    const bid = req.body.bid;
    const uid = req.body.uid;
    const sql = 'insert into favorite(bid, uid) values(?,?)';
    db.get().query(sql, [bid, uid], function(err) {
        res.sendStatus(200);
    });
});

// 좋아요 체크
router.get('/like/check', function(req, res) {
    const bid = req.query.bid;
    const uid = req.query.uid;
    const sql = 'select count(*) cnt from favorite where bid=? and uid=?';
    db.get().query(sql, [bid, uid], function(err, rows) {
        res.send(rows[0].cnt.toString());
    });
});
module.exports = router;
