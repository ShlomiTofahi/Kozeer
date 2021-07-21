
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

import { deletePost, viewsPost, lovedPost, unlovedPost } from '../../actions/postActions';
// import { clearErrors, returnErrors } from '../../actions/errorActions';
// import { clearMsgs, returnMsgs } from '../../actions/msgActions';

class ShowPosts extends Component {
  state = {
    path: '/uploads/posts/',
    modal: false,
    lovedcicked: false
  };

  static protoType = {
    auth: PropTypes.object,
    viewsPost: PropTypes.func.isRequired,
    lovedPost: PropTypes.func.isRequired,
    unlovedPost: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
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
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);
    const elements = this.props.elements
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
            {elements && elements.map(({ _id, title, body, published_date, views, comments, user, postImage, loved, is_manga, mangas }) => (
              <CSSTransition key={_id} timeout={500} classNames='fade'>
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
                        <Row>
                          <div className="input-group col-12 col-sm-8 col-md-6 col-lg-5 ml-1 mt-4">
                            <CardImg bottom style={kozeerProfileImgStyle} src='/images/posts/kozeer_profile.jpg' />
                            <p>
                              <small style={kozeerTextStyle}>Kozeer</small>
                              <small className='text-muted'><CardImg bottom style={crownProfileImgStyle} src='/images/posts/crown.png' /></small>
                              <small style={timeTextStyle} className="text-muted">
                                {moment(published_date).format('lll')} <span style={dotStyle}>&#8226;</span> 1 min
                                {/* פורסם ב:
                  {moment(post.published_date).format(' DD/MM/YYYY')}&nbsp;
                  בשעה:
                  {moment(post.published_date).format(' hh:mm')} */}
                              </small>
                            </p>
                          </div>
                        </Row>
                        <div className="mb-4 ml-2">
                          <CardText style={titleStyle} className="mb-2">
                            {/* {
                              is_manga ? <span>KOZEER - </span> : null
                            } */}
                            {title}
                            {/* kozeer - page 65 + page 66 + page 67 */}
                          </CardText>
                          <CardText className="mb-2 pb-3">
                            {body !== '' &&
                              <small style={bodyStyle} className='text-muted'>
                                <SunEditor
                                  disable={true}

                                  enableToolbar={false}
                                  showToolbar={false}
                                  setContents={body}
                                  width="100%" height="100%" setOptions={{ resizingBar: false, showPathLabel: false }} />

                                {/* Hi , Today im her to bring you the new 3 pages of the week,
                              Gomora is really nervous right now and it seems that Scar
                              did not show everything yet. */}
                              </small>
                            }
                          </CardText>
                        </div>
                        {/* <Row>
                          <span className="forum-post-title">{title}<br />
                          </span>

                          <span className='forum-post'>
                            <Row className='pt-2'>

                              <small className='ml-3 ml-sm-1 ml-md-3 ml-lg-4'>
                                תגובות:
                          <br />
                                {comments.length}
                              </small>

                              <small className='ml-3 ml-sm-1 ml-md-3 ml-lg-4'>
                                צפיות:
                          <br />
                                {views}
                              </small>
                              <small className='ml-2 ml-sm-1 ml-md-2 ml-lg-3'>
                                מועד העלאה:
                          <br />
                                {moment(published_date).format('DD/MM/YYYY')}
                              </small>
                            </Row>
                          </span>
                        </Row> */}
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
                              {views} views
                              <span className='text-dark post-link pl-2'>
                                {comments.length} comments
                              </span>
                              <Link to={'/post/' + _id} className='text-dark post-link pl-2 d-block d-sm-inline' onClick={this.handleClickPost.bind(this, _id)}>
                                Write a comment
                              </Link>
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
                </ListGroupItem>
              </CSSTransition>
            ))}
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
  border: '5px solid #730104'
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
  maxHeight: '320px',
}

const kozeerProfileImgStyle = {
  borderRadius: '50%',
  width: '25px',
  height: '25px',
  marginRight: '5px',
  marginTop: '9px',
}
const crownProfileImgStyle = {
  width: '12px',
  // height: '6px',
  marginTop: '0px'
}
const kozeerTextStyle = {
  fontSize: '9px',
  marginRight: '1.5px',
}
const timeTextStyle = {
  fontSize: '8px',
  display: 'block'
}
const postFooterStyle = {
  fontSize: '8px',
  display: 'block',
  marginTop: '-6px',
  fontSize: '13px'
}
const dotStyle = {
  fontSize: '6px',
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
  // fontFamily: "'Mountains of Christmas', Tart Workshop",
  fontFamily: "'Brawler', Cyreal",
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontSize: window.innerWidth / 47 + 'px'
}
const postLovedStyle = {
  position: 'absolute',
  right: '0',
}

// const btnEditStyle = {
//   background: "orange",
//   color: "#fff",
//   border: "none",
//   padding: "5px 9px",
//   borderRadius: "50%",
//   cursor: "pointer",
//   float: "right",
// };

const mapStateToProps = (state) => ({
  auth: state.auth,
  // msg: state.msg,
  error: state.error
});

export default connect(
  mapStateToProps,
  {
    deletePost, viewsPost, lovedPost, unlovedPost
    //  clearErrors, clearMsgs, returnErrors, returnMsgs
  }
)(ShowPosts);