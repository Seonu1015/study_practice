var express = require('express');
var router = express.Router();
var db = require('../db');

router.get('/list.json', function(req, res) { // localhost:3000/review/list.json?bid=127&page=1
    const bid = req.query.bid;
    const page=parseInt(req.query.page);
    const start = (page-1)*5;
    const sql = 'select * from view_review where bid=? limit ?, 5';

    db.get().query(sql, [bid, start], function(err, rows) {
        res.send(rows);
    });
});

router.get('/count', function(req, res) {
    const bid = req.query.bid;
    const sql = "select count(*) cnt from review where bid=?";

    db.get().query(sql, [bid], function(err, rows) {
        res.send(rows[0].cnt.toString());
    })
})

// 리뷰 등록
router.post('/insert', function(req, res) {
    const bid = req.body.bid;
    const uid = req.body.uid;
    const contents = req.body.contents;

    const sql = 'insert into review(bid, uid, contents) values(?,?,?)';
    db.get().query(sql, [bid, uid, contents], function(err) {
        res.sendStatus(200);
    });
});

// 리뷰 삭제
router.post('/delete', function(req, res) {
    const rid = req.body.rid;

    const sql = 'delete from review where rid=?';
    db.get().query(sql, [rid], function(err) {
        res.sendStatus(200);
    });
})

// 리뷰 수정
router.post('/update', function(req, res) {
    const rid = req.body.rid;
    const contents = req.body.contents;

    const sql = 'update review set contents=? where rid=?';
    db.get().query(sql, [contents, rid], function(err) {
        res.sendStatus(200);
    });
});

module.exports = router;