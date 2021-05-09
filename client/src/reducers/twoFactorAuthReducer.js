import { CREATE_TOKEN, CREATE_TOKEN_FAIL, VERIFY_TOKEN, VERIFY_TOKEN_FAIL } from '../actions/types';

const initialState = {
  isVerified: null
};

export default function twoFactorAuthReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_TOKEN:
    case CREATE_TOKEN_FAIL:
    case VERIFY_TOKEN_FAIL:
      return {
        ...state
      };
    case VERIFY_TOKEN:
      return {
        ...state,
        isVerified: true
      };
    default:
      return state;
  }
}
