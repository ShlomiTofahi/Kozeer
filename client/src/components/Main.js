import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import ScrollToTop from './ScrollToTop';
import About from './About';
import MangaBook from './manga/MangaBook';
import CharacterSwiper from './character/CharacterSwiper';
import Posts from './post/AllPosts';
import OnlyPosts from './post/OnlyPosts';
import Post from './post/Post';
import ShowMangas from './manga/ShowMangas';
import ShowProfile from './profile/ShowProfile';
import EditProfile from './profile/EditProfile';

class Main extends Component {

    static protoType = {
        auth: PropTypes.object,
        isAuthenticated: PropTypes.bool
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const is_admin = (isAuthenticated && user.admin);

        return (
            <main>
                <ScrollToTop />
                <Switch>
                    <Route exact path='/' component={Posts} />
                    <Route exact path='/profile' component={isAuthenticated ? ShowProfile : Posts} />
                    <Route exact path='/profile/edit' component={isAuthenticated ? EditProfile : Posts} />
                    <Route exact path='/my-vision' component={About} />
                    <Route exact path='/manga' component={MangaBook} />
                    <Route exact path='/post' component={OnlyPosts} />
                    <Route exact path="/post/:id" component={Post} />
                    <Route exact path='/character' component={CharacterSwiper} />
                    <Route exact path='/show-mangas' component={is_admin ? ShowMangas : MangaBook} />
                </Switch>
            </main>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    isAuthenticated: state.auth.isAuthenticated
});
// export default Main;
export default connect(
    mapStateToProps,
    {}
)(Main);


