import {
    GET_CHARACTERS, ADD_CHARACTER, DELETE_CHARACTER, CHARACTERS_LOADING, EDIT_CHARACTER, GET_CHARACTER_BY_ID
} from '../actions/types';

const initialState = {
    characters: [],
    loading: false,
    character: null
};

export default function characterReducer(state = initialState, action) {
    let newcharacters = []
    var index;
    switch (action.type) {
        case GET_CHARACTERS:
            return {
                ...state,
                characters: action.payload,
                loading: false
            };
        case GET_CHARACTER_BY_ID:
            return {
                ...state,
                character: action.payload,
            };
        case ADD_CHARACTER:
            newcharacters = [...state.characters, action.payload]

            return {
                ...state,
                characters: newcharacters,
            };
        case DELETE_CHARACTER:
            return {
                ...state,
                characters: state.characters.filter(character => character._id !== action.payload)
            };
        case EDIT_CHARACTER:
            newcharacters = [...state.characters];
            index = newcharacters.findIndex(element => element._id === action.payload._id);
            newcharacters[index] = action.payload;
            return {
                ...state,
                characters: newcharacters
            };
        case CHARACTERS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}