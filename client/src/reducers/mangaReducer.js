import { GET_MANGAS, ADD_MANGA, DELETE_MANGA, MANGAS_LOADING, EDIT_MANGA } from '../actions/types';

const initialState = {
    mangas: [],
    loading: false
};

export default function mangaReducer(state = initialState, action) {
    let newMangas = [];
    switch (action.type) {
        case GET_MANGAS:
            return {
                ...state,
                mangas: action.payload,
                loading: false
            };
        case ADD_MANGA:
            newMangas = [...state.mangas, action.payload];
            newMangas = newMangas.sort((a, b) => Number(a.page.substring(4)) - Number(b.page.substring(4)));

            return {
                ...state,
                mangas: newMangas,
            };
        case DELETE_MANGA:
            return {
                ...state,
                mangas: state.mangas.filter(manga => manga._id !== action.payload)
            };
        case EDIT_MANGA:
            newMangas = [...state.mangas];
            var index = newMangas.findIndex(element => element._id === action.payload._id);
            newMangas[index] = action.payload;
            newMangas = newMangas.sort((a, b) => Number(a.page.substring(4)) - Number(b.page.substring(4)));
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