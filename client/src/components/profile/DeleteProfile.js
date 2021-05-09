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
        confirm:false,
        path: '/uploads/users/',
        redirect: null,

        Collapsetoggle: false,
        visible: true,

        msg: null,
        msgAlert:''
    };

    static protoType = {
        auth: PropTypes.object,
        msg: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        deleteUser: PropTypes.func.isRequired,
        logout: PropTypes.func.isRequired
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();
         const { confirm } = this.state;
        const { user } = this.props.auth;

        if(confirm){
            this.props.deleteUser(user.id);
            this.props.logout();
            const noImageFullpath = this.state.path + 'no-image.png';
            const filepath = user.petImage;
            if (filepath !== '' && filepath != noImageFullpath) {
                const formData = new FormData();
                formData.append('filepath', filepath);
                formData.append('abspath', this.state.path);
        
                axios.post('/remove', formData);
            }
            this.setState({ redirect: '/' });

        } else {
            this.setState({
                msg: 'אנא אשר כדי למחוק את הפרופיל',
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
        const { user } = this.props.auth;

        return (
            <Fragment >

                <div className='position-relative mt-5 mr-4'>
                    {/* {this.state.msg ? <Alert color={this.state.msgAlert} isOpen={this.state.visible} toggle={this.onDismiss}>{this.state.msg}</Alert>
                        : null} */}

                    <Button
                        block
                        color='danger'
                        size='sm'
                        onClick={this.CollapseHangdle}
                        style={{ marginBottom: '1rem' }}
                    >מחק פרופיל<strong class='pl-3' style={{ position: 'absolute', left: '0' }}>{dropDownSymbol}</strong></Button>
                    <Collapse isOpened={this.state.Collapsetoggle}>
                        <Card style={this.bodyStyle()} align="right">
                            <CardBody className='pr-4 mr-5'>
                                {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                                <Form onSubmit={this.onSubmit}>
                                    <FormGroup>
                                        <Row>
                                        <label class="checkbox_item">
                                        <input class="ml-2" onChange={this.confirmHangdle} type="checkbox" name="confirm" data-tax="level" defaultValue={true} />
                                        <span>אני מאשר</span>
                                    </label>
                                        </Row>
                                        <Button
                                            size='sm'
                                            color='light'
                                            style={{ marginTop: '2rem' }}
                                            block
                                        >מחק</Button>
                                    </FormGroup>
                                </Form>
                            </CardBody>
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

const mapStateToProps = (state) => ({
    auth: state.auth,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { deleteUser, logout }
)(DeleteProfile);