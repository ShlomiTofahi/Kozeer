import {
    GET_POST_COMMENTS, COMMENTS_LOADING, ADD_COMMENT, DELETE_COMMENT, REPLY_COMMENT,
    LOVED_COMMENT, UNLOVED_COMMENT
} from '../actions/types';

const initialState = {
    comments: [],
    loading: false,
};

export default function commentReducer(state = initialState, action) {
    var newComment = [];
    var index;
    switch (action.type) {
        case GET_POST_COMMENTS:
            return {
                ...state,
                comments: action.payload,
                loading: false
            };
        case ADD_COMMENT:
            return {
                ...state,
                comments: [action.payload, ...state.comments]
            };
        case REPLY_COMMENT:
            newComment = [...state.comments];
            index = newComment.findIndex(element => element._id === action.payload.command_id);
            newComment[index].comments = [action.payload.data, ...newComment[index].comments];
            return {
                ...state,
                posts: newComment
            };
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(comment => comment._id !== action.payload)
            };
        case LOVED_COMMENT:
        case UNLOVED_COMMENT:
            newComment = [...state.comments];
            index = newComment.findIndex(element => element._id === action.payload._id);
            newComment[index] = action.payload;
            return {
                ...state,
                comments: newComment
            };
        case COMMENTS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}