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
                    <Row style={FrameStyle}>
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

const FrameStyle = {
    textAlign:'center',
    // margin: '0 auto',
    backgroundColor: '#221415dc',
    // width: '65%',
};

export default EditProfile;