import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Card, CardBody, Fade, CardTitle, Button, Container, Form, FormGroup, Label,
    Input, Alert, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle, Row
} from 'reactstrap';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import { edit } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

import FileUpload from '../fileupload/FileUpload';
import ChangePassword from './ChangePassword';

class ChangeUserInfo extends Component {
    state = {
        path: '/uploads/users/',

        name: '',
        profileImage: '',
        email: '',
        password: '',

        dropDownOpen: false,
        currency: '',
        msg: null,
        file: null,
        redirect: null,

        fadeIn: true,
        removeImagefadeIn: false,
        prevProfileImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,
    };

    static protoType = {
        auth: PropTypes.object,
        error: PropTypes.object.isRequired,
        edit: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { user } = this.props.auth;
        this.setState({
            name: user.name,
            profileImage: user.profileImage,
            email: user.email,
            prevProfileImage: user.profileImage

        });

        if (this.state.prevProfileImage != '')
            this.setState({ prevProfileImage: user.profileImage });
    }

    componentDidUpdate(prevProps) {
        const { error, msg, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'EDIT_USER_FAIL') {
                this.setState({
                    msg: error.msg,
                    redirect: null
                });
            } else {
                this.setState({ msg: null });
            }
        }

        //If edited, close modal
        if (!this.state.removedOrginalImageAndNotSave && msg && msg.id === 'EDIT_USER_SUCCESS') {
            this.setState({ redirect: '/profile' });

            // Clear errors
            this.props.clearErrors();
            // Clear msgs
            this.props.clearMsgs();
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();
        const { name, email, profileImage, password } = this.state;
        const id = this.props.auth.user._id;

        // Create user object
        const NewUser = {
            name,
            profileImage,
            email,
            password
        };

        // Attempt to edit
        this.props.edit(id, NewUser);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.profileImage != this.state.prevProfileImage && this.state.prevProfileImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevProfileImage);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: false
        });
    }

    removedOrginalImageAndNotSave = () => {
        const { name, email, profileImage, password } = this.state;
        const id = this.props.auth.user._id;

        // Create user object
        const NewUser = {
            name,
            profileImage,
            email,
            password
        };

        // Attempt to edit
        this.props.edit(id, NewUser);

        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.profileImage != this.state.prevProfileImage && this.state.prevProfileImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevProfileImage);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: true
        });
    }

    setRegisterModalStates = (val) => {
        this.setState({ profileImage: val });
    }

    setRegisterModalStates = (val) => {
        this.setState({ profileImage: val });
        if (this.state.removeImagefadeIn == false) {
            this.setState({ removeImagefadeIn: !this.state.removeImagefadeIn });
        }
    }

    render() {
        return (
            <Fragment >
                <div className='position-relative py-4 pl-4'>
                    <Card style={bodyStyle}>
                        <CardTitle className={'mr-5 mb-2 lead pt-3'} tag="h5" style={{ display: 'inline' }}>User Editing</CardTitle>

                        <CardBody className='pr-4 mr-5'>
                            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>

                                    <Input
                                        type='text'
                                        defaultValue={this.state.name}
                                        name='name'
                                        id='name'
                                        placeholder='Name'
                                        className='mb-3'
                                        bsSize="sm"
                                        onChange={this.onChange}
                                        style={inputStyle}

                                    />

                                    <FileUpload
                                        setRegisterModalStates={this.setRegisterModalStates}
                                        path={this.state.path}
                                        currImage={this.state.profileImage}
                                        prevImage={this.state.prevProfileImage}
                                        imageSaved={this.state.imageSubmited}
                                        removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                                    />
                                    <Button
                                        className='green-style-btn mt-4'
                                        size="sm"
                                        color='dark'
                                        block
                                    >Save</Button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </div>

                {this.state.redirect &&
                    <Redirect exact from='profile/edit' to={this.state.redirect} />
                }
            </Fragment>
        );
    }
}

const bodyStyle = {
    border: '1px solid rgb(230, 230, 230)',
    webkitBorderRadius: '15px',
    mozBorderRadius: '15px',
    borderRadius: '15px',
    height: 'auto',
    width: 'auto',

    webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
    boxSshadow: '0 0 5px 0.1px #C7C7C7'
};

const inputStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: 'none',
    borderBottom: '1px solid #76735c',
    borderRadius: '1px',
    marginTop: '-9px',
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { edit, clearErrors, clearMsgs }
)(ChangeUserInfo);