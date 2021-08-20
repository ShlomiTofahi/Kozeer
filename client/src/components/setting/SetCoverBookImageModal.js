import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { loadSetting, editSetting } from  '../../actions/settingActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class SetCoverBookImageModal extends Component {
    state = {
        path: '/uploads/settings/',
        modal: false,

        coverBookImage: '',

        prevImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,
    };

    static propTypes = {
        auth: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        editSetting: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { setting } = this.props.setting;

        if(setting !==null){
            this.props.loadSetting();
        }

        this.setState({
            coverBookImage: setting.coverBookImage,
            prevImage: setting.coverBookImage,
        });
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            // Check for add error
            if (error.id === 'EDIT_SETTINGS_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        //If added chapter, close modal
        if (this.state.modal) {
            if (!this.state.removedOrginalImageAndNotSave && msg && msg.id === 'EDIT_SETTINGS_SUCCESS') {
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
            modal: !this.state.modal
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();

        const newSetting = {
            coverBookImage: this.state.coverBookImage,
        }
        // edit setting via newSetting action
        this.props.editSetting(newSetting);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.coverBookImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevImage);
            formData.append('abspath', this.state.path);

            console.log("*remove SettingModal 1");
            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: false
        });
    }

    setRegisterModalStates = (val) => {
        if (val !== '') {
            this.setState({ coverBookImage: val });
        }
    }
    removedOrginalImage = () => {
        this.setState({
            removedOrginalImageAndNotSave: true
        });
    }

    removedOrginalImageAndNotSave = () => {
        var { coverBookImage } = this.state;

        const newSetting = {
            coverBookImage
        }


        // Attempt to edit
        this.props.editSetting(newSetting);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.coverBookImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevImage);
            formData.append('abspath', this.state.path);

            console.log("*remove SettingModal 2");
            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: true
        });
    }

    close = () => {
        const { setting } = this.props.setting;

        const noImageFullpath = this.state.path + 'no-image.png';
        const filepath = this.state.coverBookImage
        if (!this.state.imageSubmited && filepath !== this.state.prevImage && filepath !== noImageFullpath) {

            const formData = new FormData();
            formData.append('filepath', filepath);
            formData.append('abspath', this.state.path);

            console.log("*remove SettingModal 3");
            axios.post('/remove', formData);
            this.setState({ chapterImage: '' });
        }
        else {
            this.setState({
                imageSubmited: false,
                prevImage: setting.coverBookImage
            });
        }

        if (this.state.removedOrginalImageAndNotSave) {
            this.removedOrginalImageAndNotSave();
        }
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        return (
            <Fragment>
                {is_admin ?
                    <Link className={'login-btn pl-2 d-block d-sm-inline'} onClick={this.toggle} to='#'>
                        Edit Cover Book Image
                    </Link>
                    : null}

                <Modal
                    align="left"
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                    onClosed={this.close}
                    className="dark-modal"
                >
                    {/* <ModalHeader toggle={this.toggle}>Add To Shopping List</ModalHeader> */}
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle} ><span className="lead">Backgoud Image Setting</span></ModalHeader>

                    <ModalBody>
                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}

                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <small className='pt-3' style={{ color: '#76735c' }}><Label>site back-ground:</Label></small>
                                <FileUpload
                                    setRegisterModalStates={this.setRegisterModalStates}
                                    path={this.state.path}
                                    currImage={this.state.coverBookImage}
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
                </Modal>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    setting: state.setting,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { loadSetting, editSetting, clearMsgs, clearErrors }
)(SetCoverBookImageModal);