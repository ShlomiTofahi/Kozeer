import { combineReducers } from 'redux';
// import itemReducer from './itemReducer';
import postReducer from './postReducer';
import commentReducer from './commentReducer';
import errorReducer from './errorReducer';
import msgReducer from './msgReducer';
import authReducer from './authReducer';
import chapterReducer from './chapterReducer';
import mangaReducer from './mangaReducer';
import twoFactorAuthReducer from './twoFactorAuthReducer';

// import twoFactorAuthReducer from './twoFactorAuthReducer';
// import contactsReducer from './contactsReducer';

export default combineReducers({
    post: postReducer,
    comment: commentReducer,
    error: errorReducer,
    msg: msgReducer,
    auth: authReducer,
    chapter: chapterReducer,
    manga: mangaReducer,
    twoFactorAuth: twoFactorAuthReducer,

    // contacts: contactsReducer
});