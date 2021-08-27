import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'
import { loadUser } from './actions/authActions'
import { loadSetting } from './actions/settingActions'

import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import Main from './components/Main';
import Over13 from './components/Over13';
import SiteSetting from './components/setting/SiteSetting';
import ScrollUpButton from "react-scroll-up-button";

class App extends Component {
  state = {
    over13: false
  };

  componentDidMount() {
    store.dispatch(loadUser());
    store.dispatch(loadSetting());
  }

  onOver13Click = () => {
    this.setState({
      over13: !this.state.over13
    })
  }

  bgStyle = () => {
    let backgroundImage = `url(/images/main/bg.png)`;
    const { setting } = store.getState().setting;
    if (setting && setting?.bgImage) {
      backgroundImage = `url(${setting?.bgImage})`;
    }

    return {
      backgroundImage: backgroundImage,
      backgroundAttachment: 'fixed',
      backgroundSize: 'contain',
      backgroundPosition: 'bottom left',
    };
  };

  render() {
    return (
      <Provider store={store}>
        {
          !this.state.over13 ?
            <Over13 onOver13Click={this.onOver13Click} />
            :
            <div className="App" style={this.bgStyle()}>
              <BrowserRouter>
                <AppNavbar />
                <SiteSetting />
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

export default App;
