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

        const navLink = window.innerWidth <= 575 ? 'nav-link' : '';

        return (
            <Fragment>
                <Link className={'navlink header-tablinks px-5 d-md-inline-block' + navLink} onClick={ this.props.logout } to='#'>LOGOUT</Link>
            </Fragment>
        )
    };
}

export default connect
(null,
{ logout }    
)(Logout);