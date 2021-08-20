import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-collapse';

import { CardImg } from 'reactstrap';

import { loadSetting } from '../../actions/settingActions'
import { getCharacters, getCharacterById, addCharacter } from '../../actions/characterActions';
import Character from './Character';


import SwiperCore, { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';
import AddCharacterModal from './AddCharacterModal';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

class CharacterSwiper extends Component {
    state = {
        // path: "/images/manga/",
        // Collapsetoggle: [],
        Collapsetoggle: false

    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        setting: PropTypes.object.isRequired,
        getCharacters: PropTypes.func.isRequired,
        getCharacterById: PropTypes.func.isRequired,
        loadSetting: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { setting } = this.props.setting;
        if (setting !== null) {
            this.props.loadSetting();
        }

        this.props.getCharacters();
    }

    CollapseHangdle = (id) => {
        this.props.getCharacterById(id)
        this.setState({ Collapsetoggle: true })
    }

    frameStyle = () => {
        return {
            WebkitBorderRadius: '10px',
            MozBorderRadius: '10px',
            borderRadius: '10px',
            margin: '0 auto',
            backgroundColor: '#323232',
            color: 'white',
            width: window.innerWidth >= 992 ? '85%' : '100%',
        };
    };
    charStyle = () => {
        return {
            WebkitBorderRadius: '10px',
            MozBorderRadius: '10px',
            borderRadius: '10px',
            margin: '0 auto',
            color: 'white',
             maxWidth: window.innerWidth >= 576 ? (window.innerWidth >= 992 ? String(window.innerWidth / 1.5) + 'px' : String(window.innerWidth / 1.2) + 'px') : String(window.innerWidth / 1.04) + 'px',
            maxHeight: '1000px',
            paddingTop: '32px',
            paddingBottom: '32px',
        };
    };

    tittleStyle = () => {
        const { setting } = this.props.setting;
        let bottomColor = "#c213bd";
        if (setting && setting?.headerColorBottom !== null) {
            bottomColor = setting?.headerColorBottom;
        }
        return {
            fontFamily: "'Brawler', Cyreal",
            letterSpacing: '0.5rem',
            background: `-webkit-linear-gradient(#fae0ff, ${bottomColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: window.innerWidth >= 992 ? '3.0em' : '2.0em'
        };
    };

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        const { characters } = this.props.character;

        return (
            <div className="characters wrapper animated bounceInLeft">
                <div align='center' style={this.frameStyle()}>
                    <legend align='center'>
                        <h2 className='brand display-4 pt-4' style={this.tittleStyle()} >
                            Characters
                        </h2>
                    </legend>
                    <div style={this.charStyle()}>

                        <Swiper
                            speed={2000}
                            slidesPerView={window.innerWidth >= 576 ? 8 : 4}
                            allowTouchMove={true}
                            loop={true}
                            navigation={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                reverseDirection: true,
                            }}
                        >
                            {characters &&
                                characters.map(({ _id, avatarImage }) => (
                                    <div key={_id}>
                                        <SwiperSlide >
                                            <div style={pageStyle} >
                                                <CardImg onClick={this.CollapseHangdle.bind(this, _id)} className='avatar' src={avatarImage} />
                                            </div>
                                        </SwiperSlide>
                                    </div>
                                ))
                            }
                        </Swiper>
                    </div>
                    <AddCharacterModal />
                    <Collapse isOpened={this.state.Collapsetoggle}>
                        <Character />
                    </Collapse>
                </div >
            </div >
        )
    }
}

const pageStyle = {
    height: '60px'
}

const mapStateToProps = state => ({
    character: state.character,
    setting: state.setting,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { getCharacters, getCharacterById, loadSetting }
)(CharacterSwiper);
