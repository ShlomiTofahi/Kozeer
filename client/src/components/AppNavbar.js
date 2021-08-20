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

import { loadSetting } from '../actions/settingActions'

import LoginModal from './auth/LoginModal';
import Logout from './auth/Logout';

SwiperCore.use([Autoplay]);

class AppNavbar extends Component {
    state = {
        isOpen: false,
        path: "/images/header/",

        hover: '',
        active: ''
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
        setting: PropTypes.object.isRequired,
        loadSetting: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { setting } = this.props.setting;
        if(setting !==null){
            this.props.loadSetting();
        }
      }

    openTab = (name, event) => {
        var i, tablinks;

        tablinks = document.getElementsByClassName("header-tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        event.currentTarget.className += " active";
        this.toggleActive(name)
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    enterToggleHover = (hover) => {
        this.setState({
            hover
        });
    }

    leaveToggleHover = () => {
        this.setState({
            hover: ''
        });
    }

    toggleActive = (active) => {
        this.setState({
            active
        });
    }

    shdowStyle = () => {
        return {
            WebkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7'
        };
    };

    navBarColorsStyle = () => {
        const { setting } = this.props.setting;
        let topColor = "#d959d5";
        let bottomColor = "#c213bd";
        if (setting && setting?.headerColorTop !== null) {
            topColor = setting?.headerColorTop;
        }
        if (setting && setting?.headerColorBottom !== null) {
            bottomColor = setting?.headerColorBottom;
        }
        return {
            background: `linear-gradient(180deg, ${topColor} 50%, ${bottomColor} 50%)`
        };
    };

    navTextColorsStyle = (noBorder = '', name = '') => {
        const { setting } = this.props.setting;
        let linkStyle = {}
        let textColor = "#ffffff";
        if (setting && setting?.headerColorText !== null) {
            textColor = setting?.headerColorText;
        }

        if ((this.state.hover !== '' && this.state.hover === name) ||
            (this.state.active !== '' && this.state.active === name)) {
            textColor = "#21201f";
            if (setting && setting?.headerHoverColorText !== null) {
                textColor = setting?.headerHoverColorText;
            }
        }

        linkStyle.color = textColor;
        linkStyle.borderLeft = noBorder;

        return linkStyle;
    };

    link = (navLink, path, name) => {
        let border = ''
        if (name === "HOME") {
            border = 'none';
        }
        return (
            <Link
                className={'navlink header-tablinks px-3 px-md-4 px-lg-5 d-md-inline-block no-outline ' + navLink}
                to={path}
                style={this.navTextColorsStyle(border, name)}
                onClick={this.openTab.bind(this, name)}
                onMouseEnter={this.enterToggleHover.bind(this, name)}
                onMouseLeave={this.leaveToggleHover}>
                {name}
            </Link>
        )
    };
    render() {
        const { isAuthenticated } = this.props.auth;
        const { setting } = this.props.setting;
        let headerImage = `url(${this.state.path}header_bg.png)`;
        if (setting && setting?.headerImage !== null) {
            headerImage = `url(${setting?.headerImage})`;
        }

        const smallScreen = window.innerWidth < 992 ? true : false;
        const navColor = window.innerWidth < 992 ? 'nav-color' : '';
        const navLink = window.innerWidth < 992 ? 'nav-link' : '';

        const authLinks = (
            <Fragment>
                <NavItem>
                    <Logout />
                </NavItem>
                <NavItem>
                    {this.link(navLink, '/profile', 'PROFILE')}
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
                    <div className='pt-3' style={{ backgroundImage: headerImage }}>
                        <div style={{ maxWidth: String(window.innerWidth -1) + 'px' }} className='row justify-content-between'>
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
                                    >
                                        {slider &&
                                            slider.map((num) => (
                                                <SwiperSlide key={num} >
                                                    <CardImg className='slider-imgs' src={'/images/header/canvas' + num + '.jpg'} />
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
                                </div>
                            ))
                            }
                        </div>
                        <div style={window.innerWidth >= 992 ? headerLogoStyle : small_headerLogoStyle} className='mb-3' align="center">
                            <CardImg style={window.innerWidth >= 992 ? logoStyle : small_logoStyle} src={'/images/header/header_kozeer_logo.png'} />
                        </div>
                        <Navbar fixed='center' dark={smallScreen} expand='lg' className={'nav-header mb-5 ' + navColor} style={this.navBarColorsStyle()}>
                            <Container>
                                <NavbarToggler className='NavToggler' onClick={this.toggle} />
                                <Collapse onClick={() => { this.setState({ isOpen: false }) }} isOpen={this.state.isOpen} navbar >
                                    <Nav className='header-tab m-auto' navbar>
                                        <NavItem>
                                            {this.link(navLink, '/', 'HOME')}
                                        </NavItem>
                                        <NavItem>
                                            {this.link(navLink, '/post', 'POSTS')}
                                        </NavItem>
                                        <NavItem>
                                            {this.link(navLink, '/manga', 'MANGA')}
                                        </NavItem>
                                        <NavItem>
                                            {this.link(navLink, '/character', 'CHARACTER')}
                                        </NavItem>
                                        <NavItem>
                                            {this.link(navLink, '/my-vision', 'MY VISION')}
                                        </NavItem>
                                        {isAuthenticated ? authLinks : guestLinks}
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

const small_logoStyle = {
    position: 'absolute',
    zIndex: '1',
    top: -window.innerWidth / 25 + 'px',
    left:0,
    right:0,
    marginLeft:"auto",
    marginRight:"auto",
    maxWidth: window.innerWidth / 1.1 + 'px',
}
const logoStyle = {
    position: 'absolute',
    zIndex: '1',
    top: -window.innerWidth / 25 + 'px',
    // left: window.innerWidth / 4 + 'px',
    left:0,
    right:0,
    marginLeft:"auto",
    marginRight:"auto",
    maxWidth: window.innerWidth / 2 + 'px',
}
const headerLogoStyle = {
    position: 'relative',
    margin: '0 auto',
    paddingTop: window.innerWidth / 4.57 + 'px'
}
const small_headerLogoStyle = {
    position: 'relative',
    margin: '0 auto',
    paddingTop: window.innerWidth / 2.4 + 'px'
}

const mapStateToProps = state => ({
    auth: state.auth,
    setting: state.setting
});

export default connect(mapStateToProps, {loadSetting})(AppNavbar);
