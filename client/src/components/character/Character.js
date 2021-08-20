import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-collapse';
import { CardImg } from 'reactstrap';

import { getCharacters } from '../../actions/characterActions';


import SwiperCore, { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

class Character extends Component {
    state = {
        // path: "/images/manga/",
        Collapsetoggle: [],

    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        getCharacters: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.getCharacters();
    }

    onClickImg = (mangaImage, page) => {
        var modal = document.getElementById("myModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        // var img = document.getElementById("myImg");
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        // img.onclick = function () {
        modal.style.display = "block";
        modalImg.src = mangaImage;
        captionText.innerHTML = page;
        // }

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }
    };

    CollapseHangdle = (name) => {
        if (this.state.Collapsetoggle.includes(name)) {
            this.setState(prevState => ({
                Collapsetoggle: prevState.Collapsetoggle.filter(element => element !== name)
            }));
        } else {
            this.setState(prevState => ({
                Collapsetoggle: [...prevState.Collapsetoggle, name]
            }));
        }
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
            // maxWidth: window.innerWidth >= 576 ? (window.innerWidth >= 992 ? String(window.innerWidth / 1.7) + 'px' : String(window.innerWidth / 1.25) + 'px') : String(window.innerWidth / 1.31) + 'px',
            // maxHeight: '1000px',
            // paddingTop: '32px',
            paddingBottom: '32px',
        };
    };
    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        const { character } = this.props.character;

        let description = "";
        if (character && character?.description !== null) {
            description = character?.description;
        }

        let att = [];
        for (const c of description) {
            if (c === "\n") {
                att.push(<br />)
            }
            else {
                att.push(c)
            }
        }

        // characters.map(({ _id:name }) => {
        //     dropDownSymbolList = [...dropDownSymbolList, this.state.Collapsetoggle.includes(name) ? { name: <span>&#45;</span> } : { name: <span>&#x2B;</span> }]
        //     return dropDownSymbolList;
        // })

        return (
            <div className="characters wrapper animated bounceInLeft">
                {
                    character &&

                    <div align='center' style={this.frameStyle()}>
                        <hr />



                        <legend align='center'>
                            <h2 className='brand display-4' style={tittleStyle}>
                                {character.name}
                            </h2>
                        </legend>
                        {character?.charImage !== '' &&
                            <div>
                                <CardImg bottom className="char-img" src={character?.charImage} onClick={this.onClickImg.bind(this, character?.charImage, '')} id="myImg" />
                            </div>
                        }
                        <div className="px-2 px-md-5" style={{ opacity: '0.7' }}>
                            <p align="left" className='lead'> {att}</p>
                        </div>
                        <legend align='center'>
                            <h2 className='brand display-4' style={secondtittleStyle}>
                                CHARACTER DESIFN
                            </h2>
                        </legend>
                        <div style={this.charStyle()}>

                            <Swiper
                                speed={2000}
                                slidesPerView={1}
                                allowTouchMove={true}
                                loop={true}
                                navigation={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                    reverseDirection: true,
                                }}
                            >
                                {character.propImags &&
                                    character.propImags.map((img) => (
                                        <div key={img}>
                                            <SwiperSlide >
                                                <div style={pageStyle} >
                                                    <CardImg className="prop-imgs" onClick={this.onClickImg.bind(this, img, '')} src={img} id="myImg" />
                                                </div>
                                            </SwiperSlide>
                                        </div>
                                    ))
                                }
                            </Swiper>
                        </div>
                    </div>
                }
                <div id="myModal" className="manga-modal">
                    <span className="close">&times;</span>
                    <img className="modal-content" id="img01" alt="" />
                    <div id="caption"></div>
                </div>
            </div >
        )
    }
}

const tittleStyle = {
    fontFamily: "'Shadows Into Light', Kimberly Geswein",
    letterSpacing: '0.5rem',
    opacity: '0.4',
    fontSize: window.innerWidth >= 992 ? '2.0em' : '1.0em'
}
const secondtittleStyle = {
    fontFamily: "'Brawler', Cyreal",
    letterSpacing: '0.5rem',
    background: `-webkit-linear-gradient(#fae0ff, black)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: window.innerWidth >= 992 ? '2.0em' : '1.0em'
}

const pageStyle = {
    // height: '60px',
    // width: '100vw'

}

const mapStateToProps = state => ({
    character: state.character,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { getCharacters }
)(Character);
