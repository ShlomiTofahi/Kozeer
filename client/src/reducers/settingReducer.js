import { GET_SETTINGS, SETTINGS_LOADING, EDIT_SETTINGS } from '../actions/types';

const initialState = {
    setting: null,
    loading: false
};

export default function subscribeReducer(state = initialState, action) {
    switch (action.type) {
        case GET_SETTINGS:
            return {
                ...state,
                setting: action.payload,
                loading: false
            };
        case EDIT_SETTINGS:
            let setting = Object.assign({}, state.setting, action.payload);
            return {
                ...state,
                setting
            };
        case SETTINGS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}