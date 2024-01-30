import { SET_USER, CLEAR_USER } from './actions';

const initialState = {
    user: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload,
            };
        case CLEAR_USER:
            return initialState;
        default:
            return state;
    }
};

export default userReducer;
