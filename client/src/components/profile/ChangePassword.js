import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import {
    Card, CardBody, Button, Form,
     FormGroup, Label, Input, Alert, Row
} from 'reactstrap';

import { changePassword } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

class ChangePassword extends Component {
    state = {
        Collapsetoggle: false,
        message: '',
        visible: true,

        currentPassword: '',
        password: '',
        validationPassword: '',

        msg: null,
        msgAlert:''
    };

    static protoType = {
        auth: PropTypes.object,
        msg: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        changePassword: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'CHANGE_PASSWORD_FAIL') {
                this.setState({
                    msg: error.msg,
                    msgAlert: 'danger'
                });
            } else {
                this.setState({ msg: null });
            }
        }

        if (msg && msg.id === 'CHANGE_PASSWORD_SUCCESS') {
            this.setState({
                message: msg.msg,
                msgAlert: 'info',
                visible: true,
                Collapsetoggle: false
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
        const { validationPassword, password, currentPassword } = this.state;
        const id = this.props.auth.user._id;

        const data = {
            currentPassword,
            validationPassword,
            password
        };

        // Attempt to change
        this.props.changePassword(id, data);
    }

    CollapseHangdle = () => {
        this.setState({
            Collapsetoggle: !this.state.Collapsetoggle
        })
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

            webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7'
        };
    };

    render() {
        const dropDownSymbol = this.state.Collapsetoggle ? <span>&#45;</span> : <span>&#x2B;</span>

        return (
            <Fragment >

                <div className='position-relative mt-5 mr-4'>
                    {this.state.message ? <Alert color={this.state.msgAlert} isOpen={this.state.visible} toggle={this.onDismiss}>{this.state.message}</Alert>
                        : null}

                    <Button
                        block
                        size='sm'
                        onClick={this.CollapseHangdle}
                        style={{ marginBottom: '1rem' }}
                    >Change password<strong class='pl-3' style={{ position: 'absolute', left: '0' }}>{dropDownSymbol}</strong></Button>
                    <Collapse isOpened={this.state.Collapsetoggle}>
                        <Card style={this.bodyStyle()} align="right">
                            {/* <CardTitle className={'mr-5 mb-2 lead'} tag="h5" style={{ display: 'inline' }}>עריכת סיסמא</CardTitle> */}


                            <CardBody className='pr-4 mr-5'>
                                {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                                <Form onSubmit={this.onSubmit}>
                                    <FormGroup>
                                        <Row>
                                            <Label className='pl-2' for='currentPassword'>Current pass:</Label>
                                            <Input
                                                size='sm'
                                                type='password'
                                                name='currentPassword'
                                                id='currentPassword'
                                                className='mb-3'
                                                onChange={this.onChange}
                                                style={addPostInput}
                                            />
                                        </Row>
                                        <Row>
                                            <Label className='pl-2' for='password'>New pass:&nbsp;</Label>
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
                                            <Label className='pl-2' for='validationPassword'>Confirm Pass:&nbsp;</Label>
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
                                        >Save the changes</Button>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Collapse>
                </div>

            </Fragment>
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
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { changePassword, clearErrors, clearMsgs }
)(ChangePassword);