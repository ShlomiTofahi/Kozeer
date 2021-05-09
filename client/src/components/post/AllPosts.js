import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Spinner, Container, Row, Col, Input
} from 'reactstrap';

import { getPosts, getFilterPosts } from '../../actions/postActions';
import { addComment2, addComment } from '../../actions/commentActions';

import ShowPosts from './ShowPosts';
import AddPostModal from './AddPostModal';


class AllPosts extends Component {
  state = {
    searchCicked: true
  };
  static protoType = {
    post: PropTypes.object,
    getPosts: PropTypes.func.isRequired,
    getFilterPosts: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.getPosts();

    console.log('first')
    const postID2 = '609538dc93644d5738d7863e';
    const commentID = '609542b8a1c5ac76f40d2d82';
    const body = 'test 1';
    this.props.addComment2(postID2, commentID, body);

   }
  onSearchClick = (id) => {
    this.setState({
      searchCicked: !this.state.searchCicked
    })
  }

  onChange = e => {
    e.preventDefault();
    // this.setState({ [e.target.name]: e.target.value });
    let title = e.target.value

    // Create Filted Item object
    const FiltedPosts = {
        title,
    };

    // Attempt to filter
    this.props.getFilterPosts(FiltedPosts);
}

  render() {
    const { posts, loading } = this.props.post;

    const searchToggle = this.state.searchCicked ?
      <div style={searchLimitStyle} className="input-group">
        <span >
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" className="bi bi-search ml-3" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </span>
        <div style={inputSearchStyle}>
          <input className='input-place-holder form-control pt-3 pl-2' style={inputStyle} bsSize="sm" onChange={this.onChange} type="text" name='name' placeholder="Search" />
        </div>
        <buttn className='post-search-btn' onClick={this.onSearchClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </buttn>
      </div>

      :
      <buttn className='post-search-btn' onClick={this.onSearchClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </buttn>


    return (
      <Fragment>
        <div style={postFrameStyle}>
          <div style={postHeaderStyle}>

            <div className='row  justify-content-between'>
              <div 
              // className='bg-dark col-4 col-sm-4 col-md-3 col-lg-3'
              >
                <AddPostModal />
              </div>
              <div style={postSearchStyle}>
                {searchToggle}
              </div>
            </div>
          </div>
          {loading ?
            <div style={{ position: 'relative', height: '333px' }}><Spinner style={spinnerStyle} color="secondary" /></div>
            : <ShowPosts elements={posts} />
          }
        </div>
      </Fragment>
    );
  }
}

const spinnerStyle = {
  position: 'absolute',
  left: '45%',
  top: '40%',
  width: '3rem',
  height: '3rem'
};

const postFrameStyle = {
  margin: '0 auto',
  backgroundColor: '#221415f8',
  color: 'white',
  width: '65%',
};

const postHeaderStyle = {
  // height: '100px',
  backgroundColor: '#7301056e',
}

const postSearchStyle = {
  // position: 'absolute',
  textAlign: 'right',
  margin: '15px',
  paddingRight:'10px'
  // right: '0'
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
  marginTop:'-3px'
}
const searchLimitStyle = {
   marginTop: '-2px'
}
const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(
  mapStateToProps,
  { getPosts, getFilterPosts, addComment2, addComment }
)(AllPosts);