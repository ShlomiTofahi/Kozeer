import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'
import { loadUser } from './actions/authActions'

import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import Main from './components/Main';
import PostSuggestions from './components/post/PostSuggestions'


class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {

    return (
      <Provider store={store}>
        <div className="App" style={bgStyle}>
          <BrowserRouter>
            <AppNavbar />
            {/* <PostSuggestions /> */}

            <Main />
            <Footer />
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

const bgStyle = {
  backgroundImage: `url(/images/main/bg.png)`,
  backgroundAttachment: 'fixed',
  backgroundSize: 'contain',
  backgroundPosition: 'bottom left',
}

export default App;
