import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import {
    Card, CardBody, Button, Form, ModalBody,
    FormGroup, Label, Input, Alert, Row, Container
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
        msg: null
    };

    static protoType = {
        auth: PropTypes.object,
        error: PropTypes.object.isRequired,
        msg: PropTypes.object.isRequired,
        twoFactorAuth: PropTypes.object.isRequired,
        changePassByEmail: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired
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
                messageAlery: 'info',
            })
            this.ChgPassCollapseHangdle();
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
        const { validationPassword, password, email } = this.state;

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
        let id = ''
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

    bodyStyle = () => {
        return {
            border: '1px solid rgb(230, 230, 230)',
            webkitBorderRadius: '15px',
            mozBorderRadius: '15px',
            borderRadius: '15px',
            padding: '30px',
            height: 'auto',
            width: 'auto',
            margin: '0 auto',
            webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7',
        };
    };
    verifybodyStyle = () => {
        return {
            border: '1px solid rgb(230, 230, 230)',
            webkitBorderRadius: '15px',
            mozBorderRadius: '15px',
            borderRadius: '15px',
            padding: '30px',
            paddingBottom: '10px',
            paddingTop: '10px',
            height: 'auto',
            width: 'auto',
            margin: '0 auto',
            webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7',
        };
    };

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
                            <div className='position-relative mt-3 mb-5 pb-5 pt-5'>
                                {this.state.message ? <Alert color={this.state.messageAlery} isOpen={this.state.visible} toggle={this.onDismiss}>{this.state.message}</Alert>
                                    : null}
                                <Collapse isOpened={this.state.emailCollapsetoggle}>
                                    <Card style={this.bodyStyle()} className='animated bounceInLeft'>
                                        <CardBody className='pr-4'>
                                            <Row>
                                                <Label className='pl-2' for='email'>הכנס אמייל</Label>
                                                <Input
                                                    size='sm'
                                                    type='email'
                                                    name='email'
                                                    id='email'
                                                    className='mb-3'
                                                    onChange={this.onChange}
                                                    style={addPostInput}
                                                    block
                                                />
                                            </Row>
                                            <Button
                                                color='dark'
                                                size='sm'
                                                onClick={this.onClickEmail}
                                                style={{ marginTop: '2rem' }}
                                                block
                                            >אשר</Button>
                                        </CardBody>
                                    </Card>
                                </Collapse>

                                <Collapse isOpened={this.state.verifyCollapsetoggle}>
                                    <Card style={this.bodyStyle()}>
                                        <CardBody className='pr-4'>
                                            <Row>
                                                <Label className='pl-2' for='verificationCode'>קוד אימות</Label>
                                                <Input
                                                    size='sm'
                                                    type='text'
                                                    name='verificationCode'
                                                    id='verificationCode'
                                                    onChange={this.onChange}
                                                    style={addPostInput}
                                                    block
                                                />
                                            </Row>
                                            <Button
                                                color='light'
                                                size='sm'
                                                onClick={this.onClickEmail}
                                                className='badge badge-info ml-5'
                                            >שלח קוד אימות חדש</Button>
                                            <Button
                                                color='dark'
                                                size='sm'
                                                onClick={this.onClickVerify}
                                                style={{ marginTop: '2rem' }}
                                                block
                                            >אשר</Button>
                                        </CardBody>
                                    </Card>
                                </Collapse>

                                <Collapse isOpened={this.state.chgPassCollapsetoggle}>
                                    <Card style={this.verifybodyStyle()}>
                                        <CardBody className='pr-4'>
                                            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                                            <Form onSubmit={this.onSubmit}>
                                                <FormGroup>
                                                    <Row>
                                                        <Label className='pl-2' for='password'>סיסמא חדשה:&nbsp;</Label>
                                                        <Input
                                                            size='sm'
                                                            type='password'
                                                            name='password'
                                                            id='password'
                                                            className='mb-3'
                                                            onChange={this.onChange}
                                                            style={addPostInput}
                                                        />
                                                    </Row>
                                                    <Row>
                                                        <Label className='pl-2' for='validationPassword'>אימות סיסמא:&nbsp;</Label>
                                                        <Input
                                                            size='sm'
                                                            type='password'
                                                            name='validationPassword'
                                                            id='validationPassword'
                                                            className='mb-3'
                                                            onChange={this.onChange}
                                                            style={addPostInput}
                                                        />
                                                    </Row>

                                                    <Button
                                                        size='sm'
                                                        color='light'
                                                        style={{ marginTop: '2rem' }}
                                                        block
                                                    >החלף סיסמא</Button>
                                                </FormGroup>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </div>
                        </Row >
                    </Container>
                </ModalBody>

            </Fragment >
        );
    }
}

const addPostInput = {
    background: '#f7f7f7',
    width: window.innerWidth >= 463 ? '200px' : 'null',
    height: '24px'
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