import { GET_MSGS, CLEAR_MSGS } from './types';

// RETURN MESSAGES
export const returnMsgs = (msg, status, id = null) => {
  return {
    type: GET_MSGS,
    payload: { msg, status, id }
  };
};

// CLEAR MESSAGES
export const clearMsgs = () => {
  return {
    type: CLEAR_MSGS
  };
};
