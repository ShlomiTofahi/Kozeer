import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import {
    Card, CardBody, Button, Form, FormGroup, Input, Alert
} from 'reactstrap';

import { changeEmail } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';

class ChangeEmail extends Component {
    state = {
        Collapsetoggle: false,
        message: '',
        visible: true,

        password: '',
        email: '',

        msg: null,
        msgAlert: ''
    };

    static protoType = {
        auth: PropTypes.object,
        msg: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        changeEmail: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
    }

    componentDidUpdate(prevProps) {
        const { error, msg } = this.props;
        if (error !== prevProps.error) {
            if (error.id === 'CHANGE_EMAIL_FAIL') {
                this.setState({
                    msg: error.msg,
                    msgAlert: 'danger'
                });
            } else {
                this.setState({ msg: null });
            }
        }

        if (msg && msg.id === 'CHANGE_EMAIL_SUCCESS') {
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
        const { password, email } = this.state;
        const id = this.props.auth.user._id;

        const data = {
            email,
            password
        };

        // Attempt to change
        this.props.changeEmail(id, data);
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
                        style={{ marginBottom: '1rem', opacity: '0.9' }}
                    >Change email<strong className='pr-3' style={{ position: 'absolute', right: '0' }}>{dropDownSymbol}</strong></Button>
                    <Collapse isOpened={this.state.Collapsetoggle}>
                        <Card style={bodyStyle}>
                            <CardBody className='mx-4 mt-3'>
                                {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                                <Form onSubmit={this.onSubmit}>
                                    <FormGroup>
                                        <Input
                                            size='sm'
                                            type='password'
                                            name='password'
                                            id='password'
                                            placeholder='Password'
                                            className='mb-4'
                                            onChange={this.onChange}
                                            style={inputStyle}
                                        />
                                        <Input
                                            size='sm'
                                            type='email'
                                            name='email'
                                            id='email'
                                            placeholder='Email'
                                            className='mb-4'
                                            onChange={this.onChange}
                                            style={inputStyle}
                                        />
                                        <Button
                                            size='sm'
                                            color='light'
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

const bodyStyle = {
    height: 'auto',
    width: 'auto',
    border: '5px solid #730104'
};
const inputStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    border: 'none',
    borderBottom: '1px solid #76735c',
    borderRadius: '1px',
    marginTop: '-9px'
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { changeEmail, clearErrors, clearMsgs }
)(ChangeEmail);