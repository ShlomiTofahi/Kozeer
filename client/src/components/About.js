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
                        <h2 className='brand display-4 pt-4' style={window.innerWidth >= 992 ? { fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4' } : {fontFamily: "'Shadows Into Light', Kimberly Geswein", opacity: '0.4', fontSize: '2.0em' }}>
                            MY VISION
                        </h2>
                    </legend>
                    <p className='lead p-5'>
                        Hello everyone,
                        My name is David Shmuelov and I am the creator of the story.
                            <br /><br />

                            So how did it all start?
                            You could say it all started since I was little and I discovered the anime and fell in love straight,
                            After growing a bit, passionate for anime only rise, and of course it went into manga as well,
                            And I've always wanted to create manga from my perspective, and everyone would see the world that only I saw in my mind but didn't know what to do with it.
                            <br /><br />

                            Two years ago, I saw an article about a competition for young filmmakers and it gave me the motivation and desire to take my dream one step further.
                            I contacted the artist Nissim Aharonov and together we started working on the manga so that it comes out of the highest quality.
                            <br /><br />

                            And today after a lot of time and work we feel confident enough in our work to publish it to you,
                            I hope you enjoy it like we do.
                        </p>
                </div>
            </div>
        )
    }
}