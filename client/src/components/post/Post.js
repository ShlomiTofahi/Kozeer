

import React, { Component, Fragment } from 'react';
import {
  CardText, Card, CardTitle, CardHeader, Row, CardBody, CardImg, Button, Container, Col,
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import { Passers } from "prop-passer";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  PinterestShareButton,

  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  PinterestIcon,
} from "react-share";

import moment from 'moment';
import SunEditor, { buttonList } from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';
import { Redirect } from "react-router-dom";

import axios from 'axios';

// import { Icon, InlineIcon } from '@iconify/react';
// import parrotIcon from '@iconify-icons/twemoji/parrot';
// import dogIcon from '@iconify-icons/twemoji/dog';
// import catIcon from '@iconify-icons/twemoji/cat';

import { deletePost, viewsPost, lovedPost, unlovedPost } from '../../actions/postActions';
import { getPostComments } from '../../actions/commentActions';

import ShowComments from './ShowComments';

class Post extends Component {
  state = {
    path: '/uploads/posts/',
    redirect: null
  };

  static propTypes = {
    deletePost: PropTypes.func.isRequired,
    viewsPost: PropTypes.func.isRequired,
    lovedPost: PropTypes.func.isRequired,
    unlovedPost: PropTypes.func.isRequired,
    getPostComments: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired,
  }


  componentDidMount() {
    this.props.getPostComments(this.props.match.params.id)
  }

  order = (order) => {
    if (order === -1 || order === 1)
      this.props.getPostComments(this.props.match.params.id, order)
  }

  onDeletePostClick = (id, postImage) => {
    this.props.deletePost(id);

    const noImageFullpath = this.state.path + 'no-image.png';
    const filepath = postImage;
    if (filepath !== '' && filepath !== noImageFullpath) {
      const formData = new FormData();
      formData.append('filepath', filepath);
      formData.append('abspath', this.state.path);

      axios.post('/remove', formData);
    }
    this.setState({ redirect: '/forum' });

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

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);

    const { posts } = this.props.post;
    const { comments } = this.props.comment;

    var post = posts.filter(post => post._id === this.props.match.params.id)[0];

    const {
      url = String(window.location),
      title = "Steadylearner Website",
      shareImage = "https://www.steadylearner.com/static/images/brand/prop-passer.png",
      size = "2.5rem",
      iconFillColor = 'black',
      bgStyle = { opacity: 0 }
    } = this.props;

    // const bgStyle = {
    //   color: 'white'
    // }
    // const ShareList = Passers({
    //   url,
    //   className: "network__share-button",
    // })({
    //   className: "network cursor-pointer hover transition--default",
    //   title: `Share ${String(window.location)}`,
    // })("li");

    return (
      <Fragment>
        <div style={postFrameStyle} className='pb-4'>
          <div style={postHeaderStyle} className='pb-4'>
            <div className='row  justify-content-between'>
              <div
              // className='bg-dark col-4 col-sm-4 col-md-3 col-lg-3'
              >
                {/* <AddPostModal /> */}
              </div>
              <div style={postSearchStyle}>
              </div>
            </div>
          </div>
          <Container >
            <div className='mb-4 mt-4 mx-2' style={postBodyStyle}>
              <Container className='px-1 px-sm-4 px-md-5 px-lg-5  pt-4 pb-5'>
                <Row>
                  <div className="input-group col-12 col-sm-8 col-md-6 col-lg-5 ml-1 mt-4">
                    <CardImg bottom style={kozeerProfileImgStyle} src='/images/posts/kozeer_profile.jpg' />
                    <p>
                      <small style={kozeerTextStyle}>Kozeer</small>
                      <small className='text-muted'><CardImg bottom style={crownProfileImgStyle} src='/images/posts/crown.png' /></small>
                      <small style={timeTextStyle} className="text-muted">
                        <span className='ml-1' style={dotStyle}>&#8226;</span> {moment(post.published_date).format('lll')} <span style={dotStyle}>&#8226;</span> 1 min
                      </small>
                    </p>
                  </div>
                </Row>
                <div className="mb-4 ml-2">
                  {/* <CardText style={titleStyle} className="mt-2 mb-4">
                    {post.title} */}
                  {/* kozeer - page 65 + page 66 + page 67 */}
                  {/* </CardText> */}
                  <CardTitle style={titleStyle} tag="h3" className="mt-2 mb-4">
                    {
                      post.is_manga ? <span>KOZER - </span> : null
                    }
                    {post.title}
                  </CardTitle>

                  <CardText className="mb-2 pb-3">
                    <small style={bodyStyle} className='text-muted'>
                      <SunEditor
                        disable={true}

                        enableToolbar={false}
                        showToolbar={false}
                        setContents={post.body}
                        width="100%" height="100%" setOptions={{ resizingBar: false, showPathLabel: false, opacity: '0.9' }} />

                      {/* Hi , Today im her to bring you the new 3 pages of the week,
                              Gomora is really nervous right now and it seems that Scar
                              did not show everything yet. */}
                    </small>
                  </CardText>

                </div>

                {/* <Card align='left' className="forum-post-details-body mt-4"> */}

                {is_admin ?
                  <div>
                    <Button
                      style={btnRemoveStyle}
                      className='remove-btn-admin'
                      color='danger'
                      size='sm'
                      onClick={this.onDeletePostClick.bind(this, post._id, post.postImage)}
                    >&#10007;</Button>
                    {/* <Button
                        style={btnEditStyle}
                        className='edit-btn-admin'
                        title='ערוך'
                        color='warning'
                        size='sm'
                        onClick={this.onEditClick.bind(this, _id)}
                      >&#x2711;</Button> */}
                  </div>
                  : null}

                {post.postImage !== '' &&
                  <div className="item-image pr-3">
                    <CardImg bottom className='ProductImg' src={post.postImage} alt="Card image cap" />
                  </div>
                }
                {/* </Card> */}
                {
                  post.is_manga &&
                  post.mangas && post.mangas.map(({ _id, mangaImage }) => (
                    <div key={_id} style={{ margin: '0' }}>
                      {
                        post.mangas.length &&
                        <CardImg className='mb-5' style={postImgStyle} src={mangaImage} />
                      }
                    </div>
                  ))
                }

                <Container>
                  <Col className='pt-4'>
                    <hr />
                    <Row>
                      {/* <div className="input-group"> */}
                      {/* <p>
                          <small style={postFooterStyle} className="text-muted pl-3 mb-2"> */}

                      {/* <ShareList> */}
                      <FacebookShareButton
                        className='ml-5'
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
                      {/* </ShareList> */}
                      {/* </small>
                        </p> */}
                      {/* </div> */}
                    </Row>
                  </Col>
                  <Col>
                    <hr />
                    <Row>

                      <div className="input-group">
                        <p>
                          <small style={postFooterStyle} className="text-muted pl-3 mb-2">
                            {post.views} views
                             <span className='text-dark post-link pl-2'>
                              {comments.length} comments
                             </span>
                            <span style={postLovedStyle}>
                              <span className='mr-1'>{post.loved}</span>
                              <buttn className='post-loved-btn' onClick={this.onLovedClick.bind(this, post._id)}>
                                {
                                  localStorage.getItem('lovedPostList').includes(String(post._id)) ?
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

                {this.state.redirect &&
                  <Redirect exact from='/forum/post/:id' to={this.state.redirect} />
                }
              </Container>

            </div>

            <div className='mb-4 mt-5 mx-2' style={postBodyStyle}>
              <ShowComments postID={this.props.match.params.id} order={this.order} />
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
  // color: 'white',
  width: '65%',
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
  // position: 'absolute',
  textAlign: 'right',
  margin: '15px',
  paddingRight: '10px'
  // right: '0'
}

const kozeerProfileImgStyle = {
  borderRadius: '50%',
  width: '25px',
  height: '25px',
  marginRight: '5px',
  // marginTop: '9px',
}
const crownProfileImgStyle = {
  width: '15px',
  // height: '6px',
  marginTop: '0px'
}
const kozeerTextStyle = {
  fontSize: '14px',
  marginRight: '1.5px',
  color: 'black'
}
const timeTextStyle = {
  fontSize: '11px',
  // display: 'block'
}
const dotStyle = {
  fontSize: '10px',
}
const bodyStyle = {
  // all: 'unset',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  fontSize: '14px',
  // opacity:'0.4',
}
const titleStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontFamily: "'Mountains of Christmas', Tart Workshop",
  fontSize: window.innerWidth / 35 + 'px',
  color: 'black',
  opacity: '0.8'
}
const postLovedStyle = {
  position: 'absolute',
  right: '0'
}

const postFooterStyle = {
  fontSize: '8px',
  display: 'block',
  marginTop: '-6px',
  fontSize: '13px'
}
const btnRemoveStyle = {
  background: "#d15258",
  color: "#fff",
  border: "none",
  margin: "auto 0",
  padding: "0px 2.5px",
  // borderRadius: "50%",
  // cursor: "pointer",
  // float: "right",
};
const postImgStyle = {
  backgroundSize: 'contain',
  objectFit: 'cover',
  backgroundPosition: 'top',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block',
  width: '90%',
  // maxHeight: '320px',
}

const iconStyle = {
  backgroundColor: 'white',
  color: 'white',
}

const inputStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.411)',
  borderRadius: '1px',
  marginTop: '-9px',
};
const inputSearchStyle = {
  width: '55px',
  marginTop: '-3px'
}
const searchLimitStyle = {
  marginTop: '-2px'
}

const postProperties = {
  position: 'absolute',
  left: '0',
  top: '0',
  paddingLeft: '18px',
}
const postUserDetails = {
  // background: "gray",
  // color: "#fff",
  // position: 'relative',
  // width: '100%',
  // height: "100px",
  // width: "900px",
  // border: '1px solid rgb(230, 230, 230)',

  // margin: "auto 0",
  // padding: "0px 2.5px",
  // paddingTop: "20px",
  // borderRadius: "50%",
  // cursor: "pointer",
  // float: "right",
  // webkitBoxShadow: '0 0 1px 0.1px #C7C7C7',
  // boxSshadow: '0 0 1px 0.1px #C7C7C7',
  // webkitBorderRadius: '15px',
  // mozBorderRadius: '15px',
  // borderRadius: '15px', 
};
// const postHeader = {
//   background: "gray",
//   color: "#fff",
//   position: 'relative',
//   width: '100%',
//   height: "100px",
//   margin: "auto 0",
//   padding: "0px 2.5px",
// };

const mapStateToProps = state => ({
  post: state.post,
  comment: state.comment,
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { deletePost, viewsPost, lovedPost, unlovedPost, getPostComments }
)(Post);
