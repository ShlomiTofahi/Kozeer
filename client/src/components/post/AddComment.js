import React, { Component } from 'react';
import {
  Button, Form, FormGroup, Label, Input, CardImg, CardFooter
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addComment, replyComment } from '../../actions/commentActions';

class AddComment extends Component {
  state = {
    body: ''
  };

  static propTypes = {
    auth: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    addComment: PropTypes.func.isRequired,
    replyComment: PropTypes.func.isRequired
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
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

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            {/* {isAuthenticated ? */}
            <nav align="right" className="mt-3">
              <div style={addPostBorder} className="input-group col-12 col-sm-8 col-md-6 col-lg-5 pr-1 pb-3">
                {/* <CardImg bottom className='forum-pet-image ml-1' src={user.petImage} /> */}
                <Label for='body'></Label>
                <Input
                  style={addPostInput}
                  value={this.state.body}
                  type='text'
                  name='body'
                  id='body'
                  // placeholder={'היי ' + user.name + ', כתוב תגובה...'}
                  className='mb-2'
                  onChange={this.onChange}
                />
                <div style={commentButton}>
                  <Button
                    style={{ height: '38px' }}
                    size='sm'
                    className='badge-pill badge-secondary'
                    color='dark'
                    block
                  >	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;תגובה</Button>
                </div>
              </div>
            </nav>
            {/* : <CardFooter className='lead mt-3' style={{ fontSize: '15px' }} align='right'>
                <smalll> היי אורח, התחבר כדי להגיב לפוסט זה </smalll>
              </CardFooter>
              } */}
          </FormGroup>
        </Form>
      </div>
    );
  }
}

const addPostBorder = {
  background: "white",
  color: "#fff",
  height: "100px",
  width: "900px",
  border: '1px solid rgb(230, 230, 230)',

  // margin: "auto 0",
  // padding: "0px 2.5px",
  paddingTop: "20px",
  // borderRadius: "50%",
  // cursor: "pointer",
  // float: "right",
  webkitBoxShadow: '0 0 1px 0.1px #C7C7C7',
  boxSshadow: '0 0 1px 0.1px #C7C7C7',
  webkitBorderRadius: '15px',
  mozBorderRadius: '15px',
  borderRadius: '15px',
};

const addPostInput = {
  background: '#f7f7f7',
  webkitBorderRadius: '20px',
  mozBorderRadius: '20px',
  borderRadius: '20px',
  zIndex: '1'
};

const commentButton = {
  position: 'relative',
  left: '34px',
  width: '80px',
};


const mapStateToProps = state => ({
  auth: state.auth,
  comment: state.item,
  msg: state.msg
});

export default connect(
  mapStateToProps,
  { addComment, replyComment }
)(AddComment);
