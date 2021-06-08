import React, { Component } from 'react';
import {
  Button, Form, FormGroup, Label, Input, CardImg, CardFooter, Container, Modal, ModalHeader, ModalBody, Row
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

import { addComment, replyComment, addCommentAsGuest, replyCommentAsGuest } from '../../actions/commentActions';
import LoginModal from '../auth/LoginModal';

class AddComment extends Component {
  state = {
    body: '',
    // asGuest: true,
    commentRow: 1,
    commentInputOpen: false,
    modal: false,
    // publishfadeIn: true,
    guestfadeIn: false,
    loginfadeIn: false,
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    addComment: PropTypes.func.isRequired,
    replyComment: PropTypes.func.isRequired,
    addCommentAsGuest: PropTypes.func.isRequired,
    replyCommentAsGuest: PropTypes.func.isRequired,
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  checkConnected = () => {
    const { isAuthenticated, user } = this.props.auth;
    if (isAuthenticated) {
      this.onSubmit();
    }
    else {
      const user = {
        email: 'none@none.com',
        password: '123456'
      }

      const { body } = this.state;
      const newComment = {
        body
      }
      if (this.props.commentID)
        this.props.replyCommentAsGuest(this.props.postID, this.props.commentID, body);
      else
        this.props.addCommentAsGuest(this.props.postID, newComment);
      // if (this.props.commentID)
      //   this.props.replyComment(this.props.postID, this.props.commentID, body);
      // else
      //   this.props.addComment(this.props.postID, newComment);

      // this.done();

      this.setState({
        body: ''
      });

    }
    this.toggle();
  }
  onSubmit = e => {
    e.preventDefault();
    const { body } = this.state;
    const newComment = {
      body
    }
    if (this.props.commentID)
      this.props.replyComment(this.props.postID, this.props.commentID, body);
    else
      this.props.addComment(this.props.postID, newComment);

    this.setState({
      body: ''
    });
  }

  onCommentClick = () => {
    this.setState({
      commentRow: 6
    });
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  commentButtonStyle = () => {
    return {
      // position: 'relative',
      // left: '34px',
      // width: '80px',
      position: this.state.commentInputOpen ? 'absolute' : null,
      display: 'inline',
      bottom: '10px',
      right: '10px'
    };
  };

  close = () => {
    this.setState((state) => ({
      // publishfadeIn: true,
      guestfadeIn: false,
      logInfadeIn: false
    }))
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div className='pt-2'>
        <Form>
          <FormGroup>
            <nav align="right" className="mt-3">
              <div
                // style={addPostBorder}
                className="input-group col-12 col-sm-12 col-md-12 col-lg-12 pr-1 pb-3">
                <CardImg bottom style={profileImgStyle} className='mt-1' src={'/uploads/users/no-image.png'} />
                <Label for='body'></Label>
                {/* <Input
                  style={addPostInput}
                  value={this.state.body}
                  type='text'
                  name='body'
                  id='body'
                  block
                  placeholder={'Write a comment...'}
                  className='mb-2'
                  onChange={this.onChange}
                /> */}
                <div style={textBoxStyle}
                  onFocus={(e) => { this.setState({ commentRow: 5, commentInputOpen: true }); }}
                  onBlur={(e) => { this.setState({ commentRow: 1, commentInputOpen: false }); }}
                >
                  <textarea
                    style={addPostInput}
                    value={this.state.body}
                    type='text'
                    name='body'
                    id='body'
                    block
                    placeholder={'Write a comment...'}
                    className='mb-2'
                    onChange={this.onChange}

                    rows={this.state.commentRow}
                  />
                  <Collapse isOpened={this.state.commentInputOpen}>
                    <div style={this.commentButtonStyle()} className='mb-1'>
                      <Button
                        size='sm'
                        className='mr-2'
                        color='dark'
                        outline
                        onClick={(e) => { this.setState({ commentRow: 1, commentInputOpen: false }); }}
                      >Cancel</Button>
                      <Button
                        size='sm'
                        color='dark'
                        outline
                        onClick={isAuthenticated || (user && user.email === 'none@none.com') ? this.onSubmit : this.toggle}
                      >Publish</Button>
                    </div>
                  </Collapse>
                </div>
              </div>
            </nav>
          </FormGroup>
        </Form>

        <Modal
          align='center'
          isOpen={this.state.modal}
          toggle={this.toggle}
          onClosed={this.close}
          className="login-modal"
        >
          {/* <Collapse isOpened={this.state.publishfadeIn}> */}
            <ModalHeader className='mt-3' cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle}></ModalHeader>
            <ModalBody>
              <Container>
                <Row>
                  <LoginModal linkcolor='green' />
            &nbsp;or publish as a&nbsp;<Button onClick={this.checkConnected} className='login-btn' >Guest</Button>
                </Row>
              </Container>
            </ModalBody>
          {/* </Collapse> */}

          {/* <Collapse isOpened={this.state.loginfadeIn}>
            <div style={{ maxWidth: '250px' }}> */}
          {/* </div>
          </Collapse>*/}
        </Modal>
      </div>
    );
  }
}

const textBoxStyle = {
  display: 'inline-block',
  position: 'relative',
  width: "80%",

};
const addPostInput = {
  display: 'block',
  background: 'white',
  // webkitBorderRadius: '20px',
  // mozBorderRadius: '20px',
  // borderRadius: '20px',
  border: '3px solid gray',
  width: "100%",
  // zIndex: '1'
};


const addPostBorder = {
  background: "white",
  color: "#fff",
  height: "100px",
  width: "900px",
  border: '1px solid rgb(230, 230, 230)',
  paddingTop: "20px",
  webkitBoxShadow: '0 0 1px 0.1px #C7C7C7',
  boxSshadow: '0 0 1px 0.1px #C7C7C7',
  webkitBorderRadius: '15px',
  mozBorderRadius: '15px',
  borderRadius: '15px',
};


const profileImgStyle = {
  borderRadius: '50%',
  width: '25px',
  height: '25px',
  marginRight: '5px',
  backgroundColor: 'rgb(240, 240, 240)'
  // marginTop: '9px',
}

const mapStateToProps = state => ({
  auth: state.auth,
  comment: state.item,
  msg: state.msg
});

export default connect(
  mapStateToProps,
  { addComment, replyComment, addCommentAsGuest, replyCommentAsGuest }
)(AddComment);
