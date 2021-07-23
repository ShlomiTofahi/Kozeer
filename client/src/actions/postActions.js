import axios from 'axios';
import { POSTS_LOADING, GET_POSTS, ADD_POST, ADD_POST_FAIL, DELETE_POST, VIEWS_POST, LOVED_POST, UNLOVED_POST } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';

export const getPosts = () => dispatch => {
    dispatch(setPostsLoading());
    axios
        .get('/api/posts')
        .then(res => {
            try {
                dispatch({
                    type: GET_POSTS,
                    payload: res.data
                })
            }
            catch (e) {
                console.log(res, e)
            }
        }
        )
        .catch(err =>
            dispatch(returnErrors(err?.response?.data, err?.response?.status))
        );
};

// export const getFilterPosts = ({ title, category, pet, breed }) => dispatch => {
//     // Headers
//     const config = {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     };
//     // Request body
//     const body = JSON.stringify({ title, category, pet, breed });

//     dispatch(setPostsLoading());
//     axios
//         .post('/api/posts/filter', body, config)
//         .then(res =>
//             dispatch({
//                 type: GET_POSTS,
//                 payload: res.data
//             }))
//         .catch(err =>
//             dispatch(returnErrors(err.response.data, err.response.status))
//         );
// };

export const addPost = (post) => (dispatch, getState) => {
    axios
        .post('/api/posts', post, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('הפוסט נוצר בהצלחה', null, 'ADD_POST_SUCCESS')
            );
            dispatch({
                type: ADD_POST,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_POST_FAIL')
            );
            dispatch({
                type: ADD_POST_FAIL
            });
        });
};

export const deletePost = (id) => (dispatch, getState) => {
    axios
        .delete(`/api/posts/${id}`, tokenConfig(getState))
        .then(res =>
            dispatch({
                type: DELETE_POST,
                payload: id
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const viewsPost = (_id) => (dispatch) => {

    // Request body
    const body = JSON.stringify({});
    axios
        .post(`/api/posts/views/${_id}`, body)
        .then(res =>
            dispatch({
                type: VIEWS_POST,
                payload: res.data
            }))
        .catch(err => {
            debugger;
            dispatch(returnErrors(err.response.data, err.response.status))
        }
        );
};

export const lovedPost = (_id) => (dispatch) => {
    // Request body
    const body = JSON.stringify({});
    axios
        .post(`/api/posts/loved/${_id}`, body)
        .then(res =>
            dispatch({
                type: LOVED_POST,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response?.status))
        );
};

export const unlovedPost = (_id) => (dispatch) => {
    // Request body
    const body = JSON.stringify({});
    axios
        .post(`/api/posts/unloved/${_id}`, body)
        .then(res =>
            dispatch({
                type: UNLOVED_POST,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const getFilterPosts = ({ title }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // Request body
        const body = JSON.stringify({ title });

    dispatch(setPostsLoading());
    axios
        .post('/api/posts/filter', body, config)
        .then(res =>
            dispatch({
                type: GET_POSTS,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const setPostsLoading = () => {
    return {
        type: POSTS_LOADING
    };
};