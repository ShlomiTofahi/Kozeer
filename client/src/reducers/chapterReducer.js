import { GET_CHAPTERS, ADD_CHAPTER, DELETE_CHAPTER, CHAPTERS_LOADING, EDIT_CHAPTER, UPDATE_CHAPTER, EDIT_CHAPTER_FROM_POST_DELETE } from '../actions/types';

const initialState = {
    chapters: [],
    loading: false
};

export default function chapterReducer(state = initialState, action) {
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
            let payload = "chapter" in action.payload ? action.payload.chapter : action.payload;

            var index = newChapters.findIndex(element => element._id === payload._id);
            newChapters[index] = payload;
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
        case EDIT_CHAPTER_FROM_POST_DELETE:
            newChapters = [...state.chapters];
            action.payload.map((mangaID) => {
                newChapters.map((chapter) => {
                    chapter.mangas.map((manga) => {
                        if (manga._id === mangaID) {
                            manga.inuse = false;
                        }
                    })
                })
            })
            newChapters = newChapters.sort((a, b) => Number(a.name.substring(4)) - Number(b.name.substring(4)));
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