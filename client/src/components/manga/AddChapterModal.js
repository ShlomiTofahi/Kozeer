import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { addChapter } from '../../actions/chapterActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class AddChapterModal extends Component {
    state = {
        path: '/uploads/chapters/',
        modal: false,
        name: '',
        chapterImage: ''
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        addChapter: PropTypes.func.isRequired,
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            // Check for add error
            if (error.id === 'ADD_CHAPTER_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        //If added chapter, close modal
        if (this.state.modal) {
            if (msg.id === 'ADD_CHAPTER_SUCCESS') {
                this.toggle();
                this.setState({
                    name: '',
                    chapterImage: ''
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

        const newChapter = {
            name: this.state.name,
            chapterImage: this.state.chapterImage
        }
        console.log(newChapter)
        // Add chapter via addChapter action
        this.props.addChapter(newChapter);
    }

    setRegisterModalStates = (val) => {
        if (val !== '') {
            this.setState({ chapterImage: val });
        }
    }

    close = () => {
        const noImageFullpath = this.state.path + 'no-image.png';
        const filepath = this.state.chapterImage
        if (filepath !== '' && filepath !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
            this.setState({ chapterImage: '' });
        }
    }

    render() {
        const noImageFullpath = this.state.path + 'no-image.png';

        return (
            <div>
                { this.props.isAuthenticated ?
                    <Button outline
                        // color='info'
                        size='sm'
                        style={{ marginBottom: '2rem' }}
                        onClick={this.toggle}
                    >Add Chapter</Button>
                    : null}

                <Modal
                    align="right"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                >
                    {/* <ModalHeader toggle={this.toggle}>Add To Shopping List</ModalHeader> */}
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span class="lead">Add chapter</span></ModalHeader>

                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}

                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for='item'>chapter</Label>
                                <Input
                                    type='text'
                                    name='name'
                                    id='name'
                                    placeholder='Enter chapter...'
                                    className='mb-2'
                                    onChange={this.onChange}
                                />

                                <FileUpload
                                    setRegisterModalStates={this.setRegisterModalStates}
                                    path={this.state.path}
                                    currImage={noImageFullpath}
                                />

                                <Button
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

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { addChapter, clearMsgs, clearErrors }
)(AddChapterModal);