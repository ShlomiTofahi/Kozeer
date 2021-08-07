import axios from 'axios';
import {
    GET_POST_COMMENTS, COMMENTS_LOADING, ADD_COMMENT, ADD_COMMENT_FAIL, DELETE_COMMENT, REPLY_COMMENT,
    REPLY_COMMENT_FAIL, LOVED_COMMENT, UNLOVED_COMMENT
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';

export const getPostComments = (post_id, order = -1) => dispatch => {
    dispatch(setCommentsLoading());
    const body = JSON.stringify({ post_id, order });
    axios
        .get(`/api/comments/${body}`)
        .then(res =>
            dispatch({
                type: GET_POST_COMMENTS,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const addComment = (id, comment) => (dispatch, getState) => {
    axios
        .post(`/api/comments/${id}`, comment, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('התגובה נוצרה בהצלחה', null, 'ADD_COMMENT_SUCCESS')
            );
            dispatch({
                type: ADD_COMMENT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_COMMENT_FAIL')
            );
            dispatch({
                type: ADD_COMMENT_FAIL
            });
        });
};

export const addCommentAsGuest = (id, comment) => (dispatch) => {
    axios
        .post(`/api/comments/asguest/${id}`, comment)
        .then(res => {
            dispatch(
                returnMsgs('התגובה נוצרה בהצלחה', null, 'ADD_COMMENT_SUCCESS')
            );
            dispatch({
                type: ADD_COMMENT,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_COMMENT_FAIL')
            );
            dispatch({
                type: ADD_COMMENT_FAIL
            });
        });
};


export const replyComment = (post_id, command_id, body) => (dispatch, getState) => {
    const body1 = JSON.stringify({ post_id, command_id, body });
    axios
        .post(`/api/comments/reply/${body1}`, null, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: REPLY_COMMENT,
                payload: { data: res.data, id: command_id }
            }))
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_COMMENT_FAIL')
            );
            dispatch({
                type: REPLY_COMMENT_FAIL
            });
        });
};
export const replyCommentAsGuest = (post_id, command_id, body) => (dispatch) => {
    const body1 = JSON.stringify({ post_id, command_id, body });
    axios
        .post(`/api/comments/reply/asguest/${body1}`, null)
        .then(res =>
            dispatch({
                type: REPLY_COMMENT,
                payload: { data: res.data, command_id }
            }))
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_COMMENT_FAIL')
            );
            dispatch({
                type: REPLY_COMMENT_FAIL
            });
        });
};
export const deleteComment = (post_id, command_id) => (dispatch, getState) => {
    const body = JSON.stringify({ post_id, command_id });
    axios
        .delete(`/api/comments/${body}`, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: DELETE_COMMENT,
                payload: command_id
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};


export const lovedComment = (_id) => (dispatch) => {
    // Request body
    const body = JSON.stringify({});
    axios
        .post(`/api/comments/loved/${_id}`, body)
        .then(res =>
            dispatch({
                type: LOVED_COMMENT,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const unlovedComment = (_id) => (dispatch) => {
    // Request body
    const body = JSON.stringify({});
    axios
        .post(`/api/comments/unloved/${_id}`, body)
        .then(res =>
            dispatch({
                type: UNLOVED_COMMENT,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const setCommentsLoading = () => {
    return {
        type: COMMENTS_LOADING
    };
};
