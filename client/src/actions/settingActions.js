import axios from 'axios';
import { GET_SETTINGS, SETTINGS_LOADING, EDIT_SETTINGS, SETTING_FAIL } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { returnMsgs } from './msgActions';


export const loadSetting = () => dispatch => {
    dispatch(setSettingsLoading());
    axios
        .get('/api/settings')
        .then(res =>
            dispatch({
                type: GET_SETTINGS,
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

export const editSetting = (setting) => (dispatch, getState) => {
    axios
        .post('/api/settings', setting, tokenConfig(getState))
        .then(res => {
            dispatch(
                returnMsgs('The setting updated successfully', null, 'EDIT_SETTINGS_SUCCESS')
            );
            dispatch({
                type: EDIT_SETTINGS,
                payload: res.data
            })
        })
        .catch(err => {
            err.response ?
                dispatch(
                    returnErrors(err.response.data.msg, err.response.status, 'SETTING_FAIL')
                )
                : dispatch(
                    returnErrors(err.message, 'SETTING_FAIL')
                );
            dispatch({
                type: SETTING_FAIL
            });
        });
};

export const setSettingsLoading = () => {
    return {
        type: SETTINGS_LOADING
    };
};
