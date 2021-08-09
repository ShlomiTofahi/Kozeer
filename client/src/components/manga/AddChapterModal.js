import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Alert } from 'reactstrap';
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

            console.log("*remove AddChapterModal");
            axios.post('/remove', formData);
            this.setState({ chapterImage: '' });
        }
    }

    render() {
        const noImageFullpath = this.state.path + 'no-image.png';

        return (
            <div>
                {this.props.isAuthenticated ?
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
                    className="dark-modal"
                >
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span className="lead">Add chapter</span></ModalHeader>

                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}

                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                
                                <input className='input-place-holder form-control pt-3 pl-3 mb-5 mt-3' style={LineInputStyle} onChange={this.onChange} type="text" name='name'  id='name' placeholder="Enter chapter..." />

                                <FileUpload
                                    setRegisterModalStates={this.setRegisterModalStates}
                                    path={this.state.path}
                                    currImage={noImageFullpath}
                                />

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
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { addChapter, clearMsgs, clearErrors }
)(AddChapterModal);