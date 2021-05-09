import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Spinner, Container, Row, Col, Input
} from 'reactstrap';

import { getPosts, getFilterPosts } from '../../actions/postActions';

import ShowPosts from './ShowPosts';
import AddPostModal from './AddPostModal';

const SearchInput = React.memo((props) => {

  // const onChange = (e) => {
  //   e.preventDefault();
  //   // this.setState({ [e.target.name]: e.target.value });
  //   let title = e.target.value

  //   // Create Filted Item object
  //   const FiltedPosts = {
  //     title,
  //   };

  //   // Attempt to filter
  //   props.getFilterPosts(FiltedPosts);
  // }

  return (
    <Fragment>
        <div style={inputSearchStyle}>
          <input className='input-place-holder form-control pt-3 pl-2' style={inputStyle} bsSize="sm" onChange={props.onChange} type="text" name='name' placeholder="Search" />
        </div>
    </Fragment>
  );
});
export default SearchInput;


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

