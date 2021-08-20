import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { loadSetting, editSetting } from '../../actions/settingActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import FileUpload from '../fileupload/FileUpload';

class SetBgImageModal extends Component {
    state = {
        path: '/uploads/settings/',
        modal: false,

        bgImage: '',

        prevImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,

        hover: false
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
            bgImage: setting.bgImage,
            prevImage: setting.bgImage,
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
            bgImage: this.state.bgImage,
        }
        // edit setting via newSetting action
        this.props.editSetting(newSetting);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.bgImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
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
            this.setState({ bgImage: val });
        }
    }
    removedOrginalImage = () => {
        this.setState({
            removedOrginalImageAndNotSave: true
        });
    }

    removedOrginalImageAndNotSave = () => {
        var { bgImage } = this.state;

        const newSetting = {
            bgImage
        }


        // Attempt to edit
        this.props.editSetting(newSetting);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.bgImage !== this.state.prevImage && this.state.prevImage !== noImageFullpath) {
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

    toggleHover = () => {
        this.setState({
            hover: !this.state.hover
        });
    }

    navTextColorsStyle = () => {
        const { setting } = this.props.setting;
        let textColor = "#ffffff";
        if (setting?.headerColorText !== null) {
            textColor = setting.headerColorText;
        }

        if (this.state.hover) {
            textColor = "#21201f";
            if (setting?.headerHoverColorText !== null) {
                textColor = setting.headerHoverColorText;
            }
        }

        return {
            color: textColor
        };
    };

    close = () => {
        const { setting } = this.props.setting;

        const noImageFullpath = this.state.path + 'no-image.png';
        const filepath = this.state.bgImage
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
                prevImage: setting.bgImage
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
            <div>
                {is_admin ?
                    <Link onClick={this.toggle} to='#'
                        className='pl-2'
                        style={this.navTextColorsStyle()}
                        onMouseEnter={this.toggleHover}
                        onMouseLeave={this.toggleHover}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z" />
                        </svg>
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
                                    currImage={this.state.bgImage}
                                    prevImage={this.state.prevImage}
                                    imageSaved={this.state.imageSubmited}
                                    removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                                    removedOrginalItemImage={this.removedOrginalImage}
                                />

                                <Button
                                    color='dark'
                                    size="sm"
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Save</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
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
)(SetBgImageModal);