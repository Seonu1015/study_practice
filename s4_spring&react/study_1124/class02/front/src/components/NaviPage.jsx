import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import SearchPage from './shop/SearchPage';
import ShopList from './shop/ShopList';
import ShopUpdate from './shop/ShopUpdate';
import LoginPage from './user/LoginPage';

const NaviPage = () => {
    const location = useLocation();
    const path = location.pathname;

    const onLogout = (e) => {
        e.preventDefault();
        if(window.confirm("로그아웃하시겠습니까?")) {
            sessionStorage.clear();
            window.location.href="/";
        }
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
                <Container fluid>
                    <Navbar.Brand href="/">LOGO</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100%' }}
                            navbarScroll
                        >
                            <Nav.Link href="/shop/search" className={path.indexOf('/shop/search') !== -1 && 'active'}>상품검색</Nav.Link>
                            <Nav.Link href="/shop/list" className={(path.indexOf('/shop/list') !== -1 || path.indexOf('/shop/update/') !== -1) && 'active'}>상품관리</Nav.Link>
                        </Nav>
                        <Nav>
                            {sessionStorage.getItem("uid") ?
                                <>
                                    <Nav.Link href='/mypage' className={path.indexOf('/mypage') !== -1 && 'active'}>MYpage({sessionStorage.getItem("uid")}님)</Nav.Link>
                                    <Nav.Link onClick={onLogout}>Logout</Nav.Link>
                                </>
                                :
                                <Nav.Link href="/login" className={path.indexOf('/login') !== -1 && 'active'}>Login</Nav.Link>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Routes>
                <Route path='/shop/search' element={<SearchPage />} />
                <Route path='/shop/list' element={<ShopList />} />
                <Route path='/shop/update/:pid' element={<ShopUpdate />} />

                <Route path='/login' element={<LoginPage />} />
            </Routes>
        </>
    )
}

export default NaviPage