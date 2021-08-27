import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { editCharacter } from '../../actions/characterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class EditCharacterModal extends Component {
    state = {
        path: '/uploads/characters/',
        modal: false,

        avatarImage: '',
        name: '',
        description: '',
        charId: '',
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
        editCharacter: PropTypes.func.isRequired
    }

    componentDidMount() {
        const { character } = this.props.character;

        this.setState({
            charId: character._id,
            name: character.name,
            description: character.description,
            avatarImage: character.avatarImage,
            prevImage: character.avatarImage,
        });
    }

    componentDidUpdate(prevProps, prevState) {
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
            if (this.state.charId !== character._id ) {
                if (msg.id === 'GET_CHARACTER_SUCCESS') {
                    this.setState({
                        charId:character._id,
                        name: character.name,
                        description: character.description,
                        avatarImage: character.avatarImage,
                        prevImage: character.avatarImage
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

        const newCharacter = {
            name: this.state.name,
            description: this.state.description,
            avatarImage: this.state.avatarImage,
        }

        // Edit avatarImage via editCharacter action
        this.props.editCharacter(character._id, newCharacter);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.avatarImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevImage);

            console.log("*remove editCharacterModal 1");
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

        const newCharacter = {
            name: this.state.name,
            description: this.state.description,
            avatarImage: this.state.avatarImage,
        }

        // Attempt to edit
        this.props.editCharacter(character._id, newCharacter);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.avatarImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevImage);

            console.log("*remove editCharacterModal 2");
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
                avatarImage: val
            });
    }

    close = () => {
        const { character } = this.props.character;

        const filepath = this.state.avatarImage
        if (!this.state.imageSubmited && character.avatarImage !==this.state.prevImage && filepath !== this.state.prevImage) {
            const formData = new FormData();
            formData.append('filepath', filepath);

            console.log("*remove editCharacterModal 3");
            axios.post('/remove', formData);

            this.setState({
                name: character.name,
                description: character.description,
                avatarImage: character.avatarImage,
                prevImage: character.avatarImage
            });
        }
        else {
            this.setState({
                imageSubmited: false,
                prevImage: character.avatarImage
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

    handleKeyDown(e) {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        // In case you have a limitation
        // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);
        const { character } = this.props.character;

        //payload name for character image
        var payload = '';

        return (
            <Fragment>
                {is_admin && character ?
                    <Button outline
                        // color='info'
                        size='sm'
                        style={{ marginBottom: '2rem' }}
                        onClick={this.toggle}
                    >Edit Character</Button>
                    : null}



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

                                <input className='input-place-holder form-control pt-3 pl-3 mb-5 mt-3' defaultValue={this.state.name} style={LineInputStyle} onChange={this.onChange} type="text" name='name' placeholder="Enter name..." />

                                <textarea className='hide-scroll input-place-holder form-control pt-3 pl-3 mb-5 mt-3' style={LineInputStyle} onChange={this.onChange} name="description" value={this.state.description} onKeyDown={this.handleKeyDown} placeholder="Enter Your description here..."></textarea>

                                <FileUpload
                                    payload={payload}
                                    setRegisterModalStates={this.setRegisterModalStates}
                                    path={this.state.path}
                                    currImage={this.state.avatarImage}
                                    prevImage={this.state.prevImage}
                                    imageSaved={this.state.imageSubmited}
                                    removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                                    removedOrginalItemImage={this.removedOrginalImage}
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
    character: state.character,
    auth: state.auth,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { editCharacter, clearErrors, clearMsgs }
)(EditCharacterModal);
