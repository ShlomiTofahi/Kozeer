import axios from 'axios';
import {
    ADD_SUBSCRIBE, ADD_SUBSCRIBE_FAIL, GET_SUBSCRIBES, SUBSCRIBES_LOADING,
    DELETE_FAIL, DELETE_SUBSCRIBE
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';


export const getSubscribes = () => dispatch => {
    dispatch(setSubscribesLoading());
    axios
        .get('/api/subscribes')
        .then(res =>
            dispatch({
                type: GET_SUBSCRIBES,
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
        });
};

export const addSubscribe = (email) => (dispatch) => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // Request body
    const body = JSON.stringify({ email });

    axios
        .post('/api/subscribes', body, config)
        .then(res => {
            dispatch(
                returnMsgs('Added successfully', null, 'ADD_SUBSCRIBE_SUCCESS')
            );
            dispatch({
                type: ADD_SUBSCRIBE,
                payload: res.data
            })
        })
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status, 'ADD_SUBSCRIBE_FAIL')
                )
                : dispatch(
                    returnErrors(err.message, 'ADD_SUBSCRIBE_FAIL')
                );
            dispatch({
                type: ADD_SUBSCRIBE_FAIL
            });
        });
};


export const deleteManga = (id) => (dispatch, getState) => {
    axios
        .delete(`/api/subscribes/${id}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_SUBSCRIBE,
                payload: id
            })
        })
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status, 'DELETE_SUBSCRIBE_FAIL')
                )
                : dispatch(
                    returnErrors(err.message, 'DELETE_SUBSCRIBE_FAIL')
                );
            dispatch({
                type: DELETE_FAIL
            });
        });
};

export const setSubscribesLoading = () => {
    return {
        type: SUBSCRIBES_LOADING
    };
};
