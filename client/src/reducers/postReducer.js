import { GET_POSTS, POSTS_LOADING, ADD_POST, DELETE_POST, VIEWS_POST, LOVED_POST, UNLOVED_POST } from '../actions/types';

const initialState = {
    posts: [],
    loading: false,
    post: null
};

export default function postReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                posts: action.payload,
                loading: false
            };
        case ADD_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };      
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.payload)
            };
        case VIEWS_POST:
        case LOVED_POST:
        case UNLOVED_POST:
            let newPost = [...state.posts];
            var index = newPost.findIndex(element => element._id === action.payload._id);
            newPost[index] = action.payload;
            return {
                ...state,
                posts: newPost
            };
            // return {
            //     ...state
            // };
        case POSTS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}