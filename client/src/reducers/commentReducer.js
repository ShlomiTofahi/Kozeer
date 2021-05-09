import { GET_POST_COMMENTS, COMMENTS_LOADING, ADD_COMMENT, DELETE_COMMENT } from '../actions/types';

const initialState = {
    comments: [],
    loading: false,
};

export default function commentReducer(state = initialState, action) {
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
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(comment => comment._id !== action.payload)
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