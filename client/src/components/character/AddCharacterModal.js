import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Alert, Label } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Collapse } from 'react-collapse';

import { addCharacter } from '../../actions/characterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class AddCharacterModal extends Component {
    state = {
        path: '/uploads/characters/',
        modal: false,
        propImage: ''
    };

    static propTypes = {
        auth: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        addCharacter: PropTypes.func.isRequired,
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            // Check for add error
            if (error.id === 'ADD_CHARACTER_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        //If added character, close modal
        if (this.state.modal) {
            if (msg.id === 'ADD_CHARACTER_SUCCESS') {
                this.toggle();
                this.setState({
                    name: '',
                    description: '',
                    avatarImage: '',
                    charImage: ''
                })
            }
        }
    }

    toggle = () => {
        // Clear errors
        this.props.clearErrors();
        // Clear msgs
        this.props.clearMsgs();

        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'name') {
            const filepath_charImage = this.state.charImage;
            const filepath_avatarImage = this.state.avatarImage;
            if (filepath_charImage !== '') {
                const formData = new FormData();
                formData.append('filepath', filepath_charImage);

                console.log("*remove AddCharacterModal onchange 1");
                axios.post('/remove', formData);
                this.setState({ charImage: '' });
            }

            if (filepath_avatarImage !== '') {
                const formData = new FormData();
                formData.append('filepath', filepath_avatarImage);

                console.log("*remove AddCharacterModal onchange 2");
                axios.post('/remove', formData);
                this.setState({ avatarImage: '' });
            }
            this.setState({
                avatarImage: '',
                charImage: ''
            })
        }
    }

    onSubmit = e => {
        e.preventDefault();

        const newCharacter = {
            name: this.state.name,
            description: this.state.description,
            charImage: this.state.charImage,
            avatarImage: this.state.avatarImage
        }
        // Add character via addCharacter action
        this.props.addCharacter(newCharacter);
    }

    setRegisterModalCharImageStates = (val) => {
        if (val !== '') {
            this.setState({ charImage: val });
        }
    }

    setRegisterModalAvatarImageStates = (val) => {
        if (val !== '') {
            this.setState({ avatarImage: val });
        }
    }


    handleKeyDown(e) {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        // In case you have a limitation
        // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
    }

    close = () => {
        const noImageFullpath = this.state.path + 'no-image.png';
        const filepath_charImage = this.state.charImage;
        const filepath_avatarImage = this.state.avatarImage;
        if (filepath_charImage !== '' && filepath_charImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath_charImage);

            console.log("*remove AddCharacterModal 1");
            axios.post('/remove', formData);
            this.setState({ charImage: '' });
        }

        if (filepath_avatarImage !== '' && filepath_avatarImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath_avatarImage);

            console.log("*remove AddCharacterModal 2");
            axios.post('/remove', formData);
            this.setState({ avatarImage: '' });
        }

        this.setState({
            name: '',
            description: '',
            avatarImage: '',
            charImage: ''
        })
    }

    render() {
        const noImageFullpath = this.state.path + 'no-image.png';
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        return (
            <div>
                {is_admin ?
                    <Button outline
                        // color='info'
                        size='sm'
                        style={{ marginBottom: '2rem' }}
                        onClick={this.toggle}
                    >Add Character</Button>
                    : null}

                <Modal
                    align="right"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                    className="dark-modal"
                >
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span className="lead">Add Character</span></ModalHeader>

                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}

                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>

                                <input className='input-place-holder form-control pt-3 pl-3 mb-5 mt-3' style={LineInputStyle} onChange={this.onChange} type="text" name='name' id='name' placeholder="Enter name..." />
                                {/* <input className='input-place-holder form-control pt-3 pl-3 mb-5 mt-3' style={LineInputStyle} onChange={this.onChange} type="text" name='description' id='description' placeholder="Enter description..." /> */}
                                {/* <small className='pt-3' style={{ color: '#76735c' }}><Label>description:</Label></small> */}
                                <textarea className='hide-scroll input-place-holder form-control pt-3 pl-3 mb-5 mt-3' style={LineInputStyle} onChange={this.onChange} name="description" onKeyDown={this.handleKeyDown} placeholder="Enter description..."></textarea>

                                <Collapse isOpened={this.state.name !== ''}>
                                    <small className='pt-3' style={{ color: '#76735c' }}><Label>Avatar Image:</Label></small>
                                    <FileUpload
                                        setRegisterModalStates={this.setRegisterModalAvatarImageStates}
                                        path={this.state.path + this.state.name?.replaceAll(' ', '_') + '/'}
                                        currImage={noImageFullpath}
                                    />

                                    <small className='pt-3' style={{ color: '#76735c' }}><Label>Character Image:</Label></small>
                                    <FileUpload
                                        setRegisterModalStates={this.setRegisterModalCharImageStates}
                                        path={this.state.path + this.state.name?.replaceAll(' ', '_') + '/'}
                                        currImage={noImageFullpath}
                                    />
                                </Collapse>

                                <Button
                                    className='green-style-btn mt-4'
                                    size="sm"
                                    color='dark'
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Add</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
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
    auth: state.auth,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { addCharacter, clearMsgs, clearErrors }
)(AddCharacterModal);