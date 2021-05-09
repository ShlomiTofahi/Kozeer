import React, { Component } from 'react'

export default class About extends Component {

    aboutStyle = () => {
        return {
            WebkitBorderRadius: '10px',
            MozBorderRadius: '10px',
            borderRadius: '10px',
            margin: '0 auto',
            backgroundColor: '#323232',
            color: 'white',
            width: '50%',
        };
    };
    render() {
        return (
            <div className="wrapper animated bounceInLeft">
                <div style={this.aboutStyle()}>
                    <legend align='center'>
                        <h2 className='brand display-4 pt-4 pb-5' style={window.innerWidth >= 992 ? { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4' } : { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', fontSize: '2.0em' }}>
                            MANGA CHAPTERS
                        </h2>
                    </legend>
                    <div className='lead pl-5'>
                        <p>
                            CHAPTER 1 - THE EXPERIMENT
                            <br />
                        <a className='login-btn' href='https://drive.google.com/drive/folders/1JeQhtu-jH63ajoZYUjzAmFE2uOV62pAy'>
                            link 1
                        </a>
                        <br /><br />
                            CHAPTER 2 - NEW WORLD
                        <br />
                        <a className='login-btn' href='https://drive.google.com/drive/folders/1sSxAAmFnCeRy6I3B3gsFf29qfkgd3PMp'>
                            link 2
                        </a>
                        <br /><br />
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}