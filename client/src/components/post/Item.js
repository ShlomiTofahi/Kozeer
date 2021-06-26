import React, { Component, Fragment } from 'react';
import {
    Card, Button, CardTitle, CardText, CardBody, CardImg, Col,Row
,    CardFooter
} from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getPosts } from '../../actions/postActions';

class Item extends Component {
    state = {
        path: '/uploads/items/',
    };

    static protoType = {
        post: PropTypes.object,
        getPosts: PropTypes.func.isRequired,
        auth: PropTypes.object
    }


    componentDidMount() {
        this.props.getPosts();
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        // const is_admin = (isAuthenticated && user.admin);
        const { posts } = this.props.post;
        console.log(posts)
        // const { _id, name, price, age, category, discount, itemImage, pet, breed, weight, rating, views } = this.props;
        return (

            <Fragment>
                                            <Row>

                {posts && posts.map(({ _id, title, body, published_date, views, comments, user, postImage, loved, is_manga, mangas }) => (
                    <CSSTransition
                        //  key={_id}
                        timeout={500} classNames='fade'>
                        <Col xs="12" sm="6" md="4" className='pt-4' >
                            <div className='position-relative'>
                                <Card className={['products']} align="right" timeout={500}
                                    style={{
                                        maxHeight: "500px", minHeight: "400px",
                                    }}
                                >
                                    <CardBody>
                                        <div class="items-image" align="center">
                                            <CardImg bottom className='ProductImg' src={postImage} alt="תמונה חיית מחמד" />
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </Col>
                    </CSSTransition>
                ))}
                                            </Row>

            </Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    auth: state.auth,
    post: state.post
});

export default connect(
    mapStateToProps,
    { getPosts }
)(Item);