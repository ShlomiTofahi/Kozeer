import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import ScrollToTop from './ScrollToTop';
// import AdminManage from './admin/AdminManage';
// import Products from './product/Products';
// import FileUpload from './fileupload/FileUpload';
// import ShowProfile from './profile/ShowProfile';
// import EditProfile from './profile/EditProfile';
// import Home from './home/Home';
import About from './About';
import MangaBook from './manga/MangaBook';
import Posts from './post/AllPosts';
import OnlyPosts from './post/OnlyPosts';
import Post from './post/Post';
import ShowMangas from './manga/ShowMangas';
import ShowProfile from './profile/ShowProfile';
import EditProfile from './profile/EditProfile';

// import Contact from './Contact';
// import Haircut from './Haircut';
// import Payment from './product/Payment';
// import Forum from './forum/Forum';
// import ForumPet from './forum/ForumPet';
// import RestPassword from './auth/RestPassword';
// import Post from './forum/Post';

class Main extends Component {

    static protoType = {
        auth: PropTypes.object,
        isAuthenticated: PropTypes.bool
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        // const is_admin = (isAuthenticated && user.admin);

        return (
            <main>
                <ScrollToTop />
                <Switch>
                    {/* <Route exact path='/' component={Home} />
                    <Route exact path='/admin' component={is_admin ? AdminManage : Home} />

                    <Route exact path='/profile' component={isAuthenticated ? ShowProfile : Home} />
                    <Route exact path='/profile/edit' component={isAuthenticated ? EditProfile : Home} />

                    <Route exact path='/products' component={Products} />
                    <Route exact path='/products/payment' component={Payment} />

                    <Route exact path='/forum' component={Forum} />
                    <Route exact path="/forum/:pet" component={Forum} />
                    <Route exact path="/forum/post/:id" component={Post} />

                    <Route exact path='/rest-pasword' component={RestPassword} />
                    <Route exact path='/contact' component={Contact} />
                    <Route exact path='/haircut' component={Haircut} />
                    <Route exact path='/FileUpload' component={FileUpload} /> */}
                    
                    {/* <Route exact path='/profile' component={isAuthenticated ? ShowProfile : Home} />
                    <Route exact path='/profile/edit' component={isAuthenticated ? EditProfile : Home} /> */}

                    <Route exact path='/' component={Posts} />
                    <Route exact path='/profile' component={isAuthenticated ? ShowProfile : Posts} />
                    <Route exact path='/profile/edit' component={isAuthenticated ? EditProfile : Posts} />
                    <Route exact path='/my-vision' component={About} />
                    <Route exact path='/manga' component={MangaBook} />
                    <Route exact path='/post' component={OnlyPosts} />
                    <Route exact path="/post/:id" component={Post} />
                    <Route exact path='/show-mangas' component={ShowMangas} />
                    {/* <Route exact path="/show-mangas/:id" component={Post} /> */}
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


