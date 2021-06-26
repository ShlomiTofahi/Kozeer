import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    Collapse, Navbar, NavbarToggler, Nav, NavItem, Container, CardImg
} from 'reactstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay } from 'swiper';

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import 'swiper/components/scrollbar/scrollbar.min.css';

// import RegisterModal from './auth/RegisterModal';
import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';

SwiperCore.use([Autoplay]);

class AppNavbar extends Component {
    state = {
        isOpen: false,
        path: "/images/header/",
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    openTab = (event) => {

        var i, tablinks;

        tablinks = document.getElementsByClassName("header-tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        event.currentTarget.className += " active";
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    shdowStyle = () => {
        return {
            WebkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7'
        };
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;
        // const is_admin = (isAuthenticated && user.admin);

        const smallScreen = window.innerWidth <= 575 ? true : false;
        const navColor = window.innerWidth <= 575 ? 'nav-color' : '';
        const navLink = window.innerWidth <= 575 ? 'nav-link' : '';

        const authLinks = (
            <Fragment>
                <NavItem>
                    <Logout />
                </NavItem>
                <NavItem>
                    <Link className={'navlink header-tablinks px-5 nav-link d-md-inline-block' + navLink} to='/profile'>PROFIL</Link>
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <LoginModal />
                </NavItem>
            </Fragment>
        );
        const slider1 = ([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const slider2 = ([2, 3, 4, 5, 6, 7, 8, 9, 1]);
        const slider3 = ([3, 4, 5, 6, 7, 8, 9, 1, 2]);
        const slider4 = ([4, 5, 6, 7, 8, 9, 1, 2, 3]);
        const slider5 = ([5, 6, 7, 8, 9, 1, 2, 3, 4]);
        const slider6 = ([6, 7, 8, 9, 1, 2, 3, 4, 5]);
        const slider7 = ([7, 8, 9, 1, 2, 3, 4, 5, 6]);
        const sliders = ([slider1, slider2, slider3, slider4, slider5, slider6, slider7]);

        return (
            <Fragment>
                <header className='header'>
                    <div className='pt-3' style={{ backgroundImage: `url(${this.state.path}header_bg.png)` }}>
                        <div style={{ maxWidth: String(window.innerWidth + 15.6) + 'px' }} className='row justify-content-between'>
                            {/* <Row> */}
                            {sliders && sliders.map((slider) => (
                                <div key={slider} className='header-img-slider'>
                                    <Swiper
                                        spaceBetween={1}
                                        speed={5000}
                                        slidesPerView={1}
                                        allowTouchMove={false}
                                        loop={true}
                                        autoplay={{
                                            delay: 3000,
                                            disableOnInteraction: false,
                                            reverseDirection: true,
                                        }}
                                    // onSwiper={(swiper) => console.log(swiper)}
                                    // onSlideChange={() => console.log('slide change')}
                                    >
                                        {/* <div> */}
                                        {slider &&
                                            slider.map((num) => (
                                                <SwiperSlide key={num} >
                                                    <CardImg className='slider-imgs' src={'/images/header/canvas' + num + '.jpg'} />
                                                </SwiperSlide>
                                            ))
                                        }
                                        {/* </div> */}
                                    </Swiper>
                                </div>
                            ))
                            }
                            {/* </Row> */}
                        </div>
                        <div style={headerLogoStyle} className='mb-3' align="center">
                            <CardImg style={logoStyle} src={'/images/header/header_kozeer_logo.png'} />
                        </div>
                        <Navbar fixed='center' dark={smallScreen} expand='sm' className={'nav-header mb-5 ' + navColor}>
                            <Container>
                                <NavbarToggler className='NavToggler' onClick={this.toggle} />
                                <Collapse onClick={() => { this.setState({ isOpen: false }) }} isOpen={this.state.isOpen} navbar >
                                    <Nav className='header-tab m-auto' navbar>
                                        <NavItem>
                                            <Link onClick={this.openTab.bind(this)} style={{ borderLeft: 'none' }} className={'navlink header-tablinks px-5 d-md-inline-block ' + navLink} to='/'>HOME</Link>
                                        </NavItem>
                                        <NavItem>
                                            <Link onClick={this.openTab.bind(this)} className={'navlink header-tablinks px-5 d-md-inline-block ' + navLink} to='/post'>POSTS</Link>
                                        </NavItem>
                                        <NavItem>
                                            <Link onClick={this.openTab.bind(this)} className={'navlink header-tablinks px-5 d-md-inline-block ' + navLink} to='/manga'>MANGA</Link>
                                        </NavItem>
                                        <NavItem>
                                            <Link onClick={this.openTab.bind(this)} className={'navlink header-tablinks px-5 d-md-inline-block ' + navLink} to='/my-vision'>MY VISION</Link>
                                        </NavItem>
                                        {isAuthenticated ? authLinks : guestLinks}
                                        {/* {is_admin &&
                                <NavItem>
                                    <Link style={{ float: 'right', color: 'red' }} className={'navlink py-2 nav-link d-md-inline-block lead'} to='/admin'>
                                        <strong>Admin</strong></Link>
                                </NavItem>
                            } */}
                                    </Nav>
                                </Collapse>
                            </Container>
                        </Navbar>
                    </div>
                </header>
            </Fragment>
        );
    }
}

const logoStyle = {
    position: 'absolute',
    zIndex: '1',
    top: -window.innerWidth / 25 + 'px',
    left: window.innerWidth / 4 + 'px',
    maxWidth: window.innerWidth / 2 + 'px',
    // padding: window.innerWidth+'10px',
}
const headerLogoStyle = {
    position: 'relative',
    margin: '0 auto',
    paddingTop: window.innerWidth / 4.57 + 'px'
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, null)(AppNavbar);
// export default AppNavbar;