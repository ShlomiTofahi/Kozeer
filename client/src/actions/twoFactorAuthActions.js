import axios from 'axios';
import { CREATE_TOKEN, CREATE_TOKEN_FAIL, VERIFY_TOKEN, VERIFY_TOKEN_FAIL } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';



export const CreateToken = (email) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // Request body
    const body = JSON.stringify({ email });

    axios
        .post('/api/auth/create-token', body, config)
        .then(res => {
            dispatch(
                returnMsgs('קוד אימות נשלח לך למייל', null, 'CREATE_TOKEN_SUCCESS')
            );
            dispatch({
                type: CREATE_TOKEN,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'CREATE_TOKEN_FAIL')
            );
            dispatch({
                type: CREATE_TOKEN_FAIL
            });
        });
};

export const VerifyToken = (email, token) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // Request body
    const body = JSON.stringify({ email, token });

    axios
        .post('/api/auth/verify-token', body, config)
        .then(res => {
            dispatch(
                returnMsgs('אימות אושר', null, 'VERIFY_TOKEN_SUCCESS')
            );
            dispatch({
                type: VERIFY_TOKEN,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'VERIFY_TOKEN_FAIL')
            );
            dispatch({
                type: VERIFY_TOKEN_FAIL
            });
        });
};
