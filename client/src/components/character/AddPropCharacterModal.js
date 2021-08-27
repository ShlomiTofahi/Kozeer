import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Alert, Label } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { addPropCharacter } from '../../actions/characterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class AddPropCharacterModal extends Component {
    state = {
        path: '/uploads/characters/',
        modal: false,
        propImage: ''
    };

    static propTypes = {
        auth: PropTypes.object.isRequired,
        character: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        addPropCharacter: PropTypes.func.isRequired,
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            // Check for add error
            if (error.id === 'ADD_PROP_CHARACTER_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        //If added character, close modal
        if (this.state.modal) {
            if (msg.id === 'ADD_PROP_CHARACTER_SUCCESS') {
                this.toggle();
                this.setState({
                    propImage: ''
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
    }

    onSubmit = e => {
        e.preventDefault();

        const propImage = {
            propImage: this.state.propImage
        }
        // Add character via addPropCharacter action
        this.props.addPropCharacter(this.props.character.character._id, propImage);
    }

    setRegisterModalStates = (val) => {
        if (val !== '') {
            this.setState({ propImage: val });
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
        const propImage = this.state.propImage;
        if (propImage !== '' && propImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', propImage);

            console.log("*remove AddPropCharacterModal 1");
            axios.post('/remove', formData);
            this.setState({ charImage: '' });
        }

        this.setState({
            propImage: ''
        })
    }

    render() {
        const noImageFullpath = this.state.path + 'no-image.png';
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);
        const { character } = this.props.character;

        return (
            <div>
                {is_admin ?
                    <Button outline
                        // color='info'
                        size='sm'
                        style={{ marginBottom: '2rem' }}
                        onClick={this.toggle}
                    >Add Prop Character</Button>
                    : null}
                {
                    character &&
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

                                    <small className='pt-3' style={{ color: '#76735c' }}><Label>Character prop Image:</Label></small>
                                    {character.name &&
                                        <FileUpload
                                            setRegisterModalStates={this.setRegisterModalStates}
                                            path={this.state.path + character?.name?.replaceAll(' ', '_') + '/props/'}
                                            currImage={noImageFullpath}
                                        />
                                    }
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
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    error: state.error,
    character: state.character,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { addPropCharacter, clearMsgs, clearErrors }
)(AddPropCharacterModal);