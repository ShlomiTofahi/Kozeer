

import React, { Component, Fragment } from 'react';
import {
  CardText, Card, CardTitle, CardHeader, Row, CardBody, CardImg, Button, Container, Col,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Collapse } from 'react-collapse';

import { deleteComment, lovedComment, unlovedComment } from '../../actions/commentActions';

import AddComment from './AddComment';
import { ShareModal } from './ShareModal';

class ShowComments extends Component {
  state = {
    reply: false,
    sortCommentDropdownOpen: false,
    sortComment: 'Newest',
    // dropDownSortCommentValue: 'Newest'
  };

  static propTypes = {
    deleteComment: PropTypes.func.isRequired,
    lovedComment: PropTypes.func.isRequired,
    unlovedComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    comment: PropTypes.object.isRequired
  }

  onDeleteCommentClick = (command_id) => {
    const { posts } = this.props.post;
    var post = posts.filter(post => post._id === this.props.postID)[0];
    const post_id = post._id;
    this.props.deleteComment(post_id, command_id);
  }

  onDeletePostClick = (id) => {
    this.props.deletePost(id);
  }

  dropdownOpenToggle = () => this.setState({ sortCommentDropdownOpen: !this.state.sortCommentDropdownOpen });

  selectSortComment = (e) => {
    let order = 0
    this.setState({
      [e.target.name]: e.target.innerText,
    });
    if (e.target.innerText === 'Newest')
      order = -1
    else if (e.target.innerText === 'Oldest')
      order = 1

    if (order !== 0 && this.props.order)
      this.props.order(order)
  }

  onLovedClick = (id) => {

    var lovedCommentList = localStorage.getItem('lovedCommentList');
    if (lovedCommentList == null)
      lovedCommentList = [];

    if (!this.state.lovedcicked) {
      if (!lovedCommentList.includes(String(id))) {
        this.props.lovedComment(id)
        lovedCommentList = lovedCommentList.concat(String(id))
      }
    }
    else {
      if (lovedCommentList.includes(String(id))) {
        this.props.unlovedComment(id)
        lovedCommentList = lovedCommentList.replace(id, '')
      }
    }
    localStorage.setItem('lovedCommentList', lovedCommentList);
    this.setState({
      lovedcicked: !this.state.lovedcicked
    })
  }

  onReplyClick = (id) => {
    let currID = id
    // if (this.state.reply) {
    //   currID = ''
    // }
    if (!this.state.reply) {
      this.setState({
        reply: !this.state.reply,
        replyID: id
      })
    }
    else if (this.state.reply && this.state.replyID === id) {
      this.setState({
        reply: !this.state.reply,
        replyID: ''
      })
    }
    else if (this.state.reply && this.state.replyID !== '' && this.state.replyID !== id)
      this.setState({
        replyID: id
      })
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);

    let { comments } = this.props.comment;
    const commentsLen = comments.length;

    comments = comments.filter((comment) => !comment.comment)
    
    return (
      <Fragment>
        <Container className='px-1 px-sm-4 px-md-5 px-lg-5  pt-4 pb-5'>
          <Container className='px-1 px-sm-4 px-md-5 px-lg-5'>
            <Col>
              <Row>
                <div className="input-group mt-3">
                  <small style={postFooterStyle} className="text-muted pl-3 mb-2">
                    {/* <Link to={'/post/' + post._id} className='text-dark post-link pl-2' onClick={this.handleClickPost.bind(this, post._id)}> */}
                    <span style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", fontSize: '17px' }}>{commentsLen} COMMENTS</span>
                    {/* </Link> */}
                    <span style={postLovedStyle}>
                      {/* 1 */}
                      {/* <buttn className='post-loved-btn' 
                        onClick={this.onLovedClick.bind(this, post._id)}
                        > */}
                      {/* </buttn> */}

                      <p style={{ fontSize: '14px' }}>
                        Sort by:&nbsp;
                      <ButtonDropdown isOpen={this.state.sortCommentDropdownOpen} toggle={this.dropdownOpenToggle}>
                          <DropdownToggle caret size="sm" color="light">
                            {this.state.sortComment}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem name='sortComment' onClick={this.selectSortComment}>Newest</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem name='sortComment' onClick={this.selectSortComment}>Oldest</DropdownItem>
                          </DropdownMenu>
                        </ButtonDropdown>
                      </p>
                      {/* <button className='reply-btn' onClick={() => {this.setState({reply: !this.state.reply})}}>Reply</button> */}
                    </span>
                  </small>
                </div>
              </Row>
              <hr />
            </Col>


            <AddComment postID={this.props.postID} />

            <Card className="mt-4" style={{ border: 'none' }}>
              {/* <CardTitle tag="h5" className='pr-4 pb-3'>תגובות הגולשים</CardTitle> */}


              {comments && comments.map(({ _id, body, user: user1, comment, comments, published_date, loved }) => (
                <Card key={_id} className="mb-5 mr-4" style={{ borderRight: 'none', borderTop: 'none' }}>
                  <CardBody>
                    <ShareModal />
                    {/* <button className='share-btn' style={shareStyle}>
                      <svg xmlns="http://www.w3.org/2000/svg" role="img" width="22" height="22" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12.444 13.5c-.82-.03-1.464-.716-1.444-1.537.02-.82.697-1.473 1.518-1.463.821.01 1.482.679 1.482 1.5-.016.844-.712 1.515-1.556 1.5zm0-6.5c-.82-.03-1.464-.716-1.444-1.537.02-.82.697-1.473 1.518-1.463C13.34 4.01 14 4.68 14 5.5c-.016.844-.712 1.515-1.556 1.5zm.112 10c.82.03 1.464.716 1.444 1.537-.02.82-.697 1.473-1.519 1.463-.82-.01-1.48-.679-1.481-1.5.017-.843.713-1.514 1.556-1.5z">
                        </path>
                      </svg>
                    </button> */}
                    {/* {
                      comment ? null : <Fragment> */}
                    <Row>
                      <div style={postUserDetails} className="input-group ">
                        <CardImg bottom style={profileImgStyle} className='forum-pet-image ml-1 mb-2' src={user1.profileImage} />
                        <p>
                          <span style={{ display: 'block' }}>{user1.name}&nbsp;
                      {user1.admin && <small className='text-muted'><CardImg bottom style={crownProfileImgStyle} src='/images/posts/crown.png' /></small>}

                          </span>

                          <small className="text-muted">
                            {moment(published_date).format('lll')}
                          </small>
                          {/* <br /> */}
                        </p>
                      </div>
                    </Row>

                    <CardText className='mb-2 text-muted pb-3 pr-4 ml-3'> {body}</CardText>
                    {
                      loved ?
                        <span style={postLovedStyle}>
                          <CardImg bottom style={likeprofileImgStyle} className='ml-1 mb-2' src='/images/posts/like-image.png' />
                          <span style={{ fontSize: '14px' }} >{loved}</span>
                        &nbsp;<span style={{ fontSize: '14px' }} className='mr-1'>Like</span>
                        </span>
                        : null
                    }


                    <span style={commentLovedStyle}>
                      <buttn className='post-loved-btn' onClick={this.onLovedClick.bind(this, _id)}>
                        {
                          localStorage.getItem('lovedCommentList') && localStorage.getItem('lovedCommentList').includes(String(_id)) ?
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                                <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1z" />
                              </svg>
                                  &nbsp;<span className='reply-btn'>Liked</span>
                            </span>
                            :
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-suit-heart" viewBox="0 0 16 16">
                                <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595L8 6.236zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.55 7.55 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z" />
                              </svg>
                                &nbsp;<span className='reply-btn'>Like</span>
                            </span>
                        }
                      </buttn>
                    </span>
                    <button className='reply-btn' onClick={this.onReplyClick.bind(this, _id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill-rule="evenodd"><path d="M19 15a4 4 0 0 0-4 4v1h-1v-1a5 5 0 0 1 5-5l2.293-.003-2.145-2.144a.5.5 0 1 1 .707-.707l3.352 3.351-3.352 3.354a.5.5 0 1 1-.707-.707l2.145-2.147L19 15z"></path><path fill-rule="nonzero" d="M9 18.62l2.744-1.64a.5.5 0 0 1 .512.86l-3.5 2.09A.5.5 0 0 1 8 19.5V17H6.237C4.9 17 4 16.225 4 14.934V7.247C4 5.912 4.785 5 6.077 5h11.82C19.2 5 20 5.861 20 7.18V8.5a.5.5 0 1 1-1 0V7.18C19 6.399 18.63 6 17.898 6H6.078C5.372 6 5 6.434 5 7.247v7.687C5 15.637 5.422 16 6.237 16H8.5a.51.51 0 0 1 .01 0H9v2.62z"></path></g></svg>
                        &nbsp;Reply
                        </button>
                    <Collapse isOpened={this.state.reply && this.state.replyID === _id}>
                      <AddComment postID={this.props.postID} commentID={_id} />
                    </Collapse>

                    {isAuthenticated && (is_admin || this.props.auth.user._id === user1._id) ?
                      <div>
                        <Button
                          style={btnRemoveStyle}
                          className='remove-btn-admin'
                          color='danger'
                          size='sm'
                          onClick={this.onDeleteCommentClick.bind(this, _id)}
                        >&#10007;</Button>
                      </div>
                      : null}

                    {/* </Fragment>
                    } */}
                    {comments && comments.map(({ _id, body, user: user2, comment, comments, published_date }) => (
                      <Card key={_id} className="mb-3 mr-4 mt-2 ml-3" style={{ borderRight: 'none', borderTop: 'none' }}>
                        <CardBody>
                          <ShareModal />
                          <Row>
                            <div style={postUserDetails} className="input-group ">
                              <CardImg bottom style={profileImgStyle} className='forum-pet-image ml-1 mb-2' src={user2.profileImage} />
                              <p>

                                <span style={{ display: 'block' }}>{user2.name}&nbsp;
                    {user2.admin && <small className='text-muted'><CardImg bottom style={crownProfileImgStyle} src='/images/posts/crown.png' /></small>}


                                </span>
                                <small className="text-muted">
                                  {moment(published_date).format('lll')}
                                </small>
                                {/* <br /> */}
                              </p>
                            </div>
                          </Row>
                          {
                            comment &&
                            <small className='text-muted'>
                              Replying to {user1.name}
                            </small>
                          }
                          <CardText className='mb-2 text-muted pb-3 pr-4 mt-2'> {body}</CardText>
                          {isAuthenticated && (is_admin || this.props.auth.user._id === user2._id) ?
                            <div>
                              <Button
                                style={btnRemoveStyle}
                                className='remove-btn-admin'
                                color='danger'
                                size='sm'
                                onClick={this.onDeleteCommentClick.bind(this, _id)}
                              >&#10007;</Button>
                            </div>
                            : null}
                        </CardBody>
                      </Card>
                    ))}
                  </CardBody>
                </Card>
              ))}
            </Card>
          </Container>
        </Container>
      </Fragment>
    );
  }
}
const shareStyle = {
  position: 'absolute',
  right: '0',
}
const postLovedStyle = {
  position: 'absolute',
  right: '0',
  fontSize: 'medium',
  color: '#666666'
}

const commentLovedStyle = {
  // position: 'absolute',
  // right: '0'
}

const crownProfileImgStyle = {
  width: '15px',
  // height: '6px',
  marginTop: '0px'
}

const postFooterStyle = {
  fontSize: '8px',
  display: 'block',
  marginTop: '-6px'
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

const profileImgStyle = {
  borderRadius: '50%',
  width: '25px',
  height: '25px',
  marginRight: '5px',
  // marginTop: '9px',
}

const likeprofileImgStyle = {
  borderRadius: '50%',
  width: '15px',
  height: '15px',
  marginRight: '4px',
  marginTop: '5px',
  // marginTop: '9px',
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

const mapStateToProps = state => ({
  comment: state.comment,
  post: state.post,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment, lovedComment, unlovedComment }
)(ShowComments);
