
import React, { Component, Fragment } from 'react';
import {
  ListGroupItem, Button, CardImg, Col, Row, Container, CardBody, CardText
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SunEditor, { buttonList } from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import moment from 'moment';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getPosts } from '../../actions/postActions';

import { deletePost, viewsPost, lovedPost, unlovedPost } from '../../actions/postActions';
// import { clearErrors, returnErrors } from '../../actions/errorActions';
// import { clearMsgs, returnMsgs } from '../../actions/msgActions';

class PostSuggestions extends Component {
  state = {
    path: '/uploads/posts/',
    modal: false,
    lovedcicked: false
  };

  static protoType = {
    auth: PropTypes.object,
    post: PropTypes.object,
    viewsPost: PropTypes.func.isRequired,
    lovedPost: PropTypes.func.isRequired,
    unlovedPost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.getPosts();
  }
  handleClickPost = (id) => {
    var viewedPostList = localStorage.getItem('viewedPostList');
    if (viewedPostList == null)
      viewedPostList = [];

    if (!viewedPostList.includes(String(id))) {
      this.props.viewsPost(id)
      viewedPostList = viewedPostList.concat(String(id))
    }

    localStorage.setItem('viewedPostList', viewedPostList);
  }

  onDeleteClick = (id, postImage) => {
    this.props.deletePost(id);

    const noImageFullpath = this.state.path + 'no-image.png';
    const filepath = postImage;
    if (filepath !== '' && filepath !== noImageFullpath) {
      const formData = new FormData();
      formData.append('filepath', filepath);
      formData.append('abspath', this.state.path);

      axios.post('/remove', formData);
    }
  }
  onLovedClick = (id) => {
    var lovedPostList = localStorage.getItem('lovedPostList');
    if (lovedPostList == null)
      lovedPostList = [];

    if (!this.state.lovedcicked) {
      if (!lovedPostList.includes(String(id))) {
        this.props.lovedPost(id)
        lovedPostList = lovedPostList.concat(String(id))
      }
    }
    else {
      if (lovedPostList.includes(String(id))) {
        this.props.unlovedPost(id)
        lovedPostList = lovedPostList.replace(id, '')
      }
    }
    localStorage.setItem('lovedPostList', lovedPostList);
    this.setState({
      lovedcicked: !this.state.lovedcicked
    })
  }

  onEditClick = (id) => {
    //TODO
  }

  render() {
    let { posts } = this.props.post;
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);
    // posts = posts.filter(post => !post.is_manga);

    const heartLoved = this.state.lovedcicked ?
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
        <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
      </svg> :
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
        <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
      </svg>

    return (
      <Fragment >
        <Container>
          <TransitionGroup align='left' className='pt-4 pb-1'>
            <Row>
              {posts && posts.map(({ _id, title, views, postImage, loved, is_manga, mangas, comments }) => (
                <CSSTransition key={_id} timeout={500} classNames='fade'>
                  <Col xs="12" sm="6" md="4" className='pt-2'>

                    <ListGroupItem className='mb-4 mx-2' style={postBodyStyle}>
                      <Link to={'/post/' + _id} className='text-dark post-link' onClick={this.handleClickPost.bind(this, _id)}>
                        {
                          is_manga ?
                            <Fragment>
                              {
                                mangas.length &&
                                <CardImg className='posts-Imgs' style={postImgStyle} src={mangas[0].mangaImage} />
                              }

                            </Fragment>
                            : <CardImg className='posts-Imgs' style={postImgStyle} src={postImage} />
                        }
                        <Col>
                          <Container>
                            <div className="mb-4 ml-2 mt-3">
                              <CardText style={titleStyle} className="mb-2">
                                {
                                  is_manga ? <span>KOZER - </span> : null
                                }
                                {title}
                              </CardText>
                            </div>

                          </Container>
                        </Col>
                      </Link>

                      <Container>
                        <Col>
                          <hr />
                          <Row>
                            <div className="input-group">
                              <p>
                                <small style={postFooterStyle} className="text-muted pl-3 mb-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 19 19" role="img" aria-label="17 views" class="blog-icon-fill"><title></title><path d="M18.6514224,10.4604595 C17.3924224,11.9688254 13.9774224,15.4790227 9.46342244,15.5 L9.42442244,15.5 C6.26242244,15.5 3.20842244,13.7938483 0.345422443,10.4264963 C-0.115140814,9.88163847 -0.115140814,9.08439833 0.345422443,8.5395405 C1.60442244,7.03117456 5.01942244,3.52097727 9.53342244,3.5 L9.57342244,3.5 C12.7354224,3.5 15.7894224,5.20615167 18.6524224,8.5735037 C19.1122856,9.11875503 19.1118633,9.91569484 18.6514224,10.4604595 Z M17.8674224,9.2228003 C15.2084224,6.09518855 12.4194224,4.50990594 9.57442244,4.50990594 L9.54042244,4.50990594 C5.46142244,4.52888537 2.30642244,7.78335969 1.14042244,9.18084575 C0.991393136,9.3517953 0.988008897,9.60533857 1.13242244,9.78019645 C3.79142244,12.9078082 6.58142244,14.4920919 9.42542244,14.4920919 L9.46042244,14.4920919 C13.5394224,14.4741114 16.6934224,11.2196371 17.8604224,9.822151 C18.0095734,9.6511131 18.0125381,9.39726759 17.8674224,9.2228003 L17.8674224,9.2228003 Z M9.49942244,13.3932823 C7.35251405,13.3646853 5.63255349,11.6080263 5.65157552,9.46333471 C5.67059754,7.31864313 7.42144652,5.59270141 9.56852513,5.6021069 C11.7156037,5.61151239 13.4512316,7.35272696 13.4514224,9.49750271 C13.4349115,11.6625186 11.6668124,13.4054651 9.49942244,13.3932823 L9.49942244,13.3932823 Z M9.49942244,6.61762258 C7.91092198,6.63961751 6.63891624,7.93990193 6.65354481,9.52676854 C6.66817338,11.1136351 7.96393479,12.3902997 9.55257137,12.3830695 C11.1412079,12.3758393 12.4252698,11.0874333 12.4254224,9.50049946 C12.4127657,7.89797688 11.1037033,6.60820738 9.49942244,6.61762258 L9.49942244,6.61762258 Z">
                                  </path></svg>
                                  <span className='ml-1'>{views}</span>
                                  <span className='text-dark post-link pl-2'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 19 19" role="img" aria-label="0 comments" class="blog-icon-fill blog-link-hover-fill"><title></title><path d="M9.5,13 L15,13 C15.5522847,13 16,12.5522847 16,12 L16,12 L16,5 C16,4.44771525 15.5522847,4 15,4 L15,4 L4,4 L4,4 C3.44771525,4 3,4.44771525 3,5 L3,12 C3,12.5522847 3.44771525,13 4,13 L7,13 L7,15.5 L9.5,13 Z M15.0081158,13.973325 L10,13.973325 L7.42191625,16.5445317 C6.63661359,17.3277395 6,17.0667904 6,15.9700713 L6,13.973325 L3.99188419,13.973325 C2.89179693,13.973325 2,13.0706688 2,11.979044 L2,4.994281 C2,3.89287002 2.89339733,3 3.99188419,3 L15.0081158,3 C16.1082031,3 17,3.90265618 17,4.994281 L17,11.979044 C17,13.0804549 16.1066027,13.973325 15.0081158,13.973325 Z">
                                    </path></svg>
                                    <span className='ml-1'>{comments.length}</span>
                             </span>
                                  <span style={postLovedStyle}>
                                    <span className='mr-1'>{loved}</span>
                                    <buttn className='post-loved-btn' onClick={this.onLovedClick.bind(this, _id)}>
                                      {/* {heartLoved} */}
                                      {
                                        localStorage.getItem('lovedPostList').includes(String(_id)) ?
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                            <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                                          </svg> :
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
                                            <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                                          </svg>
                                      }
                                    </buttn>
                                  </span>
                                </small>
                              </p>
                            </div>
                          </Row>
                        </Col>
                      </Container>

                      {is_admin ?
                        <div>
                          <Button
                            style={btnRemoveStyle}
                            className='remove-btn-admin'
                            color='danger'
                            size='sm'
                            onClick={this.onDeleteClick.bind(this, _id, postImage)}
                          >&#10007;</Button>
                        </div>
                        : null}
                    </ListGroupItem>
                  </Col>
                </CSSTransition>
              ))}
            </Row>
          </TransitionGroup>
        </Container>
      </Fragment >
    );
  }
}

const postBodyStyle = {
  background: "white",
  paddingBottom: "10px",
  padding: "0",
  border: '5px solid #730104',
  maxWidth: '292px'
};

const btnRemoveStyle = {
  background: "#d15258",
  color: "#fff",
  border: "none",
  margin: "auto 0",
  padding: "0px 2.5px",
};

const postImgStyle = {
  backgroundSize: 'contain',
  objectFit: 'cover',
  backgroundPosition: 'top',
  width: '100%',
  maxHeight: '160px',
  // maxHeight: '160px',
}

const postFooterStyle = {
  fontSize: '8px',
  display: 'block',
  marginTop: '-6px',
  fontSize: '13px'
}

const titleStyle = {
  fontFamily: "'Mountains of Christmas', Tart Workshop",
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontSize: window.innerWidth / 95 + 'px'
}
const postLovedStyle = {
  position: 'absolute',
  right: '0',
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  post: state.post,
  // msg: state.msg,
  error: state.error
});

export default connect(
  mapStateToProps,
  {
    deletePost, viewsPost, lovedPost, unlovedPost, getPosts
    //  clearErrors, clearMsgs, returnErrors, returnMsgs
  }
)(PostSuggestions);