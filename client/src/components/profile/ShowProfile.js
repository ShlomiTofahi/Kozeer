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
                    <div style={FrameStyle}>

                        <div align="center" className='position-relative mt-4 py-4'>
                            <Card style={bodyStyle}>
                                <div class="items-image pt-1" >
                                    <CardImg bottom className='profile-img' src={user.profileImage} alt="Profile image" />
                                </div>
                                <CardBody>
                                    <CardTitle className={'mb-2 lead'} tag="h5" style={{ display: 'inline' }}>Personal Details</CardTitle>
                                    <Link className='badge badge-pill badge-secondary mb-3 mr-1 ml-1' to='/profile/edit'>Edit</Link>
                                    <CardSubtitle tag="h6" className="mb-2 text-muted"><spen style={{ color: 'black' }}>Name:</spen> {user.name}</CardSubtitle>
                                    <CardSubtitle tag="h6" className="mb-2 text-muted"><spen style={{ color: 'black' }}>Email:</spen> {user.email}</CardSubtitle>
                                    <CardText>
                                        <small className="text-muted">Register Date : {moment(user.register_date).format('llll')}</small>
                                    </CardText>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Container>
            </Fragment>
        );
    }
}

const bodyStyle = {
    maxWidth: '320px',
    border: '5px solid #730104'

    // border: '1px solid rgb(230, 230, 230)',
    // webkitBorderRadius: '15px',
    // mozBorderRadius: '15px',
    // borderRadius: '15px',
    // padding: '30px',
    // height: 'auto',
    // webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
    // boxSshadow: '0 0 5px 0.1px #C7C7C7',
    // maxWidth:'1000px'
};

const FrameStyle = {
    margin: '0 auto',
    backgroundColor: '#221415dc',
    width: '65%',
};


const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { loadUser }
)(ShowProfile);