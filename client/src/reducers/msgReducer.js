import { GET_MSGS, CLEAR_MSGS } from '../actions/types';

const initialState = {
  msg: {},
  status: null,
  id: null
};

export default function msgReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MSGS:
      return {
        msg: action.payload.msg,
        status: action.payload.status,
        id: action.payload.id
      };
    case CLEAR_MSGS:
      return {
        msg: {},
        status: null,
        id: null
      };
    default:
      return state;
  }
}
