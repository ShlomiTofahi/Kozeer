import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { addManga } from '../../actions/mangaActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class AddMangaModal extends Component {
    state = {
        path: '/uploads/mangas/',
        modal: false,
        page: '',
        fullpage: false,
        mangaImage: ''
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        addManga: PropTypes.func.isRequired,
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            // Check for add error
            if (error.id === 'ADD_MANGA_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        //If added manga, close modal
        if (this.state.modal) {
            if (msg.id === 'ADD_MANGA_SUCCESS') {
                this.toggle();
                this.setState({
                    page: '',
                    fullpage: false,
                    mangaImage: ''
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

        const newManga = {
            page: this.state.page,
            fullpage: this.state.fullpage,
            chapter: this.props.chapter,
            mangaImage: this.state.mangaImage
        }
        // Add manga via addManga action
        this.props.addManga(newManga);
    }

    fullpageToggle = () => {
        this.setState({ fullpage: !this.state.fullpage });
      }

    setRegisterModalStates = (val) => {
        if (val !== '') {
            this.setState({ mangaImage: val });
        }
    }

    close = () => {
        const noImageFullpath = this.state.path + 'no-image.png';
        const filepath = this.state.mangaImage
        if (filepath !== '' && filepath !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
            this.setState({ mangaImage: '' });
        }
        this.setState({
            fullpage: false
          })
    }

    render() {
        const noImageFullpath = this.state.path + 'no-image.png';

        return (
            <div>
                { this.props.isAuthenticated ?
                    <Button outline
                        color='info'
                        size='sm'
                        style={{ opacity: '0.7' }}
                        onClick={this.toggle}
                    >Add Manga</Button>
                    : null}


                <Modal
                    align="right"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                >
                    {/* <ModalHeader toggle={this.toggle}>Add To Shopping List</ModalHeader> */}
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span class="lead">Add Manga</span></ModalHeader>

                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}

                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for='item'>page</Label>
                                <Input
                                    type='text'
                                    name='page'
                                    id='page'
                                    placeholder='Enter page...'
                                    className='mb-2'
                                    onChange={this.onChange}
                                />
                                <div className='text-left'>
                                    <small className='mr-2' style={{ color: '#76735c' }}><Label for='fullpage'>fullpage</Label></small>
                                    <label className="switch">
                                        <input id='fullpage' name='fullpage' type="checkbox" onChange={this.fullpageToggle} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
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
    { addManga, clearMsgs, clearErrors }
)(AddMangaModal);