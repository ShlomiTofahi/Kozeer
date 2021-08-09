import React, { Component } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addSubscribe } from '../../src/actions/subscribeActions';

class Footer extends Component {
    state = {
        subscribefadeIn: false,
        email: ''
    }

    static propTypes = {
        addSubscribe: PropTypes.func.isRequired
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    subscribe = e => {
        e.preventDefault();
        var subtxt = document.getElementById("submited");
        subtxt.innerHTML = 'Thanks for submitting!';
        window.setTimeout(this.fadeout, 2000);
        this.props.addSubscribe(this.state.email)
    }

    fadeout = () => {
        var subtxt = document.getElementById("submited");
        subtxt.innerHTML = '';
    }

    shdowStyle = () => {
        return {
            borderTop: '1px solid #C0CFD6',
            background: 'linear-gradient(to top, #103e53, #21495d, #2f5568, #3d6172, #4b6d7d)',
            WebkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7'
        };
    };
    render() {
        return (
            <footer style={this.shdowStyle()} className="text-lg-start mt-5">
                <div className="container p-4">
                    <div className={window.innerWidth >= 576 ? "row offset-2" : "row"}>
                        <div className="col-lg-6 col-md-6 mb-4 mb-md-0">
                            <ul className="list-unstyled  mb-0 pt-1">
                                <li className='mb-4'>
                                    <h5 style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", fontSize: '28px', color: 'red', WebkitTextStroke: '0.00001px #252525 ' }}><strong>WARNING</strong></h5>
                                    <p style={{ color: '#b9b9b9', WebkitTextStroke: '0.1px #252525' }}><small>The manga is for ages 13+, it has violent content<br /> and is not for children, the responsibility is on the viewer!</small></p>
                                </li>
                                <li className='mb-1'>
                                    <h5 style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", color: 'white' }}>CONTACT US</h5>
                                    <a href="mailto: topdogs5551@gmail.com" className='contact-btn'>
                                        <span style={{ fontFamily: "'Ubuntu Mono', Dalton Maag" }} className='pr-1'>mail: kozeer2122@gmail.com</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-6 col-md-6 mb-4 mb-md-0">
                            <ul className="list-unstyled  mb-0 pt-1">
                                <li className='mb-1'>
                                    <h6 style={{ fontFamily: "'Shadows Into Light', Kimberly Geswein", color: 'white' }} className="text-uppercase">follow us</h6>
                                    <a className='contact-btn' href='https://www.instagram.com/topdogs101010' target="_blank" rel="noreferrer" >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-instagram mb-3" viewBox="0 0 16 16">
                                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                                        </svg>
                                    </a>
                                </li>
                                <li className='mb-1'>
                                    <Form
                                    //  onSubmit={this.onSubmit}
                                    >
                                        <FormGroup>
                                            <div align='left' style={{ maxWidth: '300px' }}>
                                                <Input
                                                    type='email'
                                                    name='email'
                                                    id='email'
                                                    placeholder='Enter your email here*'
                                                    onChange={this.onChange}
                                                    bsSize="sm"
                                                    style={subscribeInputStyle}
                                                />
                                                <Button
                                                    size="sm"
                                                    color='dark'
                                                    style={subscribeBtnStyle}
                                                    onClick={this.subscribe}
                                                    block
                                                ><small>Subscribe Now</small>
                                                </Button>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                    {/* <Collapse isOpen={this.state.subscribefadeIn}> */}
                                    <span id='submited' style={{ color: 'white', opacity: '0.7' }}></span>

                                    {/* </Collapse> */}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="text-center p-1">
                    <a style={{ color: '#d1ceba' }} href="https://www.linkedin.com/in/shlomi-tofahi-57316417b/" target="_blank" rel="noreferrer" ><small>Copyright © 2021 Shlomi Tofahi - All Rights Reserved</small></a>
                </div>
            </footer>
        );
    }
}

const subscribeBtnStyle = {
    backgroundColor: '#5e8f86',
    borderRadius: '1px',
    marginTop: '0.3rem'
};

const subscribeInputStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: '1px',
    marginTop: '0.3rem'
};

const mapStateToProps = state => ({
    post: state.post,
    comment: state.comment,
    auth: state.auth,
});


// export default Footer
export default connect(
    mapStateToProps,
    { addSubscribe }
)(Footer);
