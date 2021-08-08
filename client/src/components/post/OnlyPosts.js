import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';

import { getPosts, getFilterPosts } from '../../actions/postActions';

import ShowPosts from './ShowPosts';
import AddPostModal from './AddPostModal';

import InstagramFeed from 'react-ig-feed'
import 'react-ig-feed/dist/index.css'

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
  }
  onSearchClick = (id) => {
    this.setState({
      searchCicked: !this.state.searchCicked
    })
  }

  onChange = e => {
    e.preventDefault();
    let title = e.target.value

    // Create Filted Item object
    const FiltedPosts = {
      title,
    };

    // Attempt to filter
    this.props.getFilterPosts(FiltedPosts);
  }

  render() {
    let { posts, loading } = this.props.post;
    posts = posts.filter(post => !post.is_manga);
    const searchToggle = this.state.searchCicked ?
      <div style={searchLimitStyle} className="input-group">
        <span >
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" className="bi bi-search ml-3" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </span>
        <div style={inputSearchStyle}>
          <input className='input-place-holder form-control pt-3 pl-2' style={inputStyle} onChange={this.onChange} type="text" name='name' placeholder="Search" />
        </div>
        <button className='post-search-btn' onClick={this.onSearchClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>

      :
      <button className='post-search-btn' onClick={this.onSearchClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
      </button>


    return (
      <Fragment>
        <div style={postFrameStyle}>
          <div style={postHeaderStyle}>

            <div className='row  justify-content-between'>
              <div>
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
        <div className='mt-3 mx-3'>
          <InstagramFeed
            token={process.env.REACT_APP_TOKEN}
            counter="6"
          />
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
  width: window.innerWidth >= 992 ? '65%' : "90%"
};
const postHeaderStyle = {
  backgroundColor: '#7301056e',
}
const postSearchStyle = {
  textAlign: 'right',
  margin: '15px',
  paddingRight: '10px'
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

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(
  mapStateToProps,
  { getPosts, getFilterPosts }
)(AllPosts);