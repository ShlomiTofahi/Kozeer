import {
    GET_CHAPTERS, ADD_CHAPTER, DELETE_CHAPTER, CHAPTERS_LOADING, EDIT_CHAPTER, UPDATE_CHAPTER,
    EDIT_CHAPTER_FROM_POST_DELETE, EDIT_CHAPTER_FROM_POST_EDIT, EDIT_CHAPTER_FROM_POST_ADD
} from '../actions/types';

const initialState = {
    chapters: [],
    loading: false
};

export default function chapterReducer(state = initialState, action) {
    let newChapters = []
    var index;
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

            index = newChapters.findIndex(element => element._id === payload._id);
            newChapters[index] = payload;
            newChapters = newChapters.sort((a, b) => Number(a.name.substring(7)) - Number(b.name.substring(7)))

            return {
                ...state,
                chapters: newChapters
            };
        case UPDATE_CHAPTER:
            newChapters = [...state.chapters];
            index = newChapters.findIndex(element => element._id === action.payload._id);
            newChapters[index] = action.payload;
            newChapters = newChapters.sort((a, b) => Number(a.name.substring(7)) - Number(b.name.substring(7)))
            return {
                ...state,
                chapters: newChapters
            };
        case EDIT_CHAPTER_FROM_POST_DELETE:
            newChapters = [...state.chapters];
            action.payload.map((mangaID) =>
                newChapters.map((chapter) =>
                    chapter.mangas.map((manga) => {
                        if (manga._id === mangaID) {
                            manga.inuse = false;
                        }
                        return manga;
                    })
                )
            )
            return {
                ...state,
                chapters: newChapters
            };
        case EDIT_CHAPTER_FROM_POST_EDIT:
            newChapters = [...state.chapters];
            action.payload.prevMangas.map((page) =>
                newChapters.map((chapter) =>
                    chapter.mangas.map((manga) => {
                        if (manga.page === page) {
                            manga.inuse = false;
                        }
                        return manga;
                    })
                )
            )
            action.payload.newMangas.map((page) =>
                newChapters.map((chapter) =>
                    chapter.mangas.map((manga) => {
                        if (manga.page === page) {
                            manga.inuse = true;
                        }
                        return manga;
                    })
                )
            )
            return {
                ...state,
                chapters: newChapters
            };
        case EDIT_CHAPTER_FROM_POST_ADD:
            newChapters = [...state.chapters];

            action.payload.newMangas.map((newManga) =>
                newChapters.map((chapter) =>
                    chapter.mangas.map((manga) => {
                        if (manga.page === newManga.page) {
                            manga.inuse = true;
                        }
                        return manga;
                    })
                )
            )
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