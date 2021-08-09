import React, { Component, Fragment } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { editSetting } from '../actions/settingActions';
import { clearErrors } from '../actions/errorActions';
import { clearMsgs } from '../actions/msgActions';

class SetMyVisionModal extends Component {
    state = {
        modal: false,

        myVision: '',
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
            myVision: setting.myVision
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
            if (msg && msg.id === 'EDIT_SETTINGS_SUCCESS') {
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
            myVision: this.state.myVision
        }
        // edit setting via newSetting action
        this.props.editSetting(newSetting);
    }

    handleKeyDown(e) {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`; 
        // In case you have a limitation
        // e.target.style.height = `${Math.min(e.target.scrollHeight, limit)}px`;
      }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        return (
            <Fragment>
                {is_admin ?
                    <Link className={'login-btn ml-5 d-block d-sm-inline'} onClick={this.toggle} to='#'>
                        Edit Cover Book Image
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
                                <small className='pt-3' style={{ color: '#76735c' }}><Label>My vision:</Label></small>
                                <textarea style={{ width: "100%" }} onChange={this.onChange} name="myVision" value={this.state.myVision} onKeyDown={this.handleKeyDown}></textarea>

                                <Button
                                    className='green-style-btn mt-4'
                                    size="sm"
                                    color='dark'
                                    style={{ marginTop: '2rem' }}
                                    block
                                >Save</Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </Fragment>
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
)(SetMyVisionModal);