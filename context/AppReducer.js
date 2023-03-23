export const initialState = {
  cart: [],
};
export const AppReducer = (state, action) => {
  switch (action.type) {
    case "UPDATECART": {
      return {
        ...state,
        cart: action.value,
      };
    }
    default:
      return state;
  }
};
