import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SetAttHeaderModal from './SetAttHeaderModal';
import SetBgImageModal from './SetBgImageModal';

class SiteSetting extends Component {

    static propTypes = {
        auth: PropTypes.object.isRequired,
        setting: PropTypes.object.isRequired
    }

    adminBtns = () => {
        return {
            display: 'flex',
            flexrap: 'wrap',
            marginLeft: '8px'
        }
    };
    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        return (
            <Fragment>
                {is_admin &&
                    <div style={this.adminBtns()}>
                        <SetAttHeaderModal />
                        <SetBgImageModal />
                    </div>
                }
            </Fragment>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    setting: state.setting
});
export default connect(
    mapStateToProps,
    {}
)(SiteSetting);
