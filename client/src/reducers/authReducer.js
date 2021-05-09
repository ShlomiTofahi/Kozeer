import {
  USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, USER_LOADED_BY_EMAIL,
  REGISTER_SUCCESS, REGISTER_FAIL, GET_USERS, USERS_LOADING, DELETE_USER, EDIT_USER_SUCCESS, CHANGE_PASSWORD,CHANGE_EMAIL
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  users: []
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
    case USERS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case CHANGE_EMAIL:
    case CHANGE_PASSWORD:
      return {
        ...state,
        user: action.payload
      };
    case USER_LOADED_BY_EMAIL:
      return {
        ...state,
        ...action.payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        isLoading: false
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return state;
  }
}
