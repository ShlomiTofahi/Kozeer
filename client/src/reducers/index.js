import { combineReducers } from 'redux';
// import itemReducer from './itemReducer';
import postReducer from './postReducer';
import commentReducer from './commentReducer';
import errorReducer from './errorReducer';
import msgReducer from './msgReducer';
import authReducer from './authReducer';
import chapterReducer from './chapterReducer';
import mangaReducer from './mangaReducer';
import settingReducer from './settingReducer';
import twoFactorAuthReducer from './twoFactorAuthReducer';

export default combineReducers({
    post: postReducer,
    comment: commentReducer,
    error: errorReducer,
    msg: msgReducer,
    auth: authReducer,
    chapter: chapterReducer,
    manga: mangaReducer,
    setting: settingReducer,
    twoFactorAuth: twoFactorAuthReducer,
});