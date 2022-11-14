import { totalViewConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    total: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case totalViewConstants.GET_ALL_VIEW_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case totalViewConstants.GET_ALL_VIEW_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                total: action.payload.total
            };
            break;
        case totalViewConstants.GET_ALL_VIEW_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
    }
    return state;
};
