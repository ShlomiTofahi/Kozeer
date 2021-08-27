import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Collapse } from 'react-collapse';
import { CardImg, Button } from 'reactstrap';
import axios from 'axios';

import { getCharacters, deletePropCharacter, deleteCharacter } from '../../actions/characterActions';
import AddPropCharacterModal from './AddPropCharacterModal';
import EditCharImageModal from './EditCharImageModal';
import EditCharacterModal from './EditCharacterModal';


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
        propImg: '',
        avatarImage: '',
        charImage: '',
        propImages: []

    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        getCharacters: PropTypes.func.isRequired,
        deletePropCharacter: PropTypes.func.isRequired,
    }

    componentDidMount() {
        // this.props.getCharacters();
    }

    componentDidUpdate(prevProps) {
        const { msg } = this.props;
        if (msg && msg.id === 'DELETE_PROP_CHARACTER_SUCCESS') {
            if (this.state.propImg !== '') {
                const formData = new FormData();
                formData.append('filepath', this.state.propImg);
                console.log("*remove onDeletePropCharClick 1");
                axios.post('/remove', formData);
                this.setState({ propImg: '' });
            }
        }
        if (msg && msg.id === 'DELETE_CHARACTER_SUCCESS') {
            if (this.state.avatarImage !== '') {
                const formData = new FormData();
                formData.append('filepath', this.state.avatarImage);
                console.log("*remove onDeletePropCharClick 2");
                axios.post('/remove', formData);
                this.setState({ avatarImage: '' });
            }
            if (this.state.charImage !== '') {
                const formData = new FormData();
                formData.append('filepath', this.state.charImage);
                console.log("*remove onDeletePropCharClick 3");
                axios.post('/remove', formData);
                this.setState({ charImage: '' });
            }
            if (this.state.propImages && this.state.propImages.length) {
                for (const propImage of this.state.propImages) {
                    if (propImage !== '') {
                        const formData = new FormData();
                        formData.append('filepath', propImage);
                        console.log("*remove onDeletePropCharClick 4");
                        axios.post('/remove', formData);
                    }
                }
                this.setState({ propImages: [] });
            }
        }
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


    onDeletePropCharClick = (id, propImg) => {
        this.setState({ propImg })
        this.props.deletePropCharacter(id, propImg);
    }

    onDeleteCharacterClick = () => {
        const { character } = this.props.character;
        this.setState({
            avatarImage: character.avatarImage,
            charImage: character.charImage,
            proImages: character.proImages,
        })

        this.props.deleteCharacter(character._id);

        // const noImageFullpath = this.state.path + 'no-image.png';
        // const filepath = character.avatarImage;
        // if (filepath !== '' && filepath !== noImageFullpath) {
        //   const formData = new FormData();
        //   formData.append('filepath', filepath);

        //   console.log("*remove Post");
        //   axios.post('/remove', formData);
        // }
        // this.setState({ redirect: '/' });

    }

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
        if (character && character?.description) {
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

                        <EditCharacterModal />
                        <br />
                        {is_admin &&
                            <Button
                                outline
                                size='sm'
                                color='danger'
                                style={{ marginBottom: '2rem' }}
                                onClick={this.onDeleteCharacterClick} >
                                Delete Character
                            </Button>
                        }


                        <legend align='center'>
                            <h2 className='brand display-4' style={tittleStyle}>
                                {character.name}
                            </h2>
                        </legend>
                        {character?.charImage !== '' &&
                            <div className='hover-item'>
                                <EditCharImageModal  />
                                <CardImg bottom className="char-img" src={character?.charImage} onClick={this.onClickImg.bind(this, character?.charImage, '')} id="myImg" />
                            </div>
                        }
                        <div className="px-2 px-md-5" style={{ opacity: '0.7' }}>
                            <p align="left" className='lead'> {att}</p>
                        </div>
                        <AddPropCharacterModal />

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
                                {character.propImages &&
                                    character.propImages.map((img) => (
                                        <SwiperSlide key={img}>
                                            <div className='hover-item'>
                                                <div style={pageStyle} >
                                                    <CardImg className="prop-imgs" onClick={this.onClickImg.bind(this, img, '')} src={img} id="myImg" />
                                                </div>
                                                <button onClick={this.onDeletePropCharClick.bind(this, character._id, img)} className="hover-delete-btn mt-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </SwiperSlide>
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
    auth: state.auth,
    msg: state.msg,
});

export default connect(
    mapStateToProps,
    { getCharacters, deletePropCharacter }
)(Character);
