import { combineReducers } from 'redux';
// import itemReducer from './itemReducer';
import postReducer from './postReducer';
import commentReducer from './commentReducer';
import errorReducer from './errorReducer';
import msgReducer from './msgReducer';
import authReducer from './authReducer';
import mangaReducer from './mangaReducer';
import twoFactorAuthReducer from './twoFactorAuthReducer';

// import twoFactorAuthReducer from './twoFactorAuthReducer';
// import contactsReducer from './contactsReducer';

export default combineReducers({
    // item: itemReducer,
    post: postReducer,
    comment: commentReducer,
    error: errorReducer,
    msg: msgReducer,
    auth: authReducer,
    manga: mangaReducer,
    twoFactorAuth: twoFactorAuthReducer,

    // twoFactorAuth: twoFactorAuthReducer,
    // contacts: contactsReducer
});