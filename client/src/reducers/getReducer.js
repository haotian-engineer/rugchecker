import { Actions } from '../actions/types';

const initialState = {
  searched: {},
  tokens: [],
  loading: false,
  errors: {}
};

const getReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.LOADING: {
      return {
        ...state,
        loading: true,
      }
    }
    case Actions.GET_TOKENS: {
      return {
        ...state,
        loading: false,
        tokens: payload
      }
    }
    case Actions.SEARCH: {
      return {
        ...state,
        loading: false,
        searched: payload
      }
    }
    case Actions.CHECK: {
      return {
        ...state,
        loading: false,
        tokens: payload
      }
    }
    case Actions.ERROR: {
      return {
        ...state,
        loading: false,
        errors: payload,
        searched: {}
      }
    }
    case Actions.REMOVE_ERROR: {
      return {
        ...state,
        loading: false,
        errors: {}
      }
    }
    default:
      return state;
  }
}

export default getReducer;
