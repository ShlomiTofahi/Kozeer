import React, { Component, Fragment } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, Form, FormGroup,
  Label, Alert, Col, ListGroup,
} from 'reactstrap';
import { Collapse } from 'react-collapse';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import SunEditor, { buttonList } from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';

import { editPost } from '../../actions/postActions';
import { getMangas } from '../../actions/mangaActions';
import { getChapters } from '../../actions/chapterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

import FileUpload from '../fileupload/FileUpload';

class EditPostModal extends Component {
  state = {
    path: '/uploads/posts/',

    title: '',
    body: '',
    postImage: '',
    is_manga: false,
    mangasSelected: [],
    chaptersSelected: [],
    modal: false,
    fadeIn: false,
    Collapsetoggle: [],
    dropDownMangaOpen: false,

    imageSubmited: false,
    removedOrginalImageAndNotSave: false,
    prevPostImage: '',
    prevMangas: [],
    submited: false
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    manga: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    post: PropTypes.object.isRequired,
    chapter: PropTypes.object.isRequired,
    editPost: PropTypes.func.isRequired,
    getChapters: PropTypes.func.isRequired,
    getMangas: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearMsgs: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { posts } = this.props.post;
    const post = posts.filter(post => post._id === this.props.postID)[0];
    let mangasSelected = [];
    let chaptersSelected = [];
    if (post?.is_manga) {
      this.setState({
        dropDownMangaOpen: true
      });
      post.mangas.map(({ page, chapter }) => {
        if (chaptersSelected.indexOf(chapter.name) === -1) chaptersSelected.push(chapter.name);
        mangasSelected.push(page);
        return mangasSelected;
      })
    }
    chaptersSelected.map((chapter) => this.CollapseHangdle(chapter))
    if (post !== undefined) {
      this.setState({
        title: post.title,
        body: post.body,
        is_manga: post.is_manga,
        postImage: post.postImage,
        prevPostImage: post.postImage,
        mangasSelected,
        chaptersSelected,
        prevMangas: mangasSelected,
        submited: false
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { error, msg } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'ADD_POST_FAIL') {
        this.setState({ msg: error.msg });
      } else {
        this.setState({ msg: null });
      }
    }
    //If edited, close modal
    if (this.state.modal) {
      if (!this.state.removedOrginalImageAndNotSave && msg && msg.id === 'EDIT_POST_SUCCESS') {
        this.setState({ submited: true })
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    // Clear msgs
    this.props.clearMsgs();

    this.setState({
      modal: !this.state.modal,
      fadeIn: false
    });
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  addMangaToPost = e => {
    if (this.state[e.target.name].includes(e.target.defaultValue)) {
      this.setState(prevState => ({
        [e.target.name]: prevState[e.target.name].filter(element => element !== e.target.defaultValue)
      }));
    } else {
      this.setState(prevState => ({
        [e.target.name]: [...prevState[e.target.name], e.target.defaultValue]
      }));
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }


  onSubmit = e => {
    e.preventDefault();

    const { title, body, postImage, is_manga } = this.state;
    let { mangasSelected } = this.state;

    if (!is_manga) {
      mangasSelected = [];
    }

    const newPost = {
      title,
      body,
      postImage,
      is_manga,
      mangasSelected
    }

    this.props.editPost(this.props.postID, newPost, this.state.prevMangas);

    //delete prev image
    const noImageFullpath = this.state.path + 'no-image.png';
    if (this.state.postImage !== this.state.prevPostImage && this.state.prevPostImage !== noImageFullpath) {
      const formData = new FormData();
      formData.append('filepath', this.state.prevPostImage);

      console.log("*remove EditPostModal 1");
      axios.post('/remove', formData);
    }
    this.setState({
      imageSubmited: true,
      removedOrginalImageAndNotSave: false
    });
  }

  removedOrginalImageAndNotSave = () => {
    const { title, body, postImage, is_manga } = this.state;
    let { mangasSelected } = this.state;

    if (!is_manga) {
      mangasSelected = [];
    }

    const newPost = {
      title,
      body,
      postImage,
      is_manga,
      mangasSelected
    }

    // Attempt to edit
    this.props.editPost(this.props.postID, newPost, this.state.prevMangas);

    //delete prev image
    const noImageFullpath = this.state.path + 'no-image.png';
    if (this.state.postImage !== this.state.prevPostImage && this.state.prevPostImage !== noImageFullpath) {
      const formData = new FormData();
      formData.append('filepath', this.state.prevPostImage);

      console.log("*remove EditPostModal 3");
      axios.post('/remove', formData);
    }
    this.setState({
      imageSubmited: true,
      removedOrginalImageAndNotSave: true
    });
  }

  setRegisterModalStates = (val) => {
    if (val !== '')
      this.setState({ postImage: val });
  }

  removedOrginalPostImage = () => {
    this.setState({
      removedOrginalImageAndNotSave: true
    });
  }

  CollapseHangdle = (name) => {
    if (this.state.Collapsetoggle?.includes(name)) {
      this.setState(prevState => ({
        Collapsetoggle: prevState.Collapsetoggle.filter(element => element !== name)
      }));
    } else {
      this.setState(prevState => ({
        Collapsetoggle: [...prevState.Collapsetoggle, name]
      }));
    }
  }

  handleModelChange = model => {
    this.setState({ body: model });
  }

  mangaToggle = () => {
    this.setState({ is_manga: !this.state.is_manga });
  }

  DropDowntoggleManga = () => {
    this.setState({
      dropDownMangaOpen: !this.state.dropDownMangaOpen
    });
  }

  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  close = () => {
    const { posts } = this.props.post;
    const post = posts.filter(post => post._id === this.props.postID)[0];
    let chapterList = [];

    if (!this.state.submited) {
      //return to entry states
      let mangasSelected = [];
      let chaptersSelected = [];
      if (post.is_manga) {
        this.setState({
          dropDownMangaOpen: true
        });
        post.mangas.map(({ page, chapter }) => {
          if (chaptersSelected.indexOf(chapter.name) === -1) chaptersSelected.push(chapter.name);
          mangasSelected.push(page);
          return mangasSelected;
        })
      }
      chapterList = [];
      chaptersSelected.map((chapter) => {
        chapterList = [...chapterList, chapter];
        return chapterList;
      })
      this.setState({
        title: post.title,
        body: post.body,
        is_manga: post.is_manga,
        postImage: post.postImage,
        prevPostImage: post.postImage,
        mangasSelected,
        chaptersSelected
      });
    } else {
      chapterList = [];
      const { chapters } = this.props.chapter;
      chapters.map(({ name, mangas }) =>
        mangas.map(({ page }) => {
          if (this.state.mangasSelected.includes(page))
            chapterList = [...chapterList, name];
          return chapterList;
        })
      )
    }

    this.setState({
      Collapsetoggle: chapterList
    });

    const filepath = this.state.postImage

    if (!this.state.imageSubmited && filepath !== this.state.prevPostImage) {

      const formData = new FormData();
      formData.append('filepath', filepath);

      console.log("*remove EditPostModal 2");
      axios.post('/remove', formData);

    }
    else {
      this.setState({
        imageSubmited: false,
        prevPostImage: post.postImage
      });
    }

    if (this.state.removedOrginalImageAndNotSave) {
      this.removedOrginalImageAndNotSave();
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);

    const { chapters } = this.props.chapter;

    var dropDownMangaSymbol = this.state.dropDownMangaOpen ? <span>&#45;</span> : <span>&#x2B;</span>

    let dropDownSymbolList = []

    chapters.map(({ name }) => {
      dropDownSymbolList = [...dropDownSymbolList, this.state.Collapsetoggle?.includes(name) ?
        { name: <span>&#45;</span> } : { name: <span>&#x2B;</span> }]
      return dropDownSymbolList;
    })

    return (
      <div>
        {is_admin ?
          <button onClick={this.toggle} className="edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
            </svg>
          </button>
          : null
          //   < Button
          //     title="edit"
          // color='warning'
          // size='sm'
          // onClick={this.toggle}
          //   ><i className="fa fa-pencil" style={{ color: 'white' }} ria-hidden="true"></i></Button>
          //   : null
        }
        <Modal
          className="dark-modal"
          align="left"
          isOpen={this.state.modal}
          toggle={this.toggle}
          onClosed={this.close}
        >
          <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span className="lead">Edit Post</span></ModalHeader>
          <ModalBody>
            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <input className='input-place-holder form-control pt-3 pl-3 mb-3'
                  style={inputTitleStyle} onChange={this.onChange}
                  type="text" name='title' placeholder="Enter Title.."
                  defaultValue={this.state.title} />
                <div>
                  <small className='mr-2' style={{ color: '#76735c' }}><Label for='manga'>Manga</Label></small>
                  <label className="switch">
                    <input id='manga' name='manga' type="checkbox" checked={this.state.is_manga} onChange={this.mangaToggle} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <Collapse isOpened={this.state.is_manga}>
                  <div>
                    <Button size="sm" className="collapsible" onClick={this.DropDowntoggleManga} style={{ marginBottom: '1rem', opacity: '0.7' }}>Mangas <strong style={{ marginLeft: '44px' }}>{dropDownMangaSymbol}</strong></Button>
                    <Collapse isOpened={this.state.dropDownMangaOpen}>
                      <div className='chapter-list position-relative py-3 px-4'>
                        {chapters && chapters.map(({ _id, name, mangas }, index) => (
                          <Fragment key={_id}>
                            <span className={'chapter-item'}>
                              <Button
                                block
                                size='sm'
                                color='info'
                                onClick={this.CollapseHangdle.bind(this, name)}
                                style={{ marginBottom: '1rem', opacity: '0.7' }}
                              >{name}<strong className='pr-3' style={{ position: 'absolute', right: '0' }}>{dropDownSymbolList[index].name}</strong></Button>
                            </span>

                            <Collapse isOpened={this.state.Collapsetoggle.includes(name)}>
                              <div className="scrolling-box">
                                <ListGroup className="manga-list">
                                  {mangas &&
                                    mangas.sort((a, b) => Number(a.page.substring(4)) - Number(b.page.substring(4))).map(({ _id: mangaid, page, inuse }) => (
                                      <Col key={mangaid} className='pt-0'>
                                        <label className="checkbox_item">
                                          <small style={{ color: inuse ? "#c0392b" : "#2ecc71" }}>&#9866;</small>
                                          <input className="ml-2" onChange={this.addMangaToPost} type="checkbox" checked={this.state?.mangasSelected?.includes(page)} name="mangasSelected" data-tax="name" defaultValue={page} />
                                          <small>{page}</small>
                                        </label>
                                      </Col>
                                    ))}
                                </ListGroup>
                              </div>
                            </Collapse>
                          </Fragment>
                        ))}
                      </div>
                    </Collapse>
                  </div>
                </Collapse>
                <small style={{ color: '#76735c' }}><Label for='body'>Body</Label></small>
                <SunEditor
                  name='body'
                  onChange={this.handleModelChange}
                  defaultValue={this.state.body}
                  setOptions={{
                    height: 150,
                    buttonList: buttonList.complex,
                    backgroundColor: 'red'
                  }} />

                <FileUpload
                  setRegisterModalStates={this.setRegisterModalStates}
                  path={this.state.path}
                  currImage={this.state.postImage}
                  prevImage={this.state.prevPostImage}
                  imageSaved={this.state.imageSubmited}
                  removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                  removedOrginalItemImage={this.removedOrginalPostImage}
                />

                <Button
                  className='green-style-btn mt-4'
                  size="sm"
                  color='dark'
                  style={{ marginTop: '2rem' }}
                  block
                >Save</Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div >
    );
  }
}

const inputTitleStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.411)',
  borderRadius: '1px',
  marginTop: '-9px',
  width: '350px',
  margin: '0 auto'
};

const mapStateToProps = state => ({
  post: state.post,
  chapter: state.chapter,
  auth: state.auth,
  error: state.error,
  msg: state.msg,
  manga: state.manga
});

export default connect(
  mapStateToProps,
  { editPost, getChapters, clearErrors, clearMsgs, getMangas }
)(EditPostModal);
