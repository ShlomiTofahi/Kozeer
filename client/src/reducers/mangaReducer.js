import { GET_MANGAS, ADD_MANGA, DELETE_MANGA, MANGAS_LOADING, EDIT_MANGA } from '../actions/types';

const initialState = {
    mangas: [],
    loading: false
};

export default function mangaReducer(state = initialState, action) {
    switch (action.type) {
        case GET_MANGAS:
            return {
                ...state,
                mangas: action.payload,
                loading: false
            };
        case ADD_MANGA:
            return {
                ...state,
                mangas: [...state.mangas, action.payload],
            };
        case DELETE_MANGA:
            return {
                ...state,
                mangas: state.mangas.filter(manga => manga._id !== action.payload)
            };
        case EDIT_MANGA:
            let newMangas = [...state.mangas];
            var index = newMangas.findIndex(element => element._id === action.payload._id);
            newMangas[index] = action.payload;
            return {
                ...state,
                mangas: newMangas
            };
        case MANGAS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}