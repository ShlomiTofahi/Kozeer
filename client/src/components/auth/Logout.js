import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { logout } from '../../actions/authActions';

export class Logout extends Component {

    static propTypes ={
        logout: PropTypes.func.isRequired
    };

    render() {
        return (
            <Fragment>
                <Link className={'navlink header-tablinks py-2 px-5 nav-link d-md-inline-block'} onClick={ this.props.logout } to='#'>LOGOUT</Link>
            </Fragment>
        )
    };
}

export default connect
(null,
{ logout }    
)(Logout);