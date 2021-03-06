import axios from 'axios';
import {
    POSTS_LOADING, GET_POSTS, ADD_POST, ADD_POST_FAIL, EDIT_POST, EDIT_POST_FAIL, DELETE_POST, VIEWS_POST, GET_POST_BY_ID,
    LOVED_POST, UNLOVED_POST, EDIT_CHAPTER_FROM_POST_DELETE, EDIT_CHAPTER_FROM_POST_EDIT, EDIT_CHAPTER_FROM_POST_ADD
} from './types';
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

export const getPostById = (id) => dispatch => {
    dispatch(setPostsLoading());
    axios
        .get(`/api/posts/${id}`)
        .then(res => {
            try {
                dispatch({
                    type: GET_POST_BY_ID,
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
                returnMsgs('The post created successfully', null, 'ADD_POST_SUCCESS')
            );
            dispatch({
                type: ADD_POST,
                payload: res.data
            })
            dispatch({
                type: EDIT_CHAPTER_FROM_POST_ADD,
                payload: { newMangas: res.data.mangas }
            })
        })
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status, 'ADD_POST_FAIL')
                )
                : dispatch(
                    returnErrors(err.message, 'ADD_POST_FAIL')
                );
            dispatch({
                type: ADD_POST_FAIL
            });
        });
};
// chapterList = [];
// const { chapters } = this.props.chapter;
// chapters.map(({name, mangas}) =>{
//   mangas.map(({page}) =>{
//     if(this.state.mangasSelected.includes(page)){
//       chapterList = [...chapterList, name]
//     }
//   })
// })
export const editPost = (id, post, prevMangas) => (dispatch, getState) => {
    axios
        .post(`/api/posts/edit/${id}`, post, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('The post updated successfully', null, 'EDIT_POST_SUCCESS')
            );
            dispatch({
                type: EDIT_POST,
                payload: res.data
            })
            dispatch({
                type: GET_POST_BY_ID,
                payload: res.data
            })
            dispatch({
                type: EDIT_CHAPTER_FROM_POST_EDIT,
                payload: { newMangas: post.mangasSelected, prevMangas }
            })
        })
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status, 'EDIT_POST_FAIL')
                )
                : dispatch(
                    returnErrors(err.message, 'EDIT_POST_FAIL')
                );
            dispatch({
                type: EDIT_POST_FAIL
            });
        });
};

export const deletePost = (id) => (dispatch, getState) => {
    axios
        .delete(`/api/posts/${id}`, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('The post deleted successfully', null, 'DELETE_POST_SUCCESS')
            );
            dispatch({
                type: DELETE_POST,
                payload: id
            })
            dispatch({
                type: EDIT_CHAPTER_FROM_POST_DELETE,
                payload: res.data
            })
        })
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status, 'DELETE_POST_FAIL')
                )
                : dispatch(
                    returnErrors(err.message, 'DELETE_POST_FAIL')
                );
        }
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
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
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