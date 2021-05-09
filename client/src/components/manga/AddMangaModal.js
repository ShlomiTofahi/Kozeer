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
            mangaImage: this.state.mangaImage
        }
        console.log(newManga)
        // Add manga via addManga action
        this.props.addManga(newManga);
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
    }

    render() {
        const noImageFullpath = this.state.path + 'no-image.png';

        return (
            <div>
                { this.props.isAuthenticated ?
                    <Button outline
                        className='add-element-btn'
                        color='info'
                        size='sm'
                        style={{ marginBottom: '2rem' }}
                        onClick={this.toggle}
                    >Add Manga</Button>
                    : <h4 className='mb-3 ml-4'>Please log in to manage mangas</h4>}


                <Modal
                    align="right"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                >
                    {/* <ModalHeader toggle={this.toggle}>Add To Shopping List</ModalHeader> */}
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span class="lead">הוספת קטגוריה</span></ModalHeader>

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