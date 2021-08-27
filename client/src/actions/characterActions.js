import axios from 'axios';
import {
    ADD_CHARACTER_FAIL, GET_CHARACTERS, ADD_CHARACTER, DELETE_CHARACTER, CHARACTERS_LOADING,
    DELETE_CHARACTER_FAIL, EDIT_CHARACTER, EDIT_CHARACTER_FAIL, GET_CHARACTER_BY_ID,
    EDIT_SINGAL_CHARACTER, ADD_PROP_CHARACTER_FAIL, DELETE_PROP_CHARACTER, DELETE_PROP_CHARACTER_FAIL
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';


export const getCharacters = () => dispatch => {
    dispatch(setCharactersLoading());
    axios
        .get('/api/characters')
        .then(res =>
            dispatch({
                type: GET_CHARACTERS,
                payload: res.data
            }))
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status)
                )
                : dispatch(
                    returnErrors(err.message)
                );
        }
        );
};

export const getCharacterById = (id) => dispatch => {
    dispatch(setCharactersLoading());
    axios
        .get(`/api/characters/${id}`)
        .then(res => {
            try {
                dispatch(
                    returnMsgs('got successfully', null, 'GET_CHARACTER_SUCCESS')
                );
                dispatch({
                    type: GET_CHARACTER_BY_ID,
                    payload: res.data
                })
            }
            catch (e) {
                console.log(res, e)
            }
        }
        )
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data, err.response.status)
                )
                : dispatch(
                    returnErrors(err.message)
                );
        }
        );
};

export const addCharacter = (character) => (dispatch, getState) => {
    axios
        .post('/api/characters', character, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Added successfully', null, 'ADD_CHARACTER_SUCCESS')
            );
            dispatch({
                type: ADD_CHARACTER,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_CHARACTER_FAIL')
            );
            dispatch({
                type: ADD_CHARACTER_FAIL
            });
        });
};

export const addPropCharacter = (id, image) => (dispatch, getState) => {
    axios
        .post(`/api/characters/prop/${id}`, image, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Added successfully', null, 'ADD_PROP_CHARACTER_SUCCESS')
            );
            dispatch({
                type: EDIT_SINGAL_CHARACTER,
                payload: res.data
            })
            dispatch({
                type: EDIT_CHARACTER,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_PROP_CHARACTER_FAIL')
            );
            dispatch({
                type: ADD_PROP_CHARACTER_FAIL
            });
        });
};

export const editCharacter = (id, character) => (dispatch, getState) => {
    axios
        .post(`/api/characters/${id}`, character, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('edited successfully', null, 'EDIT_CHARACTER_SUCCESS')
            );
            dispatch({
                type: EDIT_SINGAL_CHARACTER,
                payload: res.data
            })
            dispatch({
                type: EDIT_CHARACTER,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'EDIT_CHARACTER_FAIL')
            );
            dispatch({
                type: EDIT_CHARACTER_FAIL
            });
        });
};
export const editCharImage = (id, charImage) => (dispatch, getState) => {
    axios
        .post(`/api/characters/char/${id}`, charImage, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('edited successfully', null, 'EDIT_CHARACTER_SUCCESS')
            );
            dispatch({
                type: EDIT_SINGAL_CHARACTER,
                payload: res.data
            })
            dispatch({
                type: EDIT_CHARACTER,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'EDIT_CHARACTER_FAIL')
            );
            dispatch({
                type: EDIT_CHARACTER_FAIL
            });
        });
};

// export const editCharacter = (id, character) => (dispatch, getState) => {
//     axios
//         .post(`/api/characters/edit/${id}`, character, tokenConfig(getState))
//         .then(res => {
//             dispatch(
//                 returnMsgs('Edited successfully', null, 'EDIT_CHARACTER_SUCCESS')
//             );
//             dispatch({
//                 type: EDIT_CHARACTER,
//                 payload: res.data
//             })
//         })
//         .catch(err => {
//             err.response ?
//                 dispatch(
//                     returnErrors(err.response.data.msg, err.response.status, 'EDIT_CHARACTER_FAIL')
//                 )
//                 : dispatch(
//                     returnErrors(err.message, 'EDIT_CHARACTER_FAIL')
//                 );
//             dispatch({
//                 type: EDIT_CHARACTER_FAIL
//             });
//         });
// };

export const deletePropCharacter = (id, propImage) => (dispatch, getState) => {
    const body = JSON.stringify({ id, propImage: propImage.replaceAll('/', '!@!') });

    axios
        .delete(`/api/characters/prop/${body}`, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Deleted successfully', null, 'DELETE_PROP_CHARACTER_SUCCESS')
            );
            dispatch({
                type: DELETE_PROP_CHARACTER,
                payload: propImage
            })
        })
        .catch(err => {
            err.response ?
                dispatch(returnErrors(err.response.data.msg, err.response.status, 'DELETE_FAIL'))
                : dispatch(
                    returnErrors(err.message, 'DELETE_FAIL')
                );
            dispatch({
                type: DELETE_PROP_CHARACTER_FAIL
            });
        });
};

export const deleteCharacter = (id) => (dispatch, getState) => {
    axios
        .delete(`/api/characters/${id}`, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Deleted successfully', null, 'DELETE_CHARACTER_SUCCESS')
            );
            dispatch({
                type: DELETE_CHARACTER,
                payload: id
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status, 'DELETE_FAIL'));
            dispatch({
                type: DELETE_CHARACTER_FAIL
            });
        });
};

export const setCharactersLoading = () => {
    return {
        type: CHARACTERS_LOADING
    };
};
