import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    Card, CardImg, CardText, CardBody, Container, CardTitle, CardSubtitle
} from 'reactstrap';
import moment from 'moment';

import { loadUser } from '../../actions/authActions'

class ShowProfile extends Component {

    static protoType = {
        auth: PropTypes.object,
        loadUser: PropTypes.func.isRequired
    }

    frameStyle = () => {
        return {
            border: '1px solid rgb(230, 230, 230)',
            borderRadius: '5%',
            marginTop: '5px',
            padding: '5px',
            webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7'
        };
    };
    bodyStyle = () => {
        return {
            border: '1px solid rgb(230, 230, 230)',
            webkitBorderRadius: '15px',
            mozBorderRadius: '15px',
            borderRadius: '15px',
            padding: '30px',
            height: 'auto',
            webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7',
            // maxWidth:'1000px'
        };
    };

    render() {
        const { user } = this.props.auth;

        return (
            <Fragment >
                <Container className='mb-5'>
                    <div className='position-relative mt-4'>
                        <Card style={this.bodyStyle()} align="right">
                            <div class="items-image pt-4" align="center">
                                <CardImg bottom className='ProductImg' src={user.petImage} alt="תמונה חיית מחמד" />
                            </div>
                            <CardBody className='pr-4 mr-5'>
                                <CardTitle className={'mb-2 lead'} tag="h5" style={{ display: 'inline' }}>פרטים אישיים</CardTitle>
                                <Link className='badge badge-pill badge-secondary mb-3 mr-1' to='/profile/edit'>עריכה</Link>
                                <CardSubtitle tag="h6" className="mb-2 text-muted"><spen style={{ color: 'black' }}>שם:</spen> {user.name}</CardSubtitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted"><spen style={{ color: 'black' }}>אמייל:</spen> {user.email}</CardSubtitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted"><spen style={{ color: 'black' }}>טלפון:</spen> {user.cellphone}</CardSubtitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted"><spen style={{ color: 'black' }}>חיית מחמד:</spen> {user.pet.name}</CardSubtitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted"><spen style={{ color: 'black' }}>גזע:</spen> {user.breed.name}</CardSubtitle>
                                <CardText>
                                    <small className="text-muted">תאריך הרשמה: {moment(user.register_date).format('DD/MM/YYYY')}</small>
                                </CardText>
                            </CardBody>
                        </Card>
                    </div>
                </Container>
            </Fragment>
        );
    }
}



const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { loadUser }
)(ShowProfile);