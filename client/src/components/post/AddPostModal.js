import React, { Component, Fragment } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CardFooter, CardImg, Alert,
  Collapse, Col, ListGroup, ListGroupItem
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import SunEditor, { buttonList } from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';

import { addPost } from '../../actions/postActions';
import { getMangas } from '../../actions/mangaActions';
import { getChapters } from '../../actions/chapterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

import FileUpload from '../fileupload/FileUpload';

class AddPostModal extends Component {
  state = {
    path: '/uploads/posts/',
    modal: false,

    title: '',
    body: '',
    postImage: '',
    is_manga: false,
    mangasSelected: [],
    Collapsetoggle: [],
    fadeIn: false,
    dropDownMangaOpen: false
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    msg: PropTypes.object.isRequired,
    manga: PropTypes.object.isRequired,
    addPost: PropTypes.func.isRequired,
    getChapters: PropTypes.func.isRequired,
    getMangas: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  }
  componentDidMount() {
    this.props.getChapters();
    this.props.getMangas();
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

    //If added post, close modal
    if (this.state.modal) {
      if (msg.id === 'ADD_POST_SUCCESS') {
        this.toggle();
        this.setState({
          title: '',
          body: '',
          postImage: '',
          is_manga: false,
          dropDownMangaOpen: false,
          mangasSelected: []
        })
      }
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

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

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }
  addMangaToPost = e => {
    // this.setState({ selectedMangas: [...this.state.selectedMangas, e.target.defaultValue ]});
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

  onSubmit = e => {
    e.preventDefault();

    const { title, body, postImage, is_manga } = this.state;
    let { mangasSelected } = this.state;
    if (!is_manga)
      mangasSelected = [];

    const newPost = {
      title,
      body,
      postImage,
      is_manga,
      mangasSelected
    }

    this.props.addPost(newPost);
  }

  CollapseHangdle = (name) => {
    if (this.state.Collapsetoggle.includes(name)) {
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

  setRegisterModalStates = (val) => {
    if (val !== '')
      this.setState({ postImage: val });
  }

  DropDowntoggleManga = () => {
    this.setState({
      dropDownMangaOpen: !this.state.dropDownMangaOpen
    });
  }

  close = () => {
    const noImageFullpath = this.state.path + 'no-image.png';
    const filepath = this.state.postImage
    if (filepath !== '' && filepath !== noImageFullpath) {
      const formData = new FormData();
      formData.append('filepath', filepath);
      formData.append('abspath', this.state.path);

      axios.post('/remove', formData);
      this.setState({ postImage: '' });
    }
    this.setState({
      is_manga: false,
      dropDownMangaOpen: false
    })
  }
  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const is_admin = (isAuthenticated && user.admin);

    // const { mangas } = this.props.manga;
    const { chapters } = this.props.chapter;

    const noImageFullpath = this.state.path + 'no-image.png';

    var dropDownMangaSymbol = this.state.dropDownMangaOpen ? <span>&#45;</span> : <span>&#x2B;</span>

    let dropDownSymbolList = []

    chapters.map(({ name }) => {
      dropDownSymbolList = [...dropDownSymbolList, this.state.Collapsetoggle.includes(name) ?
        { name: <span>&#45;</span> } : { name: <span>&#x2B;</span> }]
    })

    return (
      <div>
        {is_admin ?
          <nav className="mt-2 pl-4">
            {/* <div className="input-group col-12 col-sm-8 col-md-6 col-lg-5 pb-3"> */}
            {/* <CardImg bottom className='forum-pet-image ml-1 mt-1' src={user.petImage} /> */}
            <input
              style={inputStyle}
              bsSize="sm"
              onClick={this.toggle}
              type="text"
              name='name'
              className="input-place-holder form-control input-sm pt-3 pl-2"
              placeholder={'Add post...'}
            />
            {/* </div> */}
          </nav>

          : null}


        <Modal
          className="login-modal"
          align="left"
          isOpen={this.state.modal}
          toggle={this.toggle}
          onClosed={this.close}
        >
          <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span className="lead">Create Post</span></ModalHeader>
          <ModalBody>
            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                {/* <Label for='title'>Title</Label> */}
                {/* <small style={{ color: '#76735c' }}><Label for='title'>Title</Label></small> */}
                <input className='input-place-holder form-control pt-3 pl-3 mb-3' style={inputTitleStyle} onChange={this.onChange} type="text" name='title' placeholder="Enter Title.." />

                {/* <Input
                  type='text'
                  name='title'
                  id='title'
                  bsSize="sm"
                  className='mb-3 mb-2'
                  onChange={this.onChange}
                  style={inputFormStyle}
                /> */}
                <div>
                  <small className='mr-2' style={{ color: '#76735c' }}><Label for='manga'>Manga</Label></small>
                  <label className="switch">
                    <input id='manga' name='manga' type="checkbox" onChange={this.mangaToggle} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <Collapse isOpen={this.state.is_manga}>
                  <div>
                    <Button className="collapsible" onClick={this.DropDowntoggleManga} style={{ marginBottom: '1rem', opacity: '0.7' }}>Mangas <strong style={{ marginLeft: '44px' }}>{dropDownMangaSymbol}</strong></Button>
                    <Collapse isOpen={this.state.dropDownMangaOpen}>



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
                              >{name}<strong class='pr-3' style={{ position: 'absolute', right: '0' }}>{dropDownSymbolList[index].name}</strong></Button>
                            </span>

                            <Collapse isOpen={this.state.Collapsetoggle.includes(name)}>

                              <ListGroup className="manga-list">
                                {mangas &&
                                  mangas.sort((a, b) => Number(a.page.substring(4)) - Number(b.page.substring(4))).map(({ _id, page }) => (
                                    <Col key={_id} className='pt-0'>
                                      <label class="checkbox_item">
                                        <input class="ml-2" onChange={this.addMangaToPost} type="checkbox" name="mangasSelected" data-tax="name" defaultValue={page} />
                                        <small>{page}</small>
                                      </label>
                                    </Col>
                                  ))}
                              </ListGroup>
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
                  setOptions={{
                    height: 150,
                    buttonList: buttonList.complex,
                    backgroundColor: 'red'
                  }} />

                <FileUpload
                  setRegisterModalStates={this.setRegisterModalStates}
                  path={this.state.path}
                  currImage={noImageFullpath}
                />

                <Button
                  color='dark'
                  style={{ marginTop: '2rem' }}
                  block
                >Create</Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
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

// const addPostInput = {
//   // marginTop:'20px',
//   background: '#f7f7f7',
//   webkitBorderRadius: '20px',
//   mozBorderRadius: '20px',
//   borderRadius: '20px',
// };

const inputStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.411)',
  borderRadius: '1px',
  marginTop: '-9px',
  width: '70px'
};
const inputTitleStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.411)',
  borderRadius: '1px',
  marginTop: '-9px',
  width: '350px',
  margin: '0 auto'
};
const inputFormStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  border: 'none',
  borderBottom: '1px solid #76735c',
  borderRadius: '1px',
  marginTop: '-9px'
};
const mapStateToProps = state => ({
  post: state.item,
  chapter: state.chapter,
  auth: state.auth,
  error: state.error,
  msg: state.msg,
  manga: state.manga
});

export default connect(
  mapStateToProps,
  { addPost, getChapters, clearErrors, clearMsgs, getMangas }
)(AddPostModal);
