import React, { Component, Fragment } from 'react'
import { Button } from 'reactstrap';

export default class About extends Component {
    state = {
        path: "/images/header/"
    }

    render() {
        return (
            <Fragment>
                <div align='center' className="wrapper animated bounceInLeft" style={bgStyle}></div>
                <div style={bodyStyle}>
                    <legend>
                        <h2 className='brand display-4 pt-4' style={window.innerWidth >= 992 ? { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4' } : { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', fontSize: '2.0em' }}>
                            OVER 13?
                        </h2>
                    </legend>
                    <p className='lead p-5'>
                        This site contain sensitive content
                    </p>
                    <Button
                        className='mb-4'
                        color='info'
                        size='sm'
                        onClick={this.props.onOver13Click}
                    >yes i'm over 13</Button>
                </div>
            </Fragment>
        )
    }
}

const bgStyle = {
    backgroundImage: `url(/images/main/13page.jpg)`,
    paddingTop: "10%",
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom left',
    backgroundRepeat: 'no-repeat',
    filter: 'blur(4px)',
    height: '721px'
}

const bodyStyle = {
    backgroundColor: 'rgb(0,0,0)',
    backgroundColor: 'rgba(0,0,0, 0.4)',
    color: 'white',
    fontWeight: 'bold',
    border: ' 3px solid #f1f1f1',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: ' translate(-50%, -50%)',
    zIndex: '2',
    width: '50%',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, Helvetica, sans-serif'
}