import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Card, CardBody, Fade, CardTitle, Button, Container, Form, FormGroup, Label,
    Input, Alert, ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle
} from 'reactstrap';
import { Redirect } from "react-router-dom";
import axios from 'axios';

import { edit } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { clearMsgs } from '../../actions/msgActions';
import { getPet } from '../../actions/petActions';

import FileUpload from '../fileupload/FileUpload';
import ChangePassword from './ChangePassword';

class ChangeUserInfo extends Component {
    state = {
        path: '/uploads/users/',

        name: '',
        pet: '',
        breed: '',
        cellphone: '',
        petImage: '',
        email: '',
        password: '',

        dropDownValue: 'Select pet',
        dropDownOpen: false,
        currency: '',
        msg: null,
        file: null,
        redirect: null,

        fadeIn: true,
        removeImagefadeIn: false,
        prevPetImage: '',
        imageSubmited: false,
        removedOrginalImageAndNotSave: false,
    };

    static protoType = {
        auth: PropTypes.object,
        pet: PropTypes.object.isRequired,
        error: PropTypes.object.isRequired,
        edit: PropTypes.func.isRequired,
        clearErrors: PropTypes.func.isRequired,
        clearMsgs: PropTypes.func.isRequired,
        getPet: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { user } = this.props.auth;
        this.setState({
            name: user.name,
            breed: user.breed.name,
            pet: user.pet.name,
            cellphone: user.cellphone,
            petImage: user.petImage,
            email: user.email,
            prevPetImage: user.petImage

        });

        if (this.state.prevPetImage != '')
            this.setState({ prevPetImage: user.petImage });
    }

    componentDidUpdate(prevProps) {
        const { error, msg, isAuthenticated } = this.props;
        if (error !== prevProps.error) {
            // Check for register error
            if (error.id === 'EDIT_USER_FAIL') {
                this.setState({
                    msg: error.msg,
                    redirect: null
                });
            } else {
                this.setState({ msg: null });
            }
        }

        //If edited, close modal
        if (!this.state.removedOrginalImageAndNotSave && msg && msg.id === 'EDIT_USER_SUCCESS') {
            this.setState({ redirect: '/profile' });

            // Clear errors
            this.props.clearErrors();
            // Clear msgs
            this.props.clearMsgs();
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = e => {
        e.preventDefault();
        const { name, pet, breed, email, cellphone, petImage, password } = this.state;
        const id = this.props.auth.user._id;

        // Create user object
        const NewUser = {
            name,
            pet,
            breed,
            cellphone,
            petImage,
            email,
            password
        };

        // Attempt to edit
        this.props.edit(id, NewUser);

        //delete prev image
        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.petImage != this.state.prevPetImage && this.state.prevPetImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevPetImage);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: false
        });
    }

    removedOrginalImageAndNotSave = () => {
        const { name, pet, breed, email, cellphone, petImage, password } = this.state;
        const id = this.props.auth.user._id;

        // Create user object
        const NewUser = {
            name,
            pet,
            breed,
            cellphone,
            petImage,
            email,
            password
        };

        // Attempt to edit
        this.props.edit(id, NewUser);

        const noImageFullpath = this.state.path + 'no-image.png';
        if (this.state.petImage != this.state.prevPetImage && this.state.prevPetImage != noImageFullpath) {
            const formData = new FormData();
            formData.append('filepath', this.state.prevPetImage);
            formData.append('abspath', this.state.path);

            axios.post('/remove', formData);
        }
        this.setState({
            imageSubmited: true,
            removedOrginalImageAndNotSave: true
        });
    }

    DropDowntogglePet = () => {

        this.setState({
            dropdownPetOpen: !this.state.dropdownPetOpen
        });
    }

    DropDowntoggleBreed = () => {

        this.setState({
            dropdownBreedOpen: !this.state.dropdownBreedOpen
        });
    }

    selectPet = (event) => {
        this.props.getPet(event.target.value);
        if (this.state.fadeIn == false) {
            this.setState({ fadeIn: !this.state.fadeIn });
        }
        this.setState({
            dropDownBreedValue: 'בחר גזע',
            breed: '',
            dropdownPetOpen: !this.state.dropdownPetOpen,
            dropDownPetValue: event.target.innerText,
            [event.target.name]: event.target.innerText
        });
    }

    selectBreed = (event) => {
        this.setState({
            dropdownBreedOpen: !this.state.dropdownBreedOpen,
            dropDownBreedValue: event.target.innerText,
            [event.target.name]: event.target.innerText
        });
    }

    setRegisterModalStates = (val) => {
        this.setState({ petImage: val });
    }

    setRegisterModalStates = (val) => {
        this.setState({ petImage: val });
        if (this.state.removeImagefadeIn == false) {
            this.setState({ removeImagefadeIn: !this.state.removeImagefadeIn });
        }
    }

    bodyStyle = () => {
        return {
            border: '1px solid rgb(230, 230, 230)',
            webkitBorderRadius: '15px',
            mozBorderRadius: '15px',
            borderRadius: '15px',
            padding: '30px',
            height: 'auto',
            width: 'auto',

            webkitBoxShadow: '0 0 5px 0.1px #C7C7C7',
            boxSshadow: '0 0 5px 0.1px #C7C7C7'
        };
    };

    render() {
        const { pets, pet } = this.props.pet;

        return (
            <Fragment >
                <div className='position-relative mt-4'
                >
                    <Card style={this.bodyStyle()} align="right">
                        <CardTitle className={'mr-5 mb-2 lead'} tag="h5" style={{ display: 'inline' }}>עריכת משתמש</CardTitle>

                        <CardBody className='pr-4 mr-5'>
                            {this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null}
                            <Form onSubmit={this.onSubmit}>
                                <FormGroup>

                                    <Label for='name'>שם מלא</Label>
                                    <Input
                                        type='name'
                                        defaultValue={this.state.name}
                                        name='name'
                                        id='name'
                                        placeholder='Name'
                                        className='mb-3'
                                        onChange={this.onChange}
                                    />

                                    <Label for='cellphone'>טלפון</Label>
                                    <Input
                                        type='number'
                                        defaultValue={this.state.cellphone}
                                        name='cellphone'
                                        id='cellphone'
                                        placeholder='cellphone'
                                        className='mb-3'
                                        onChange={this.onChange}
                                    />

                                    <ButtonDropdown
                                        style={{ display: 'block', marginBottom: '1rem' }}

                                        isOpen={this.state.dropdownPetOpen} toggle={this.DropDowntogglePet}>
                                        <DropdownToggle caret>{this.state.pet}</DropdownToggle>
                                        <DropdownMenu
                                            modifiers={{
                                                setMaxHeight: {
                                                    enabled: true,
                                                    order: 890,
                                                    fn: (data) => {
                                                        return {
                                                            ...data,
                                                            styles: {
                                                                ...data.styles,
                                                                overflow: 'auto',
                                                                maxHeight: '100px',
                                                            },
                                                        };
                                                    },
                                                },
                                            }}>
                                            {pets.map(({ name, _id }) => (
                                                <DropdownItem key={_id} name='pet' value={_id} onClick={this.selectPet}>{name}</DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </ButtonDropdown>

                                    <Fade in={this.state.fadeIn} tag="h5" className="mt-3">
                                        <ButtonDropdown
                                            style={{ marginBottom: '1rem' }}
                                            isOpen={this.state.dropdownBreedOpen} toggle={this.DropDowntoggleBreed}>
                                            {this.state.breed != '' ?
                                                <DropdownToggle caret>{this.state.breed}</DropdownToggle>
                                                :
                                                <DropdownToggle caret>{this.state.dropDownBreedValue}</DropdownToggle>
                                            }

                                            <DropdownMenu
                                                modifiers={{
                                                    setMaxHeight: {
                                                        enabled: true,
                                                        order: 890,
                                                        fn: (data) => {
                                                            return {
                                                                ...data,
                                                                styles: {
                                                                    ...data.styles,
                                                                    overflow: 'auto',
                                                                    maxHeight: '100px',
                                                                },
                                                            };
                                                        },
                                                    },
                                                }}>
                                                {pet &&
                                                    pet.breeds.map(({ name }) => (
                                                        <DropdownItem name='breed' onClick={this.selectBreed}>{name}</DropdownItem>
                                                    ))}
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                    </Fade>

                                    <FileUpload
                                        payload={this.state.cellphone}
                                        setRegisterModalStates={this.setRegisterModalStates}
                                        path={this.state.path}
                                        currImage={this.state.petImage}
                                        prevImage={this.state.prevPetImage}
                                        imageSaved={this.state.imageSubmited}
                                        removedOrginalImageAndNotSave={this.removedOrginalImageAndNotSave}
                                    />
                                    {/* <Fade in={this.state.removeImagefadeIn} tag="h5" className="mt-3">
                                <Button
                                        color='light'
                                        size='sm'
                                        style={{ marginTop: '2rem', width:'100px'}}
                                        block
                                        onClick={this.removeImage}
                                    >מחק תמונה</Button>
                                </Fade> */}
                                    <Button
                                        color='dark'
                                        style={{ marginTop: '2rem' }}
                                        block
                                    >שמור</Button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </div>

                {this.state.redirect &&
                    <Redirect exact from='profile/edit' to={this.state.redirect} />
                }
            </Fragment>
        );
    }
}



const mapStateToProps = (state) => ({
    auth: state.auth,
    pet: state.pet,
    error: state.error,
    msg: state.msg
});

export default connect(
    mapStateToProps,
    { edit, clearErrors, clearMsgs, getPet }
)(ChangeUserInfo);