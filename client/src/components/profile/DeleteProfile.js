import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import {
    Card, CardBody, Button, Form, FormGroup, Alert, Row
} from 'reactstrap';

import { deleteUser, logout } from '../../actions/authActions';

class DeleteProfile extends Component {
    state = {
        confirm: false,
        path: '/uploads/users/',
        redirect: null,

        Collapsetoggle: false,
        visible: true,

        msg: null,
        msgAlert: '',

        profileImage:''
    };

    static protoType = {
        auth: PropTypes.object,
        msg: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        deleteUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps) {
        const { msg } = this.props;

        if (msg && msg.id === 'DELETE_USER_SUCCESS') {
            const noImageFullpath = this.state.path + 'no-image.png';
            const filepath = this.state.profileImage;
            if (filepath !== '' && filepath !== noImageFullpath) {
                const formData = new FormData();
                formData.append('filepath', filepath);
                console.log("*remove DeleteProfile");
                axios.post('/remove', formData);
            }
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();
        const { confirm } = this.state;
        const { user } = this.props.auth;

        if (confirm) {
            this.setState({profileImage:user.profileImage})
            this.props.deleteUser(user.id);
            this.props.logout();
            // const noImageFullpath = this.state.path + 'no-image.png';
            // const filepath = user.profileImage;
            // if (filepath !== '' && filepath !== noImageFullpath) {
            //     const formData = new FormData();
            //     formData.append('filepath', filepath);

            //     console.log("*remove DeleteProfile");
            //     axios.post('/remove', formData);
            // }
            this.setState({ redirect: '/' });

        } else {
            this.setState({
                msg: 'Please confirm to delete the profile',
                msgAlert: 'danger'
            })
        }
    }

    CollapseHangdle = () => {
        this.setState({
            Collapsetoggle: !this.state.Collapsetoggle
        })
    }

    confirmHangdle = () => {
        this.setState({
            confirm: !this.state.confirm
        })
    }

    onDismiss = () => {
        this.setState({
            visible: false
        })
    }

    render() {
        const dropDownSymbol = this.state.Collapsetoggle ? <span>&#45;</span> : <span>&#x2B;</span>
        const { user, isAuthenticated } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        return (
            <Fragment >
                <div className='position-relative mt-5 mr-4'>
                    <Button
                        block
                        color='danger'
                        size='sm'
                        onClick={this.CollapseHangdle}
                        style={{ marginBottom: '1rem', opacity: '0.9' }}
                    >Delete profile<strong className='pr-3' style={{ position: 'absolute', right: '0' }}>{dropDownSymbol}</strong></Button>
                    <Collapse isOpened={this.state.Collapsetoggle}>
                        <Card style={bodyStyle}>
                            {!is_admin ?
                                <CardBody className='mx-4'>
                                    {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                                    <Form onSubmit={this.onSubmit}>
                                        <FormGroup>
                                            <Row>
                                                <label className="checkbox_item">
                                                    <input className="ml-2" onChange={this.confirmHangdle} type="checkbox" name="confirm" data-tax="level" defaultValue={true} />
                                                    <span> Confirm</span>
                                                </label>
                                            </Row>
                                            <Button
                                                size='sm'
                                                color='light'
                                                className='mt-3'
                                                block
                                            >Delete</Button>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                                : <span className='mx-4 my-4 text-center'>Unable to delete admin user</span>
                            }
                        </Card>
                    </Collapse>
                </div>

                {this.state.redirect &&
                    <Redirect exact from='/profile/edit' to={this.state.redirect} />
                }
            </Fragment>
        );
    }
}

const bodyStyle = {
    height: 'auto',
    width: 'auto',
    border: '5px solid #730104',
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { deleteUser, logout }
)(DeleteProfile);