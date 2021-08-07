import React, { Component, Fragment } from 'react';
import {
    Button, ModalBody, Form, FormGroup, Label, Input, Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import FileUpload from '../fileupload/FileUpload';

class RegisterModal extends Component {
    state = {
        path: '/uploads/users/',
        currency: '',
        modal: true,
        name: '',
        email: '',
        password: '',
        profileImage: '',
        msg: null,
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        register: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }
    componentDidMount() {
        this.setState({
            modal: true
        });
    }
    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'REGISTER_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: null });
            }
        }

        // If authenticated, close modal
        if (this.state.modal) {
            if (isAuthenticated) {
                this.toggle();
            }
        }
    }

    toggle = () => {
        // Clear errors
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();

        const { name, email, password, profileImage } = this.state;
        // Create user object
        const NewUser = {
            name,
            email,
            password,
            profileImage
        };

        // Attempt to register
        this.props.register(NewUser);
    }

    setRegisterModalStates = (val) => {
        if (val !== '')
            this.setState({ profileImage: val });
    }

    close = () => {
        const noImageFullpath = this.state.path + 'no-image.png';
        const filepath = this.state.profileImage
        if (filepath !== '' && filepath !== noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', filepath);
            console.log("*remove registerModal");
            axios.post('/remove', formData);
            this.setState({ profileImage: '' });
        }
    }

    render() {
        const noImageFullpath = this.state.path + 'no-image.png';

        return (
            <Fragment>
                {/* <Link className={'navlink header-tablinks py-2 px-5 nav-link d-md-inline-block'} onClick={this.toggle} to='#'>SIGN UP</Link> */}
                {/* 
                <Modal align="left" isOpen={this.state.modal} toggle={this.toggle} onClosed={this.close}>
                    <ModalHeader cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle}>הרשמה</ModalHeader>*/}
                <ModalBody>
                    {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <small className='pt-3' style={{ color: '#76735c' }}><Label for='name'>Name</Label></small>
                            <Input
                                type='name'
                                name='name'
                                id='name'
                                className='mb-3'
                                onChange={this.onChange}
                                bsSize="sm"
                                style={inputStyle}
                            />

                            <small className='pt-3' style={{ color: '#76735c' }}><Label for='email'>Email</Label></small>
                            <Input
                                type='email'
                                name='email'
                                id='email'
                                className='mb-3'
                                onChange={this.onChange}
                                bsSize="sm"
                                style={inputStyle}
                            />

                            <small style={{ color: '#76735c' }}><Label for='password'>Password</Label></small>
                            <Input
                                type='password'
                                name='password'
                                id='password'
                                className='mb-3'
                                onChange={this.onChange}
                                bsSize="sm"
                                style={inputStyle}
                            />
                            <FileUpload
                                setRegisterModalStates={this.setRegisterModalStates}
                                path={this.state.path}
                                currImage={noImageFullpath}
                            />
                            <Button
                                className='green-style-btn mt-4'
                                size="sm"
                                color='dark'
                                block
                            >Register</Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
                {/*  </Modal> */}
            </Fragment>
        );
    }
}

const inputStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: 'none',
    borderBottom: '1px solid #76735c',
    borderRadius: '1px',
    marginTop: '-9px'
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(
    mapStateToProps,
    { register, clearErrors }
)(RegisterModal);
