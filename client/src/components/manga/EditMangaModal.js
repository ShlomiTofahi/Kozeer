import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { editManga } from '../../actions/mangaActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class EditMangaModal extends Component {
    state = {
        path: '/uploads/mangas/',
        modal: false,

        page: '',
        fullpage: false,
        mangaImage: '',

        prevMangaImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        manga: PropTypes.object.isRequired,
        editManga: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { mangas } = this.props.manga;
        const manga = mangas.filter(manga => 
            manga._id === this.props.mangaID)[0];

        if (manga) {
            this.setState({
                page: manga.page,
                fullpage: manga.fullpage,
                mangaImage: manga.mangaImage,
                prevMangaImage: manga.mangaImage
            });
        }


        if (this.state.prevMangaImage !== '')
            this.setState({ prevMangaImage: manga.mangaImage });
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            // Check for edit error
            if (error.id === 'EDIT_MANGA_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        //If edited, close modal
        if (this.state.modal) {
            if (!this.state.removedOrginalImageAndNotSave && msg && msg.id === 'EDIT_MANGA_SUCCESS') {
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

        var { page, fullpage, mangaImage } = this.state;

        const newManga = {
            page,
            fullpage,
            mangaImage
        }

        // Edit manga via addManga action
        this.props.editManga(this.props.mangaID, newManga);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.mangaImage !== this.state.prevMangaImage && this.state.prevMangaImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevMangaImage);

            console.log("*remove EditMangaModal 1");
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
        var { page, fullgae, mangaImage } = this.state;

        const newManga = {
            page,
            fullgae,
            mangaImage
        }


        // Attempt to edit
        this.props.editManga(this.props.mangaID, newManga);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.mangaImage !== this.state.prevMangaImage && this.state.prevMangaImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevMangaImage);

            console.log("*remove EditMangaModal 2");
            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: true
        });
    }


    setRegisterModalStates = (val) => {
        if (val !== '')
            this.setState({
                mangaImage: val
            });
    }

    close = () => {
        const { mangas } = this.props.manga;
        const manga = mangas.filter(manga => manga._id === this.props.mangaID)[0];

        const filepath = this.state.mangaImage
        const noImageFullpath = this.state.path + 'no-image.png';
        if (!this.state.imageSubmited && this.state.mangaImage !== this.state.prevMangaImage && filepath !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath);

            console.log("*remove EditMangaModal 3");
            axios.post('/remove', formData);

            this.setState({
                page: manga.page,
                fullpage: manga.fullpage,
                mangaImage: manga.mangaImage,
                prevMangaImage: manga.mangaImage
            });
        }
        else {
            this.setState({
                imageSubmited: false,
                prevMangaImage: manga.mangaImage
            });
        }
        if (this.state.removedOrginalImageAndNotSave) {
            this.removedOrginalImageAndNotSave();
        }
    }

    fullpageToggle = () => {
        this.setState({ fullpage: !this.state.fullpage });
    }

    onEditClick = (id) => {
        this.props.editManga(id);
    }

    removedOrginalMangaImage = () => {
        this.setState({
            removedOrginalImageAndNotSave: true
        });
    }

    render() {
        //payload name for manga image
        var payload = '';

        return (
            <Fragment>
                {this.props.isAuthenticated ?
                    <button onClick={this.toggle} className="edit-btn" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    : null
                }

                 < Modal
                    align="right"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                    className="dark-modal"
                >
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span className="lead">Edit Manga</span></ModalHeader>
                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>

                            <input className='input-place-holder form-control pt-3 pl-3 mb-5 mt-3' defaultValue={this.state.page} style={LineInputStyle} onChange={this.onChange} type="text" name='page' id='page' placeholder="Enter page..." />

                                <div className='text-left'>
                                    <small className='mr-2' style={{ color: '#76735c' }}><Label for='fullpage'>fullpage</Label></small>
                                    <label className="switch">
                                        <input id='fullpage' name='fullpage' type="checkbox" onChange={this.fullpageToggle} checked={this.state.fullpage} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <FileUpload
                                    payload={payload}
                                    setRegisterModalStates={this.setRegisterModalStates}
                                    path={this.state.path}
                                    currImage={this.state.mangaImage}
                                    prevImage={this.state.prevMangaImage}
                                    imageSaved={this.state.imageSubmited}
                                    removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                                    removedOrginalItemImage={this.removedOrginalMangaImage}
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
                </Modal >
            </Fragment >
        );
    }
}

const LineInputStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.411)',
    borderRadius: '1px',
    marginTop: '-9px',
    width: '350px',
    margin: '0 auto'
};

const mapStateToProps = state => ({
    manga: state.manga,
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { editManga, clearErrors, clearMsgs }
)(EditMangaModal);
