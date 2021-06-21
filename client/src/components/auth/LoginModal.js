import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Collapse, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import RegisterModal from './RegisterModal';
import RestPassword from './RestPassword';

class LoginModal extends Component {
    state = {
        modal: false,
        email: '',
        password: '',
        msg: null,
        signUpfadeIn: true,
        signInfadeIn: false,
        logInfadeIn: false,
        registerfadeIn: false,
        restPassfadeIn: false,
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        login: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'LOGIN_FAIL') {
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
    
        if(this.state.modal===true && this.props.linkcolor && this.props.toggle){
            this.props.toggle()
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();

        const { email, password } = this.state;

        const user = {
            email,
            password
        }

        // Attempt to login
        this.props.login(user);
    }
    signToggle = (action) => {
        this.setState((state) => ({
            signInfadeIn: false,
            signUpfadeIn: false,
            logInfadeIn: false,
            register: false,
        }))
        if (action === 'sign-in') {
            this.setState((state) => (
                {
                    signInfadeIn: true
                }))
        }
        else if (action === 'sign-up') {
            this.setState((state) => (
                {
                    signUpfadeIn: true
                }))
        }
        else if (action === 'log-in') {
            this.setState((state) => (
                {
                    logInfadeIn: true
                }))
        }
        else if (action === 'register') {
            this.setState((state) => (
                {
                    registerfadeIn: true
                }))
        }
        else if (action === 'restPass') {
            this.setState((state) => (
                {
                    restPassfadeIn: true
                }))
        }
    }
    close = () => {
        this.setState((state) => ({
            signUpfadeIn: true,
            signInfadeIn: false,
            logInfadeIn: false,
            registerfadeIn: false,
            restPassfadeIn: false,
        }))
    }
    render() {
        return (
            <div>
                {
                    this.props.linkcolor === 'green' ?
                        <Link className='login-btn' onClick={this.toggle} href='#'>Connect</Link>
                        : <Link className={'navlink header-tablinks py-2 px-5 nav-link d-md-inline-block'} onClick={this.toggle} to='#'>SIGN UP</Link>
                }


                <Modal align="center" isOpen={this.state.modal} toggle={this.toggle} onClosed={this.close} className="login-modal">
                    <Collapse isOpen={this.state.signUpfadeIn}>
                        <ModalHeader style={{ fontFamily: "'Indie Flower', Kimberly Geswein" }} cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle}><span style={{ 'fontSize': '30px' }} >SIGN Up</span></ModalHeader>
                        <ModalBody>
                            <div>
                                Already a member? <Button className='login-btn' onClick={this.signToggle.bind(this, 'sign-in')}>Log In</Button>
                            </div>
                            <div style={{ maxWidth: '250px' }}>
                                <Button className='login-btn-sign-in-up' color='light' outline size="sm" block onClick={this.signToggle.bind(this, 'register')}>Sign up with email</Button>
                            </div>
                        </ModalBody>
                    </Collapse>
                    <Collapse isOpen={this.state.registerfadeIn}>
                        <ModalHeader style={{ fontFamily: "'Indie Flower', Kimberly Geswein" }} cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle}><span style={{ 'fontSize': '30px' }} >Register</span></ModalHeader>
                        <div style={{ maxWidth: '250px' }}>
                            <RegisterModal />
                        </div>
                    </Collapse>
                    <Collapse isOpen={this.state.restPassfadeIn}>
                        <ModalHeader style={{ fontFamily: "'Indie Flower', Kimberly Geswein" }} cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle}><span style={{ 'fontSize': '30px' }} >Rest Password</span></ModalHeader>
                        <div style={{ maxWidth: '250px' }}>
                            <RestPassword />
                        </div>
                    </Collapse>
                    <Collapse isOpen={this.state.signInfadeIn}>
                        <ModalHeader style={{ fontFamily: "'Indie Flower', Kimberly Geswein" }} cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle}><span style={{ 'fontSize': '30px' }} >SIGN IN</span></ModalHeader>
                        <ModalBody>
                            <div>
                                New to this site? <Button className='login-btn' onClick={this.signToggle.bind(this, 'sign-up')}>Sign Up</Button>
                            </div>
                            <div style={{ maxWidth: '250px' }}>
                                <Button className='login-btn-sign-in-up' color='light' outline size="sm" block onClick={this.signToggle.bind(this, 'log-in')}>Log in with email</Button>
                            </div>
                        </ModalBody>
                    </Collapse>
                    <Collapse isOpen={this.state.logInfadeIn}>
                        <ModalHeader style={{ fontFamily: "'Indie Flower', Kimberly Geswein" }} cssModule={{ 'modal-title': 'w-100 text-center' }} toggle={this.toggle}><span style={{ 'fontSize': '30px' }} >LOG IN</span></ModalHeader>
                        <ModalBody>
                            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>
                                    <div align='left' style={{ maxWidth: '250px' }}>
                                        <small className='pt-3' style={{ color: '#76735c' }}><Label for='email'>Email</Label></small>
                                        <Input
                                            bsSize="sm"
                                            type='email'
                                            name='email'
                                            id='email'
                                            className='mb-3'
                                            onChange={this.onChange}
                                            style={inputStyle}
                                        />
                                        <small style={{ color: '#76735c' }}><Label for='password'>Password</Label></small>
                                        <Input
                                            bsSize="sm"
                                            type='password'
                                            name='password'
                                            id='password'
                                            onChange={this.onChange}
                                            style={inputStyle}
                                        />
                                        <Button className='login-btn' size="sm" onClick={this.signToggle.bind(this, 'restPass')}>Forgot password?</Button>
                                        <Button
                                            style={btnStyle}
                                            size="sm"
                                            color='dark'
                                            block
                                        >Log In</Button>
                                    </div>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                    </Collapse>
                </Modal>
            </div>
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

const btnStyle = {
    backgroundColor: '#5e8f86',
    borderRadius: '1px',
    marginTop: '2rem'
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(
    mapStateToProps,
    { login, clearErrors }
)(LoginModal);
