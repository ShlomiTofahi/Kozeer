import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { editSetting } from '../actions/settingActions';
import { clearErrors } from '../actions/errorActions';
import { clearMsgs } from '../actions/msgActions';
import FileUpload from './fileupload/FileUpload';

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
        const navLink = window.innerWidth <= 575 ? 'nav-link' : '';

        return (
            <div>
                {is_admin ?
                    <Link className={'navlink header-tablinks pl-4 d-md-inline-block ' + navLink} onClick={this.toggle} to='#'
                        style={this.navTextColorsStyle()}
                        onMouseEnter={this.toggleHover}
                        onMouseLeave={this.toggleHover}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
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
    { editSetting, clearMsgs, clearErrors }
)(SetBgImageModal);