import { GET_SUBSCRIBES, ADD_SUBSCRIBE, DELETE_SUBSCRIBE, SUBSCRIBES_LOADING } from '../actions/types';

const initialState = {
    subscribes: [],
    loading: false
};

export default function subscribeReducer(state = initialState, action) {
    switch (action.type) {
        case GET_SUBSCRIBES:
            return {
                ...state,
                subscribes: action.payload,
                loading: false
            };
        case ADD_SUBSCRIBE:
            return {
                ...state,
                subscribes: [...state.mangas, action.payload],
            };
        case DELETE_SUBSCRIBE:
            return {
                ...state,
                subscribes: state.subscribes.filter(subscribe => subscribe._id !== action.payload)
            };
        case SUBSCRIBES_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}