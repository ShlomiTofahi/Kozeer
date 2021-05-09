import React, { Component, Fragment } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert,
    ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Fade, Collapse,CardImg
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import SunEditor, { buttonList } from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

import { editManga } from '../../actions/mangaActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

import FileUpload from '../fileupload/FileUpload';


class EditMangaModal extends Component {
    state = {
        path: '/uploads/mangas/',

        page: '',
        mangaImage: '',

        modal: false,
        fadeIn: true,
        prevMangaImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        editManga: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { mangas } = this.props.manga;
        const manga = mangas.filter(manga => manga._id == this.props.mangaID)[0];

        this.setState({
            page: manga.page,
            mangaImage: manga.mangaImage,
            prevMangaImage: manga.mangaImage
        });

        if (this.state.prevMangaImage != '')
            this.setState({ prevMangaImage: manga.mangaImage });
    }

    componentDidUpdate(prevProps) {
        const { error, msg, isAuthenticated } = this.props;
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

    // onChangeEditor = (editorState) => this.setState({editorState});

    onSubmit = e => {
        e.preventDefault();

        var { page, mangaImage } = this.state;

        const newManga = {
            page,
            mangaImage
        }


        // Edit manga via addManga action
        this.props.editManga(this.props.mangaID, newManga);



        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.mangaImage != this.state.prevMangaImage && this.state.prevMangaImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevMangaImage);
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
        var { page, mangaImage } = this.state;

        const newManga = {
            page,
            mangaImage
        }


        // Attempt to edit
        this.props.editManga(this.props.mangaID, newManga);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.mangaImage != this.state.prevMangaImage && this.state.prevMangaImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevMangaImage);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: true
        });
    }

    OnCheckedDiscount = () => {
        const { mangas } = this.props.manga;
        const manga = mangas.filter(manga => manga._id == this.props.mangaID)[0];

        if (manga.discount)
            this.setState({
                discount: manga.discount
            });
        else {
            this.setState({
                discount: null
            });
        }

        this.setState({
            checkedDiscount: !this.state.checkedDiscount
            // discount: null
        });
    }


    setRegisterModalStates = (val) => {
        if (val != '')
            this.setState({
                mangaImage: val
            });
    }
    close = () => {
        const { mangas } = this.props.manga;
        const manga = mangas.filter(manga => manga._id == this.props.mangaID)[0];

        const filepath = this.state.mangaImage
        const noImageFullpath = this.state.path + 'no-image.png';
        if (!this.state.imageSubmited && this.state.mangaImage != this.state.prevMangaImage && filepath != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath);
            formData.append('abspath', this.state.path);
            axios.post('/remove', formData);

            this.setState({
                page: manga.page,
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

    onEditClick = (id) => {
        this.props.editManga(id);
    }

    removedOrginalMangaImage = () => {
        this.setState({
            removedOrginalImageAndNotSave: true
        });
    }

    render() {
        const { mangas } = this.props.manga;

        //payload name for manga image
        var payload = '';

        var manga = mangas.filter(manga => manga._id == this.props.mangaID)[0];

        return (
            <Fragment>
                { this.props.isAuthenticated ?
                    <Button
                        className='edit-btn'
                        title="ערוך"
                        color='warning'
                        size='sm'
                        onClick={this.toggle}
                    ><i class="fa fa-pencil" style={{color:'white'}} ria-hidden="true"></i></Button>
                    : null}


                <Modal
                    align="right"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                >
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span class="lead">Edit Manga</span></ModalHeader>
                    <div class="item-image" align="center">
                                <CardImg bottom className='ProductImg' src={this.state.mangaImage} alt="Card image cap" />
                            </div>
                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for='page'>page</Label>
                                <Input
                                    type='text'
                                    name='page'
                                    id='page'
                                    placeholder='page'
                                    className='mb-2'
                                    onChange={this.onChange}
                                    defaultValue={this.state.page}
                                />
                                

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
                                    color='dark'
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Save</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </Fragment>
        );
    }
}

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
