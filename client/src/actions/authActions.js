import axios from 'axios';
import { compareSync } from 'bcryptjs';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';

import {
  USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS,REGISTER_SUCCESS,
  REGISTER_FAIL, USERS_LOADING, DELETE_USER, GET_USERS, EDIT_USER_SUCCESS, EDIT_USER_FAIL, CHANGE_PASSWORD,
  CHANGE_PASSWORD_FAIL, USER_LOADED_BY_EMAIL, USER_LOADED_BY_EMAIL_FAIL, CHANGE_EMAIL, CHANGE_EMAIL_FAIL
} from './types';


// Check token & load user
export const loadUser = () => (dispatch, getState) => {
  // User loading
  dispatch({ type: USER_LOADING });

  axios
    .get('/api/auth/user', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const getUserByEmail = (email) => dispatch => {
  // Headers
  const config = {
      headers: {
          'Content-Type': 'application/json'
      }
  };
  // Request body
  const body = JSON.stringify({ email });

  axios
      .post('/api/users/userid', body, config)
      .then(res => {
          dispatch(
              returnMsgs('', null, 'USER_LOADED_BY_EMAIL_SUCCESS')
          );
          dispatch({
              type: USER_LOADED_BY_EMAIL,
              payload: res.data
          })
      })
      .catch(err => {
          dispatch(
              returnErrors(err.response.data.msg, err.response.status, 'USER_LOADED_BY_EMAIL_FAIL')
          );
          dispatch({
              type: USER_LOADED_BY_EMAIL_FAIL
          });
      });
};

export const getUsers = () => (dispatch, getState) => {
  // Users loading
  dispatch({ type: USERS_LOADING });
  axios
    .post('/api/users/all', null, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//Delete User
export const deleteUser = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/users/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_USER,
        payload: id
      }))
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

//Register User
export const register = ({ name, pet, breed, email, cellphone, petImage, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ name, pet, breed, email, cellphone, petImage, password });

  axios
    .post('/api/users', body, config)
    .then(res =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data.msg, err.response.status, 'REGISTER_FAIL')
      );
      dispatch({
        type: REGISTER_FAIL
      });
    });
};

//Change Password User
export const changePassword = (id, data) => (dispatch, getState) => {
  axios
    .post(`/api/users/change-pass/${id}`, data, tokenConfig(getState))
    .then(res => {
      dispatch(
        returnMsgs('הסיסמא שונתה בהצלחה', null, 'CHANGE_PASSWORD_SUCCESS')
      );
      dispatch({
        type: CHANGE_PASSWORD,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data.msg, err.response.status, 'CHANGE_PASSWORD_FAIL')
      );
      dispatch({
        type: CHANGE_PASSWORD_FAIL
      });
    });
};

//Change Password User
export const changeEmail = (id, data) => (dispatch, getState) => {
  axios
    .post(`/api/users/change-email/${id}`, data, tokenConfig(getState))
    .then(res => {
      dispatch(
        returnMsgs('האימייל שונה בהצלחה', null, 'CHANGE_EMAIL_SUCCESS')
      );
      dispatch({
        type: CHANGE_EMAIL,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data.msg, err.response.status, 'CHANGE_EMAIL_FAIL')
      );
      dispatch({
        type: CHANGE_EMAIL_FAIL
      });
    });
};

//Change Password User By Email
export const changePassByEmail = (id, data) => (dispatch, getState) => {
  axios
    .post(`/api/users/change-pass-by-email/${id}`, data, tokenConfig(getState))
    .then(res => {
      dispatch(
        returnMsgs('הסיסמא שונתה בהצלחה', null, 'CHANGE_PASSWORD_SUCCESS')
      );
      dispatch({
        type: CHANGE_PASSWORD,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data.msg, err.response.status, 'CHANGE_PASSWORD_FAIL')
      );
      dispatch({
        type: CHANGE_PASSWORD_FAIL
      });
    });
};

//Edit User
export const edit = (id, user) => (dispatch, getState) => {

  // Request body
  // const body = JSON.stringify({ name, pet, email, breed, cellphone, petImage, password});
  axios
    .post(`/api/users/edit/${id}`, user, tokenConfig(getState))
    .then(res => {
      dispatch(
        returnMsgs('המשתמש נערך בהצלחה', null, 'EDIT_USER_SUCCESS')
      );
      dispatch({
        type: EDIT_USER_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data.msg, err.response.status, 'EDIT_USER_FAIL')
      );
      dispatch({
        type: EDIT_USER_FAIL
      });
    });
};

// Login User
export const login = ({ email, password }) => (
  dispatch
) => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Request body
  const body = JSON.stringify({ email, password });

  axios
    .post('/api/auth', body, config)
    .then(res =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch(
        returnErrors(err.response.data.msg, err.response.status, 'LOGIN_FAIL')
      );
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// Logout User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      "Content-type": "application/json"
    }
  }

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};