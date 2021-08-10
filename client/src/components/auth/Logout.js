import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { logout } from '../../actions/authActions';

export class Logout extends Component {
    state = {
        hover: ""
    }
    static propTypes = {
        logout: PropTypes.func.isRequired,
        setting: PropTypes.object.isRequired
    };

    enterToggleHover = (hover) => {
        this.setState({
            hover
        });
    }

    leaveToggleHover = () => {
        this.setState({
            hover: ''
        });
    }

    navTextColorsStyle = () => {
        const { setting } = this.props.setting;
        let textColor = "#ffffff";
        if (setting && setting?.headerColorText !== null) {
            textColor = setting?.headerColorText;
        }

        if (this.state.hover !== '' && this.state.hover === "LOGOUT") {
            textColor = "#21201f";
            if (setting && setting?.headerHoverColorText !== null) {
                textColor = setting?.headerHoverColorText;
            }
        }

        return {
            color: textColor
        };
    };

    render() {

        const navLink = window.innerWidth < 992 ? 'nav-link' : '';

        return (
            <Fragment>
                <Link className={'navlink header-tablinks px-3 px-md-4 px-lg-5 d-md-inline-block no-outline ' + navLink}
                    onClick={this.props.logout} to='#'
                    style={this.navTextColorsStyle()}
                    onMouseEnter={this.enterToggleHover.bind(this, "LOGOUT")}
                    onMouseLeave={this.leaveToggleHover}>LOGOUT</Link>
            </Fragment>
        )
    };
}

const mapStateToProps = state => ({
    setting: state.setting
});

export default connect
    (mapStateToProps,
        { logout }
    )(Logout);