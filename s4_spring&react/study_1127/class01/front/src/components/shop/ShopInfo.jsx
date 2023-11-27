import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

import { PiHeartBold, PiHeartFill } from "react-icons/pi";

const ShopInfo = () => {
    const [shop, setShop] = useState("");

    const { pid } = useParams();
    //console.log(pid);
    const { title, maker, image, fmtprice, fmtdate, ucnt, fcnt } = shop;

    const getShop = async () => {
        const res = await axios(`/shop/info/${pid}?uid=${sessionStorage.getItem("uid")}`);
        // console.log(res.data);
        setShop(res.data);
    }

    const onClickHeart = async () => {
        if (!sessionStorage.getItem("uid")) {
            sessionStorage.setItem("target", `/shop/info/${pid}`);
            window.location.href = "/login";
        } else {
            // 좋아요 추가
            await axios(`/shop/insert/favorites?pid=${pid}&uid=${sessionStorage.getItem("uid")}`);
            alert("좋아요 꾹!");
            getShop();
        }
    }

    const onClickFullHeart = async () => {
        await axios(`/shop/delete/favorites?pid=${pid}&uid=${sessionStorage.getItem("uid")}`);
        alert("좋아요 삭제ㅠ");
        getShop();
    }

    useEffect(() => {
        getShop();
    }, [])

    return (
        <div className='my-5'>
            <Row>
                <Col md={5}>
                    <img src={`/display?file=${image}`} width="100%" className='border' />
                </Col>
                <Col>
                    <Row>
                        <Col md={10}>
                            <h3>[{maker}] {title}</h3>
                        </Col>
                        <Col>
                            <h3 className='heart text-end'>
                                {ucnt === 1 ?
                                    <PiHeartFill onClick={onClickFullHeart}/>
                                    :
                                    <PiHeartBold onClick={onClickHeart} />
                                }<small style={{fontSize:'0.9rem'}}>{fcnt}</small>
                            </h3>
                        </Col>
                    </Row>
                    <hr />
                    <div>가격 : {fmtprice}원</div>
                    <div>등록일 : {fmtdate}</div>
                    <hr />
                    <Row>
                        <Col>
                            <Button className='w-100' variant='outline-primary'>장바구니</Button>
                        </Col>
                        <Col>
                            <Button className='w-100'>바로구매</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default ShopInfo