import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import {
    CardBody, Button, Form, ModalBody,
    FormGroup, Input, Alert, Row, Container
} from 'reactstrap';

import { CreateToken, VerifyToken } from '../../actions/twoFactorAuthActions';
import { changePassByEmail, getUserByEmail } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

class RestPassword extends Component {
    state = {
        chgPassCollapsetoggle: false,
        message: '',
        messageAlery: '',
        visible: true,
        verifyCollapsetoggle: false,
        email: '',
        emailCollapsetoggle: true,

        currentPassword: '',
        password: '',
        validationPassword: '',
        verificationCode: '',
        userID: '',
        msg: null,

        finishedtoggle: false
    };

    static protoType = {
        auth: PropTypes.object,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        twoFactorAuth: PropTypes.object.isRequired,
        changePassByEmail: PropTypes.func.isRequired,
        getUserByEmail: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        CreateToken: PropTypes.func.isRequired,
        VerifyToken: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'CREATE_TOKEN_FAIL') {
                this.setState({
                    msg: error.msg,
                    messageAlery: 'danger',
                    message: error.msg,
                    emailCollapsetoggle: true,
                    verifyCollapsetoggle: false
                });
            } else {
                this.setState({ msg: null });
            }

            if (error.id === 'VERIFY_TOKEN_FAIL') {
                this.setState({
                    msg: error.msg,
                    messageAlery: 'danger',
                    message: error.msg,
                    verifyCollapsetoggle: true,
                    chgPassCollapsetoggle: false
                });
            } else {
                this.setState({ msg: null });
            }
        }

        if (msg && msg.id === 'CREATE_TOKEN_SUCCESS') {
            this.setState({
                message: msg.msg,
                messageAlery: 'info',

            })
            this.VerifyCollapseHangdle();
            // Clear errors
            this.props.clearErrors();
            // Clear msgs
            this.props.clearMsgs();
        }
        if (msg && msg.id === 'VERIFY_TOKEN_SUCCESS') {
            this.setState({
                message: msg.msg,
                messageAlery: 'info'
            })
            this.ChgPassCollapseHangdle();
            // Clear errors
            this.props.clearErrors();
            // Clear msgs
            this.props.clearMsgs();
        }
        if (msg && msg.id === 'CHANGE_PASSWORD_SUCCESS') {
            this.setState({
                chgPassCollapsetoggle: false,
                finishedtoggle: true
            })
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
        const { validationPassword, password } = this.state;

        const id = this.props.auth.user._id;
        const currPassword = this.props.auth.user.password;

        const data = {
            currentPassword: currPassword,
            validationPassword,
            password
        };

        // Attempt to change
        this.props.changePassByEmail(id, data);
    }

    VerifyCollapseHangdle = () => {
        this.setState({
            verifyCollapsetoggle: true,
            emailCollapsetoggle: false
        })
    }

    ChgPassCollapseHangdle = () => {
        const { email } = this.state;
        this.props.getUserByEmail(email);

        this.setState({
            chgPassCollapsetoggle: true,
            verifyCollapsetoggle: false,
        })
    }

    onClickEmail = () => {
        this.props.CreateToken(this.state.email)
    }

    onClickVerify = () => {
        this.props.VerifyToken(this.state.email, this.state.verificationCode)
    }

    onDismiss = () => {
        this.setState({
            visible: false
        })
    }

    render() {
        return (
            <Fragment >
                <ModalBody>
                    <Container
                        style={{
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                        <Row >
                            <div className='position-relative'>
                                {this.state.message ? <Alert color={this.state.messageAlery} isOpen={this.state.visible} toggle={this.onDismiss}><small>{this.state.message}</small></Alert>
                                    : null}
                                <Collapse isOpened={this.state.emailCollapsetoggle}>
                                    {/* <Card style={this.bodyStyle()} className='animated bounceInLeft'> */}
                                    <CardBody className='pr-4'>
                                        <Input
                                            size='sm'
                                            type='email'
                                            name='email'
                                            id='email'
                                            placeholder='Email'
                                            className='mb-3'
                                            onChange={this.onChange}
                                            style={inputStyle}
                                            block
                                        />
                                        <Button
                                            color='light'
                                            size='sm'
                                            className='login-btn-sign-in-up'
                                            outline
                                            onClick={this.onClickEmail}
                                            style={{ marginTop: '2rem' }}
                                            block
                                        >Confirm</Button>
                                    </CardBody>
                                    {/* </Card> */}
                                </Collapse>

                                <Collapse isOpened={this.state.verifyCollapsetoggle}>
                                    {/* <Card style={this.bodyStyle()}> */}
                                    <CardBody className='pr-4'>
                                        <Input
                                            size='sm'
                                            type='text'
                                            name='verificationCode'
                                            id='verificationCode'
                                            placeholder='Verification code'
                                            onChange={this.onChange}
                                            style={inputStyle}
                                            block
                                        />
                                        <Button
                                            color='light'
                                            size='sm'
                                            onClick={this.onClickEmail}
                                            className='badge badge-info ml-5'
                                        >Resend new verification code</Button>
                                        <Button
                                            color='light'
                                            size='sm'
                                            className='login-btn-sign-in-up'
                                            outline
                                            onClick={this.onClickVerify}
                                            style={{ marginTop: '2rem' }}
                                            block
                                        >Confirm</Button>
                                    </CardBody>
                                    {/* </Card> */}
                                </Collapse>

                                <Collapse isOpened={this.state.chgPassCollapsetoggle}>
                                    {/* <Card style={this.verifybodyStyle()}> */}
                                    <CardBody className='pr-4'>
                                        {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                                        <Form onSubmit={this.onSubmit}>
                                            <FormGroup>
                                                <Input
                                                    size='sm'
                                                    type='password'
                                                    name='password'
                                                    id='password'
                                                    placeholder='New password'
                                                    className='mb-3'
                                                    onChange={this.onChange}
                                                    style={inputStyle}
                                                />
                                                <Input
                                                    size='sm'
                                                    type='password'
                                                    name='validationPassword'
                                                    id='validationPassword'
                                                    placeholder='Validation Password'
                                                    className='mb-3'
                                                    onChange={this.onChange}
                                                    style={inputStyle}
                                                />

                                                <Button
                                                    color='light'
                                                    size='sm'
                                                    className='login-btn-sign-in-up'
                                                    outline
                                                    style={{ marginTop: '2rem' }}
                                                    block
                                                >Change password</Button>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                    {/* </Card> */}
                                </Collapse>
                                <Collapse isOpened={this.state.finishedtoggle}>
                                    Password changed successfully
                                </Collapse>
                            </div>
                        </Row >
                    </Container>
                </ModalBody>
            </Fragment >
        );
    }
}

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
    msg: state.msg,
    twoFactorAuth: state.twoFactorAuthReducer
});

export default connect(
    mapStateToProps,
    { changePassByEmail, getUserByEmail, clearErrors, clearMsgs, CreateToken, VerifyToken }
)(RestPassword);