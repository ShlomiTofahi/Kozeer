import { GET_CHAPTERS, ADD_CHAPTER, DELETE_CHAPTER, CHAPTERS_LOADING, EDIT_CHAPTER, UPDATE_CHAPTER } from '../actions/types';

const initialState = {
    chapters: [],
    loading: false
};

export default function mangaReducer(state = initialState, action) {
    let newChapters = []
    switch (action.type) {
        case GET_CHAPTERS:
            return {
                ...state,
                chapters: action.payload,
                loading: false
            };
        case ADD_CHAPTER:
            newChapters = [...state.chapters, action.payload]
            newChapters = newChapters.sort((a, b) => Number(a.name.substring(7)) - Number(b.name.substring(7)))

            return {
                ...state,
                chapters: newChapters,
            };
        case DELETE_CHAPTER:
            return {
                ...state,
                chapters: state.chapters.filter(chapter => chapter._id !== action.payload)
            };
        case EDIT_CHAPTER:
            newChapters = [...state.chapters];
            var index = newChapters.findIndex(element => element._id === action.payload.chapter._id);
            newChapters[index] = action.payload.chapter;
            newChapters = newChapters.sort((a, b) => Number(a.name.substring(7)) - Number(b.name.substring(7)))

            return {
                ...state,
                chapters: newChapters
            };
        case UPDATE_CHAPTER:
            newChapters = [...state.chapters];
            var index = newChapters.findIndex(element => element._id === action.payload._id);
            newChapters[index] = action.payload;
            newChapters = newChapters.sort((a, b) => Number(a.name.substring(7)) - Number(b.name.substring(7)))
            return {
                ...state,
                chapters: newChapters
            };
        case CHAPTERS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}