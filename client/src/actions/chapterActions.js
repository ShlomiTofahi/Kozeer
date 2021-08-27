import axios from 'axios';
import {
    ADD_CHAPTER_FAIL, GET_CHAPTERS, ADD_CHAPTER, DELETE_CHAPTER, CHAPTERS_LOADING, DELETE_FAIL,
    EDIT_CHAPTER, EDIT_CHAPTER_FAIL
} from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';


export const getChapters = () => dispatch => {
    dispatch(setChaptersLoading());
    axios
        .get('/api/chapters')
        .then(res =>
            dispatch({
                type: GET_CHAPTERS,
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

export const addChapter = (chapter) => (dispatch, getState) => {
    axios
        .post('/api/chapters', chapter, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Added successfully', null, 'ADD_CHAPTER_SUCCESS')
            );
            dispatch({
                type: ADD_CHAPTER,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_CHAPTER_FAIL')
            );
            dispatch({
                type: ADD_CHAPTER_FAIL
            });
        });
};

export const editChapter = (id, chapter) => (dispatch, getState) => {
    axios
        .post(`/api/chapters/edit/${id}`, chapter, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Edited successfully', null, 'EDIT_CHAPTER_SUCCESS')
            );
            dispatch({
                type: EDIT_CHAPTER,
                payload: res.data
            })
        })
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status, 'EDIT_CHAPTER_FAIL')
                )
                : dispatch(
                    returnErrors(err.message, 'EDIT_CHAPTER_FAIL')
                );
            dispatch({
                type: EDIT_CHAPTER_FAIL
            });
        });
};

export const deleteChapter = (id) => (dispatch, getState) => {
    axios
        .delete(`/api/chapters/${id}`, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Chapter deleted successfully', null, 'DELETE_CHAPTER_SUCCESS')
            );
            dispatch({
                type: DELETE_CHAPTER,
                payload: id
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status, 'DELETE_FAIL'));
            dispatch({
                type: DELETE_FAIL
            });
        });
};

export const setChaptersLoading = () => {
    return {
        type: CHAPTERS_LOADING
    };
};
