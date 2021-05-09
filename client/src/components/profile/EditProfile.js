import React, { Component, Fragment } from 'react';
import {
     Container, Row, Col
} from 'reactstrap';

import ChangePassword from './ChangePassword';
import ChangeUserInfo from './ChangeUserInfo';
import ChangeEmail from './ChangeEmail';
import DeleteProfile from './DeleteProfile';

class EditProfile extends Component {

    render() {
        return (
            <Fragment >
                <Container className='mb-5'>
                    <Row >
                        <ChangeUserInfo />
                        <div>
                            <Col>
                                <ChangePassword />
                            </Col>
                            <Col>
                                <ChangeEmail />
                            </Col>
                            <Col>
                                <DeleteProfile />
                            </Col>
                        </div>
                    </Row>
                </Container>
            </Fragment>
        );
    }
}

export default EditProfile;