import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { editChapter } from '../../actions/chapterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class EditChapterModal extends Component {
    state = {
        path: '/uploads/chapters/',
        modal: false,

        name: '',
        chapterImage: '',

        prevChapterIImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        editChapter: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { chapters } = this.props.chapter;
        const chapter = chapters.filter(chapter => chapter._id == this.props.chapterID)[0];
        this.setState({
            name: chapter.name,
            chapterImage: chapter.chapterImage,
            prevChapterImage: chapter.chapterImage
        });

        // if (this.state.prevChapterImage != '')
        //     this.setState({ prevChapterImage: chapter.chapterImage });
    }

    componentDidUpdate(prevProps) {
        const { error, msg, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for edit error
            if (error.id === 'EDIT_CHAPTER_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        //If edited, close modal
        if (this.state.modal) {
            if (!this.state.removedOrginalImageAndNotSave && msg && msg.id === 'EDIT_CHAPTER_SUCCESS') {
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
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();

        var { name, chapterImage } = this.state;

        const newChapter = {
            name,
            chapterImage
        }

        // Edit chapter via editChapter action
        this.props.editChapter(this.props.chapterID, newChapter);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.chapterImage != this.state.prevChapterImage && this.state.prevChapterImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevChapterImage);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: false
        });

        // Close modal
        // this.toggle();
    }

    removedOrginalImageAndNotSave = () => {
        var { name, chapterImage } = this.state;

        const newChapter = {
            name,
            chapterImage
        }


        // Attempt to edit
        this.props.editChapter(this.props.chapterID, newChapter);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.chapterImage != this.state.prevChapterImage && this.state.prevChapterImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevChapterImage);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: true
        });
    }


    setRegisterModalStates = (val) => {
        if (val != '')
            this.setState({
                chapterImage: val
            });
    }

    close = () => {
        const { chapters } = this.props.chapter;
        const chapter = chapters.filter(chapter => chapter._id == this.props.chapterID)[0];

        const filepath = this.state.chapterImage
        const noImageFullpath = this.state.path + 'no-image.png';
        if (!this.state.imageSubmited && this.state.chapterImage != this.state.prevChapterImage && filepath != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath);
            formData.append('abspath', this.state.path);
            axios.post('/remove', formData);

            this.setState({
                name: chapter.name,
                chapterImage: chapter.chapterImage,
                prevChapterImage: chapter.chapterImage
            });
        }
        else {
            this.setState({
                imageSubmited: false,
                prevChapterImage: chapter.chapterImage
            });
        }
        if (this.state.removedOrginalImageAndNotSave) {
            this.removedOrginalImageAndNotSave();
        }
    }

    // onEditClick = (id) => {
    //     this.props.editChapter(id);
    // }

    removedOrginalChapterImage = () => {
        this.setState({
            removedOrginalImageAndNotSave: true
        });
    }

    render() {
        const { chapters } = this.props.chapter;

        //payload name for chapter image
        var payload = '';

        var chapter = chapters.filter(chapter => chapter._id == this.props.chapterID)[0];

        return (
            <Fragment>
                {this.props.isAuthenticated ?
                    <button onClick={this.toggle} className="chapter-edit-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    : null
                }



                < Modal
                    align="right"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                >
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span class="lead">Edit Chapter</span></ModalHeader>
                    {/* <div class="item-image" align="center">
                                <CardImg bottom className='ProductImg' src={this.state.chpaterImage} alt="Card image cap" />
                            </div> */}
                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for='name'>name</Label>
                                <Input
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder='name'
                                    className='mb-2'
                                    onChange={this.onChange}
                                    defaultValue={this.state.name}
                                />

                                <FileUpload
                                    payload={payload}
                                    setRegisterModalStates={this.setRegisterModalStates}
                                    path={this.state.path}
                                    currImage={this.state.chapterImage}
                                    prevImage={this.state.prevChapterImage}
                                    imageSaved={this.state.imageSubmited}
                                    removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                                    removedOrginalItemImage={this.removedOrginalChapterImage}
                                />


                                <Button
                                    color='dark'
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Save</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal >
            </Fragment >
        );
    }
}

const mapStateToProps = state => ({
    chapter: state.chapter,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { editChapter, clearErrors, clearMsgs }
)(EditChapterModal);
