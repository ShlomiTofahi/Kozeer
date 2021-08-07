import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { CardImg } from 'reactstrap';

import { getMangas } from '../../actions/mangaActions';
import { getChapters } from '../../actions/chapterActions';

import SetCoverBookImageModal from '../SetCoverBookImageModal';

import SwiperCore, { Navigation, Pagination, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, A11y]);

class Manga extends Component {
    state = {
        path: "/images/manga/"
    }
    static propTypes = {
        auth: PropTypes.object.isRequired,
        setting: PropTypes.object.isRequired,
        manga: PropTypes.object.isRequired,
        chapter: PropTypes.object.isRequired,
        getChapters: PropTypes.func.isRequired,
        getMangas: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getMangas();
        this.props.getChapters();
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

    aboutStyle = () => {
        return {
            WebkitBorderRadius: '10px',
            MozBorderRadius: '10px',
            borderRadius: '10px',
            margin: '0 auto',
            backgroundColor: '#323232',
            color: 'white',
            width: '80%',
        };
    };
    mangaStyle = () => {
        return {
            WebkitBorderRadius: '10px',
            MozBorderRadius: '10px',
            borderRadius: '10px',
            margin: '0 auto',
            color: 'white',
            maxWidth: String(window.innerWidth / 1.7) + 'px',
            maxHeight: '1000px',
            paddingTop: '100px',
            paddingBottom: '100px',
        };
    };
    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        const { chapters } = this.props.chapter;
        const { setting } = this.props.setting;

        let coverBookImage = "";
        if (setting?.coverBookImage !== null) {
            coverBookImage = setting.coverBookImage;
        }

        return (
            <div className="wrapper animated bounceInLeft">
                <div align='center' style={this.aboutStyle()}>
                    <legend align='center'>
                        <h2 className='brand display-4 pt-4 pb-1' style={window.innerWidth >= 992 ? { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4' } : { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', fontSize: '2.0em' }}>
                            MANGA CHAPTERS
                        </h2>
                    </legend>
                    <div style={bookStyle} className='m-3'>
                        <div style={this.mangaStyle()}>
                            <Swiper
                                spaceBetween={30}
                                speed={2000}
                                slidesPerView={2}
                                navigation
                                pagination={{ clickable: true }}
                                allowTouchMove={true}
                                loop={false}
                            >
                                {
                                    coverBookImage !== "" &&
                                    <SwiperSlide>
                                        <div style={pageStyle} >
                                            <CardImg onClick={this.onClickImg.bind(this, coverBookImage, "Cover-Book")} id="myImg" className='fullpage-manga-slider-imgs' src={coverBookImage} alt={"kozeer-cover-book"} />
                                        </div>
                                        <span style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', color: 'gray' }}>Cover-Book</span>
                                    </SwiperSlide>
                                }
                                {chapters &&
                                    chapters.map(({ _id: chapterID, chapterImage, name, mangas }) => (
                                        <div key={chapterID}>
                                            <SwiperSlide >
                                                <div style={pageStyle} >
                                                    <CardImg onClick={this.onClickImg.bind(this, chapterImage, name)} id="myImg" className='manga-slider-imgs' src={chapterImage} alt={name} />
                                                </div>
                                                <span style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', color: 'gray' }}>{name}</span>
                                            </SwiperSlide>
                                            {mangas && mangas.sort((a, b) => Number(a.page.substring(4)) - Number(b.page.substring(4))).map(({ _id: mangaid, mangaImage, page, fullpage }) => (
                                                <SwiperSlide key={mangaid}>
                                                    <div style={pageStyle} >
                                                        <CardImg onClick={this.onClickImg.bind(this, mangaImage, page)} id="myImg" className={fullpage === true ? 'fullpage-manga-slider-imgs' : 'manga-slider-imgs'} src={mangaImage} alt={page} />
                                                    </div>
                                                    <span style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', color: 'gray' }}>{page}</span>
                                                </SwiperSlide>
                                            ))}
                                        </div>
                                    ))
                                }
                            </Swiper>
                        </div>
                    </div>
                    <div id="myModal" className="manga-modal">
                        <span className="close">&times;</span>
                        <img className="modal-content" id="img01" alt="" />
                        <div id="caption"></div>
                    </div>
                    <div className='lead pl-5 pb-4'>
                        <p>
                            CHAPTER 1 - THE EXPERIMENT
                            <br />
                            <a className='login-btn' href='https://drive.google.com/drive/folders/1JeQhtu-jH63ajoZYUjzAmFE2uOV62pAy'>
                                link 1
                            </a>
                            <br /><br />
                            CHAPTER 2 - NEW WORLD
                            <br />
                            <a className='login-btn' href='https://drive.google.com/drive/folders/1sSxAAmFnCeRy6I3B3gsFf29qfkgd3PMp'>
                                link 2
                            </a>
                        </p>
                        {
                            is_admin &&
                            <Fragment>
                                <div style={{ border: "dashed 1px gray", width: "25%" }} align="left">
                                    <div className="pl-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-gear mr-2" viewBox="0 0 16 16">
                                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                        </svg>
                                        <SetCoverBookImageModal />
                                    </div>
                                    <div className="pl-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-gear mr-2" viewBox="0 0 16 16">
                                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                        </svg>
                                        <Link to={'/show-mangas/'} className='login-btn pl-2 d-block d-sm-inline'>
                                            Manga List
                                        </Link>
                                    </div>

                                </div>
                            </Fragment>
                        }
                    </div>
                </div >
            </div >
        )
    }
}

const bookStyle = {
    backgroundImage: `url(/images/manga/open_book.png)`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
}

const pageStyle = {
    //  maxHeight: '1000px'
}

const mapStateToProps = state => ({
    manga: state.manga,
    chapter: state.chapter,
    auth: state.auth,
    setting: state.setting,
});

export default connect(
    mapStateToProps,
    { getMangas, getChapters }
)(Manga);
