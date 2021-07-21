import React, { Component } from 'react'
import { Button } from 'reactstrap';

export default class About extends Component {
    state = {
        path: "/images/header/"
    }


    aboutStyle = () => {
        return {
            WebkitBorderRadius: '10px',
            MozBorderRadius: '10px',
            borderRadius: '10px',
            margin: '0',
            // position: 'absolute',
            paddingTop: '10%',
            backgroundColor: '#323232',
            color: 'white',
            // width: '50%',
        };
    };
    render() {
        return (
            <div align='center' className="wrapper animated bounceInLeft" style={bgStyle}>
                {/* <div style={this.aboutStyle()}> */}
                    <legend>
                        <h2 className='brand display-4 pt-4' style={window.innerWidth >= 992 ? { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4' } : { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', fontSize: '2.0em' }}>
                            OVER 13?
                        </h2>
                    </legend>
                    <p className='lead p-5'>
                        this site containe sensitive content
                    </p>
                    <Button
                        color='info'
                        size='sm'
                        onClick={this.props.onOver13Click}
                    >yes i'm over 13</Button>
                {/* </div> */}
            </div>
        )
    }
}

const bgStyle = {
    backgroundImage: `url(/images/main/bg.png)`,
    // backgroundAttachment: 'fixed',
    // backgroundSize: 'contain',
    // backgroundPosition: 'bottom left',
    // display:'absolute',
    // minheight: '100%',
    // minWidth: '1024px',
      
    /* Set up proportionate scaling */
    width: '100%',
    height: 'auto',
      
    /* Set up positioning */
    position: 'fixed',
    top: '0',
    left: '0'
  }