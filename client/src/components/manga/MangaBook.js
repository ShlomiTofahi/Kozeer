import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ButtonGroup, CardImg } from 'reactstrap';

import { getMangas } from '../../actions/mangaActions';
import { getChapters } from '../../actions/chapterActions';

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
        manga: PropTypes.object.isRequired,
        getChapters: PropTypes.func.isRequired,
        getMangas: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getMangas();
        this.props.getChapters();
    }

    onClickImg = (mangaImage, page) => {
        // alert(mangaImage)
        var modal = document.getElementById("myModal");

        // Get the image and insert it inside the modal - use its "alt" text as a caption
        var img = document.getElementById("myImg");
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
            // maxWidth: '900px',
            maxWidth: String(window.innerWidth / 1.7) + 'px',
            maxHeight: '1000px',
            paddingTop: '100px',
            paddingBottom: '100px',
        };
    };
    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        const { mangas } = this.props.manga;
        const { chapters } = this.props.chapter;

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
                                {chapters &&
                                    chapters.map(({ _id:chapterID, chapterImage, name, mangas }) => (
                                        <Fragment>
                                            <SwiperSlide key={chapterID}>
                                                <div style={pageStyle} >
                                                    <CardImg onClick={this.onClickImg.bind(this, chapterImage, name)} id="myImg" className='manga-slider-imgs' src={chapterImage} alt={name} />
                                                </div>
                                                <span style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', color: 'gray' }}>{name}</span>
                                            </SwiperSlide>
                                            {mangas && mangas.sort((a, b) =>  Number(a.page.substring(4))-Number(b.page.substring(4))).map(({ _id, mangaImage, page, fullpage }) => (
                                                <SwiperSlide key={_id}>
                                                    <div style={pageStyle} >
                                                        <CardImg onClick={this.onClickImg.bind(this, mangaImage, page)} id="myImg" className={fullpage === true ? 'fullpage-manga-slider-imgs' : 'manga-slider-imgs'} src={mangaImage} alt={page} />
                                                    </div>
                                                    <span style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', color: 'gray' }}>{page}</span>
                                                </SwiperSlide>
                                            ))}
                                        </Fragment>
                                    ))
                                }
                            </Swiper>
                        </div>
                    </div>
                    <div id="myModal" className="manga-modal">
                        <span className="close">&times;</span>
                        <img className="modal-content" id="img01" />
                        <div id="caption"></div>
                    </div>
                    <div className='lead pl-5 pb-2'>
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
                            is_admin && <Link to={'/show-mangas/'} className='login-btn pl-2 d-block d-sm-inline'>
                                Manga List
                            </Link>
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
    // width: '900px'
}

const pageStyle = {
    //  maxHeight: '1000px'
}

const mapStateToProps = state => ({
    manga: state.manga,
    chapter: state.chapter,
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { getMangas, getChapters }
)(Manga);
