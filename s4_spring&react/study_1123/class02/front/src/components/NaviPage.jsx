import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Route, Routes, useLocation } from 'react-router-dom';
import SearchPage from './shop/SearchPage';

const NaviPage = () => {
    const location = useLocation();
    const path = location.pathname;
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
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
                            <Nav.Link href="/shop/list" className={path.indexOf('/shop/list') !== -1 && 'active'}>상품목록</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link href="#action2">Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Routes>
                <Route path='/shop/search' element={<SearchPage />} />
            </Routes>
        </>
    )
}

export default NaviPage