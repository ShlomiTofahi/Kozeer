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
import Over13 from './components/Over13';
import ScrollUpButton from "react-scroll-up-button";

class App extends Component {
  state = {
    over13: false
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  onOver13Click = () => {
    this.setState({
      over13: !this.state.over13
    })
  }

  render() {

    return (
      <Provider store={store}>
        {
          !this.state.over13 ?
            <Over13  onOver13Click={this.onOver13Click} />
            :
            <div className="App" style={bgStyle}>
              <BrowserRouter>
                <AppNavbar />
                <Main />
                <ScrollUpButton />
                <Footer />
              </BrowserRouter>
            </div>
        }
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
