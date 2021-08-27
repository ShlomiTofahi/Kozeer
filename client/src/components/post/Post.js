

import React, { Component, Fragment } from 'react';
import {
  CardText, CardTitle, Row, CardImg, Container, Col,
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PostSuggestions from './PostSuggestions'
import { getPostById } from '../../actions/postActions'

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  FacebookMessengerShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  PinterestIcon,
  FacebookMessengerIcon,
  EmailIcon
} from "react-share";

import moment from 'moment';
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import { Redirect } from "react-router-dom";

import axios from 'axios';

import { deletePost, viewsPost, lovedPost, unlovedPost } from '../../actions/postActions';
import { getPostComments } from '../../actions/commentActions';

import ShowComments from './ShowComments';
import EditPostModal from './EditPostModal'

class Post extends Component {
  state = {
    path: '/uploads/posts/',
    redirect: null
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
    deletePost: PropTypes.func.isRequired,
    viewsPost: PropTypes.func.isRequired,
    lovedPost: PropTypes.func.isRequired,
    unlovedPost: PropTypes.func.isRequired,
    getPostComments: PropTypes.func.isRequired,
    getPostById: PropTypes.func.isRequired
  }


  componentDidMount() {
    this.props.getPostById(this.props.match.params.id)
    this.props.getPostComments(this.props.match.params.id)
  }

  componentDidUpdate(prevProps) {
    const { msg } = this.props;

    if (msg && msg.id === 'DELETE_POST_SUCCESS') {
      const filepath = this.state.postImage;
      if (filepath !== '') {
        const formData = new FormData();
        formData.append('filepath', filepath);
        console.log("*remove onDeletePostClick");
        axios.post('/remove', formData);
      }
    }
  }

  order = (order) => {
    if (order === -1 || order === 1)
      this.props.getPostComments(this.props.match.params.id, order)
  }

  onDeletePostClick = (id, postImage) => {
    this.setState({ postImage });
    this.props.deletePost(id);
    this.setState({ redirect: '/' });
  }

  handleClickPost = (id) => {
    var viewedPostList = localStorage.getItem('viewedPostList');
    if (!viewedPostList)
      viewedPostList = [];

    if (!viewedPostList.includes(String(id))) {
      this.props.viewsPost(id)
      viewedPostList = viewedPostList.concat(String(id))
    }

    localStorage.setItem('viewedPostList', viewedPostList);
  }
  onLovedClick = (id) => {
    var lovedPostList = localStorage.getItem('lovedPostList');
    if (!lovedPostList)
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
        lovedPostList = lovedPostList.replaceAll(id, '')
      }
    }
    localStorage.setItem('lovedPostList', lovedPostList);
    this.setState({
      lovedcicked: !this.state.lovedcicked
    })
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

  exitImg = () => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  };

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);

    const { post } = this.props.post;
    const { comments } = this.props.comment;

    const {
      url = String(window.location),
      title = "Steadylearner Website",
      shareImage = "https://www.steadylearner.com/static/images/brand/prop-passer.png",
      size = "2.5rem",
      iconFillColor = 'black',
      bgStyle = { opacity: 0 }
    } = this.props;

    return (
      <Fragment>
        <div style={postFrameStyle} className='pb-4'>
          <div style={postHeaderStyle} className='pb-4'>
            <div className='row justify-content-between'>
              <div style={postSearchStyle}>
              </div>
            </div>
          </div>
          <Container className="action-hover-list">
            <div className='mb-4 mt-4 mx-2' style={postBodyStyle}>
              <Container className='action-item px-1 px-sm-4 px-md-5 px-lg-5  pt-4 pb-5'>
                {is_admin ?
                  <div className="post-btns">
                    {/* <Button
                      style={btnRemoveStyle}
                      className='remove-btn-admin'
                      color='danger'
                      size='sm'
                      onClick={this.onDeletePostClick.bind(this, post?._id, post?.postImage)}
                    >&#10007;</Button> */}
                    <button onClick={this.onDeletePostClick.bind(this, post?._id, post?.postImage)} className="delete-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                      </svg>
                    </button>
                    <EditPostModal postID={post?._id} />
                  </div>
                  : null}
                <Row>
                  <div className="input-group col-12 col-sm-8 col-md-6 col-lg-5 ml-1 mt-4">
                    <CardImg bottom style={kozeerProfileImgStyle} src='/images/posts/kozeer_profile.jpg' />
                    <p>
                      <small style={kozeerTextStyle}>Kozeer</small>
                      <small className='text-muted'><CardImg bottom style={crownProfileImgStyle} src='/images/posts/crown.png' /></small>
                      <small style={timeTextStyle} className="text-muted">
                        <span className='ml-1' style={dotStyle}>&#8226;</span> {moment(post?.published_date).format('lll')} <span style={dotStyle}>&#8226;</span> 1 min
                      </small>
                    </p>
                  </div>
                </Row>
                <div className="mb-4 ml-2">
                  <CardTitle style={titleStyle} tag="h3" className="mt-2 mb-4">
                    {post?.title}
                  </CardTitle>

                  <CardText className="mb-2 pb-3">
                    {post?.body !== '' &&
                      <small style={bodyStyle} className='text-muted'>
                        <SunEditor
                          disable={true}

                          enableToolbar={false}
                          showToolbar={false}
                          setContents={post?.body}
                          width="100%" height="100%" setOptions={{ resizingBar: false, showPathLabel: false, opacity: '0.9' }} />
                      </small>
                    }
                  </CardText>
                </div>

                {post?.postImage !== '' &&
                  <div className="item-image pr-3">
                    <CardImg bottom src={post?.postImage} onClick={this.onClickImg.bind(this, post?.postImage, '')} id="myImg" />
                    {/* <CardImg className='mb-5' style={postImgStyle} src={post?.postImage} onClick={this.onClickImg.bind(this, post?.postImage, '')} id="myImg" /> */}
                  </div>
                }
                {
                  post?.is_manga &&
                  post?.mangas && post?.mangas.map(({ _id, mangaImage }) => (
                    <div key={_id} style={{ margin: '0' }}>
                      {
                        post?.mangas.length &&
                        <CardImg className='mb-5' style={postImgStyle} src={mangaImage} onClick={this.onClickImg.bind(this, mangaImage, '')} id="myImg" />
                      }
                    </div>
                  ))
                }
                {window.innerWidth >= 992 ?
                  <Fragment>
                    <hr />
                    <Row className="d-flex justify-content-center">
                      <FacebookShareButton
                        url={`${url}`}
                        media={`${shareImage}`}
                      >
                        <FacebookIcon
                          size={size}
                          iconFillColor={iconFillColor}
                          bgStyle={bgStyle}
                        />
                      </FacebookShareButton>

                      <TwitterShareButton
                        className='ml-5'
                        title={title}
                        url={`${url}`}
                      >
                        <TwitterIcon
                          size={size}
                          iconFillColor={iconFillColor}
                          bgStyle={bgStyle}
                        />
                      </TwitterShareButton>

                      <WhatsappShareButton
                        className='ml-5'
                        url={`${url}`}
                        title={title}
                        separator=":: "
                      >
                        <WhatsappIcon
                          size={size}
                          iconFillColor={iconFillColor}
                          bgStyle={bgStyle}
                        />
                      </WhatsappShareButton>

                      <LinkedinShareButton
                        className='ml-5'
                        url={`${url}`}
                        title={title}
                        windowWidth={750}
                        windowHeight={600}
                      >
                        <LinkedinIcon
                          size={size}
                          iconFillColor={iconFillColor}
                          bgStyle={bgStyle}
                        />
                      </LinkedinShareButton>

                      <PinterestShareButton
                        className='ml-5'
                        url={`${url}`}
                        media={`${shareImage}`}
                        windowWidth={1000}
                        windowHeight={730}
                      >
                        <PinterestIcon
                          size={size}
                          iconFillColor={iconFillColor}
                          bgStyle={bgStyle}
                        />
                      </PinterestShareButton>
                      <EmailShareButton
                        className='ml-5'
                        url={`${url}`}
                        media={`${shareImage}`}
                      >
                        <EmailIcon
                          size={size}
                          iconFillColor={iconFillColor}
                          bgStyle={bgStyle}
                        />
                      </EmailShareButton>
                    </Row>
                    <hr />
                  </Fragment> :
                  <Fragment>
                    <hr />
                    <Container>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex flex-column">
                          <FacebookShareButton
                            url={`${url}`}
                            media={`${shareImage}`}
                          >
                            <FacebookIcon
                              size={size}
                              iconFillColor={iconFillColor}
                              bgStyle={bgStyle}
                            />
                          </FacebookShareButton>

                          <TwitterShareButton
                            title={title}
                            url={`${url}`}
                          >
                            <TwitterIcon
                              size={size}
                              iconFillColor={iconFillColor}
                              bgStyle={bgStyle}
                            />
                          </TwitterShareButton>
                        </div>
                        <div className="d-flex flex-column">
                          <WhatsappShareButton
                            url={`${url}`}
                            title={title}
                            separator=":: "
                          >
                            <WhatsappIcon
                              size={size}
                              iconFillColor={iconFillColor}
                              bgStyle={bgStyle}
                            />
                          </WhatsappShareButton>
                          <LinkedinShareButton
                            url={`${url}`}
                            title={title}
                            windowWidth={750}
                            windowHeight={600}
                          >
                            <LinkedinIcon
                              size={size}
                              iconFillColor={iconFillColor}
                              bgStyle={bgStyle}
                            />
                          </LinkedinShareButton>
                        </div>
                        <div className="d-flex flex-column">
                          <PinterestShareButton
                            url={`${url}`}
                            media={`${shareImage}`}
                            windowWidth={1000}
                            windowHeight={730}
                          >
                            <PinterestIcon
                              size={size}
                              iconFillColor={iconFillColor}
                              bgStyle={bgStyle}
                            />
                          </PinterestShareButton>

                          <FacebookMessengerShareButton
                            url={`${url}`}
                            media={`${shareImage}`}
                            windowWidth={1000}
                            windowHeight={730}
                          >
                            <FacebookMessengerIcon
                              size={size}
                              iconFillColor={iconFillColor}
                              bgStyle={bgStyle}
                            />
                          </FacebookMessengerShareButton>
                        </div>
                      </div>
                    </Container>
                    <hr />
                  </Fragment>
                }

                <Col>
                  {/* <hr /> */}
                  <Row>

                    <div className="input-group">
                      <p>
                        <small style={postFooterStyle} className="text-muted pl-3 mb-2">
                          {post?.views} views
                          <span className='text-dark post-link pl-2'>
                            {comments.length} comments
                          </span>
                          <span style={postLovedStyle}>
                            <span className='mr-1'>{post?.loved}</span>
                            <button className='post-loved-btn' onClick={this.onLovedClick.bind(this, post?._id)}>
                              {
                                localStorage.getItem('lovedPostList') && localStorage.getItem('lovedPostList').includes(String(post?._id)) ?
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                    <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                                  </svg> :
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
                                    <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                                  </svg>
                              }
                            </button>
                          </span>
                        </small>
                      </p>
                    </div>
                  </Row>
                </Col>
                {/* </Container> */}

                {this.state.redirect &&
                  <Redirect exact from='/post/:id' to={this.state.redirect} />
                }
              </Container>
            </div>
            <PostSuggestions />
            <div className='mb-4 mt-5 mx-2' style={postBodyStyle}>
              <ShowComments postID={this.props.match.params.id} order={this.order} />
            </div>
            <div id="myModal" className="manga-modal">
              <button onClick={this.exitImg} className="close">&times;</button>
              <img className="modal-content" id="img01" alt="" />
              <div id="caption"></div>
            </div>
          </Container>
        </div>
      </Fragment>
    );
  }
}

const postFrameStyle = {
  margin: '0 auto',
  backgroundColor: '#221415dc',
  width: window.innerWidth >= 992 ? '65%' : "90%"
};
const postBodyStyle = {
  background: "white",
  paddingBottom: "10px",
  padding: "0",
  border: '5px solid #730104'
};
const postHeaderStyle = {
  backgroundColor: '#7301056e',
}
const postSearchStyle = {
  textAlign: 'right',
  margin: '15px',
  paddingRight: '10px'
}
const kozeerProfileImgStyle = {
  borderRadius: '50%',
  width: '25px',
  height: '25px',
  marginRight: '5px',
}
const crownProfileImgStyle = {
  width: '15px',
  marginTop: '0px'
}
const kozeerTextStyle = {
  fontSize: '14px',
  marginRight: '1.5px',
  color: 'black'
}
const timeTextStyle = {
  fontSize: '11px',
}
const dotStyle = {
  fontSize: '10px',
}
const bodyStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  fontSize: '14px',
}
const titleStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontFamily: "'Brawler', Cyreal",
  fontSize: window.innerWidth / 35 + 'px',
  color: 'black',
  opacity: '0.8'
}
const postLovedStyle = {
  position: 'absolute',
  right: '0'
}
const postFooterStyle = {
  display: 'block',
  marginTop: '-6px',
  fontSize: '13px'
}
const postImgStyle = {
  backgroundSize: 'contain',
  objectFit: 'cover',
  backgroundPosition: 'top',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block',
  width: '90%',
}

const mapStateToProps = state => ({
  post: state.post,
  comment: state.comment,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { deletePost, viewsPost, lovedPost, unlovedPost, getPostComments, getPostById }
)(Post);
