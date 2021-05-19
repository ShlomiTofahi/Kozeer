

import React, { Component, Fragment } from 'react';
import {
  CardText, Card, CardTitle, CardHeader, Row, CardBody, CardImg, Button, Container, Col
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { deleteComment } from '../../actions/commentActions';

import AddComment from './AddComment';

class ShowComments extends Component {

  static propTypes = {
    deleteComment: PropTypes.func.isRequired,
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

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);

    const { comments } = this.props.comment;
    return (
      <Fragment>
        <Container className='px-1 px-sm-4 px-md-5 px-lg-5  pt-4 pb-5'>
          <Container className='px-1 px-sm-4 px-md-5 px-lg-5'>


            <Col>
              <Row>
                <div className="input-group mt-3">
                  <p>
                    <small style={postFooterStyle} className="text-muted pl-3 mb-2">
                             {/* <Link to={'/post/' + post._id} className='text-dark post-link pl-2' onClick={this.handleClickPost.bind(this, post._id)}> */}
                        <span style={{fontFamily: "'Shadows Into Light', Kimberly Geswein", fontSize:'17px'}}>{comments.length} COMMENTS</span>
                             {/* </Link> */}
                      <span style={postLovedStyle}>
                        {/* 1 */}
                        {/* <buttn className='post-loved-btn' 
                        onClick={this.onLovedClick.bind(this, post._id)}
                        > */}
                      sort by:
                        {/* </buttn> */}
                      </span>
                    </small>
                  </p>
                </div>
              </Row>
              <hr />
            </Col>


            <AddComment postID={this.props.postID} />

            <Card color='light' align='right' className="item-details-body mt-4">
              <CardTitle tag="h5" className='pr-4 pb-3'>תגובות הגולשים</CardTitle>

              {comments && comments.map(({ _id, body, user: user1, comment, comments, published_date }) => (
                <Card key={_id} className="forum-comment mb-5 mr-4">
                  <CardBody>
                    {
                      comment ? null : <Fragment>

                        <Row>
                          <div style={postUserDetails} className="input-group ">
                            <CardImg bottom style={profileImgStyle} className='forum-pet-image ml-1 mb-2' src={user1.profileImage} />
                            <p>
                              <span style={{ display: 'block' }}>{user1.name}&nbsp;
                      {user1.admin && <small className='text-muted'>מנהל</small>}

                              </span>

                              <small className="text-muted">
                                פורסם ב:
                        {moment(published_date).format(' DD/MM/YYYY')}&nbsp;
                        בשעה:
                        {moment(published_date).format(' hh:mm')}
                              </small>
                              <br />
                            </p>
                          </div>
                        </Row>

                        <CardText className={["mb-2 text-muted", "pb-3", "pr-4"]}> {body}</CardText>
                        <AddComment postID={this.props.postID} commentID={_id} />

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

                      </Fragment>
                    }
                    {comments && comments.map(({ _id, body, user: user2, comment, comments, published_date }) => (
                      <Card key={_id} className="forum-comment mb-5 mr-4">
                        <CardBody>
                          <Row>
                            {
                              comment &&
                              <div>
                                Replying to {user1.name}
                                {/* {console.log(user2)} */}
                              </div>
                            }
                            <div style={postUserDetails} className="input-group ">
                              <CardImg bottom style={profileImgStyle} className='forum-pet-image ml-1 mb-2' src={user2.profileImage} />
                              <p>

                                <span style={{ display: 'block' }}>{user2.name}&nbsp;
                    {user2.admin && <small className='text-muted'>מנהל</small>}

                                </span>

                                <small className="text-muted">
                                  פורסם ב:
                      {moment(published_date).format(' DD/MM/YYYY')}&nbsp;
                      בשעה:
                      {moment(published_date).format(' hh:mm')}
                                </small>
                                <br />
                              </p>
                            </div>
                          </Row>

                          <CardText className={["mb-2 text-muted", "pb-3", "pr-4"]}> {body}</CardText>
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
const postLovedStyle = {
  position: 'absolute',
  right: '0'
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
  { deleteComment }
)(ShowComments);
