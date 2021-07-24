import axios from 'axios';
import { ADD_MANGA_FAIL, GET_MANGAS, ADD_MANGA, DELETE_MANGA, MANGAS_LOADING, DELETE_FAIL, EDIT_MANGA, EDIT_MANGA_FAIL, EDIT_CHAPTER, UPDATE_CHAPTER } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';


export const getMangas = () => dispatch => {
    dispatch(setMangasLoading());
    axios
        .get('/api/mangas')
        .then(res =>
            dispatch({
                type: GET_MANGAS,
                payload: res.data
            }))
        .catch(err =>
            dispatch(returnErrors(err.response.data, err.response.status))
        );
};

export const addManga = (manga) => (dispatch, getState) => {
    axios
        .post('/api/mangas', manga, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Added successfully', null, 'ADD_MANGA_SUCCESS')
            );
            dispatch({
                type: ADD_MANGA,
                payload: res.data
            })
            dispatch({
                type: EDIT_CHAPTER,
                payload: res.data
            })
        })
        .catch(err => {
            err.response ?
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'ADD_MANGA_FAIL')
            )
            : dispatch(
                returnErrors(err.message, 'ADD_MANGA_FAIL')
            );
            dispatch({
                type: ADD_MANGA_FAIL
            });
        });
};

export const editManga = (id, manga) => (dispatch, getState) => {
    axios
        .post(`/api/mangas/edit/${id}`, manga, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('Edited successfully', null, 'EDIT_MANGA_SUCCESS')
            );
            dispatch({
                type: EDIT_MANGA,
                payload: res.data
            })
            dispatch({
                type: EDIT_CHAPTER,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(
                returnErrors(err.response.data.msg, err.response.status, 'EDIT_MANGA_FAIL')
            );
            dispatch({
                type: EDIT_MANGA_FAIL
            });
        });
};

export const deleteManga = (id) => (dispatch, getState) => {
    axios
        .delete(`/api/mangas/${id}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_MANGA,
                payload: id
            })
            dispatch({
                type: UPDATE_CHAPTER,
                payload: res.data
            })
        }
        )
        .catch(err => {
            dispatch(returnErrors(err.response.data.msg, err.response.status, 'DELETE_FAIL'));
            dispatch({
                type: DELETE_FAIL
            });
        });
};

export const setMangasLoading = () => {
    return {
        type: MANGAS_LOADING
    };
};
