import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { editCharImage } from '../../actions/characterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class EditCharImageModal extends Component {
    state = {
        path: '/uploads/characters/',
        modal: false,

        charImage: '',

        prevImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,
    };

    static propTypes = {
        auth: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        editCharImage: PropTypes.func.isRequired
    }

    componentDidMount() {

        const { character } = this.props.character;
        this.setState({
            charImage: character.charImage,
            prevImage: character.charImage
        });
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        const { character } = this.props.character;

        if (error !== prevProps.error) {
            // Check for edit error
            if (error.id === 'EDIT_CHARACTER_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        if (character !== prevProps.character) {
            if (this.state.charImage !== character.charImage) {
                if (msg.id === 'GET_CHARACTER_SUCCESS') {
                    this.setState({
                        charImage: character.charImage,
                        prevImage: character.charImage
                    });
                }
            }
        }

        //If edited, close modal
        if (this.state.modal) {
            if (!this.state.removedOrginalImageAndNotSave && msg && msg.id === 'EDIT_CHARACTER_SUCCESS') {
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
        const { character } = this.props.character;

        const charImage = {
            charImage: this.state.charImage
        }

        // Edit charImage via editCharImage action
        this.props.editCharImage(character._id, charImage);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.charImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevImage);

            console.log("*remove EditCharImageModal 1");
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
        const { character } = this.props.character;

        const charImage = {
            charImage: this.state.charImage
        }

        // Attempt to edit
        this.props.editCharImage(character._id, charImage);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.charImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevImage);

            console.log("*remove EditCharImageModal 2");
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
                charImage: val
            });
    }

    close = () => {
        const { character } = this.props.character;

        const filepath = this.state.charImage
        if (!this.state.imageSubmited && character.charImage !== this.state.charImage && filepath !== this.state.prevImage) {
            const formData = new FormData();
            formData.append('filepath', filepath);

            console.log("*remove EditCharImageModal 3");
            axios.post('/remove', formData);

            this.setState({
                charImage: character.charImage,
                prevImage: character.charImage
            });
        }
        else {
            this.setState({
                imageSubmited: false,
                prevImage: character.charImage
            });
        }
        if (this.state.removedOrginalImageAndNotSave) {
            this.removedOrginalImageAndNotSave();
        }
    }

    removedOrginalImage = () => {
        this.setState({
            removedOrginalImageAndNotSave: true
        });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);
        const { character } = this.props.character;

        //payload name for character image
        var payload = '';

        return (
            <Fragment>
                {is_admin ?
                    <button onClick={this.toggle} className="hover-edit-btn" style={this.props?.noCharImage ? { opacity: '1' } : null}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                        </svg>
                    </button>
                    : null
                }


                {
                    character &&
                    < Modal
                        align="right"
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                        onClosed={this.close}
                        className="dark-modal"
                    >
                        <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span className="lead">Edit character image</span></ModalHeader>
                        <ModalBody>
                            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    {character.name &&
                                        <FileUpload
                                            payload={payload}
                                            setRegisterModalStates={this.setRegisterModalStates}
                                            path={this.state.path + character.name + '/'}
                                            currImage={this.state.charImage}
                                            prevImage={this.state.prevImage}
                                            imageSaved={this.state.imageSubmited}
                                            removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                                            removedOrginalItemImage={this.removedOrginalImage}
                                        />
                                    }
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
                }
            </Fragment >
        );
    }
}

const mapStateToProps = state => ({
    character: state.character,
    auth: state.auth,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { editCharImage, clearErrors, clearMsgs }
)(EditCharImageModal);
