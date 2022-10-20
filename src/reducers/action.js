import { actionConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    actions: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case actionConstants.GET_ALL_ACTION_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case actionConstants.GET_ALL_ACTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                actions: action.payload.actions
            };
            break;
        case actionConstants.GET_ALL_ACTION_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case actionConstants.CREATE_ACTION_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case actionConstants.CREATE_ACTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'successcreate'
            };
            break;
        case actionConstants.DELETE_ACTION_BY_ID_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case actionConstants.DELETE_ACTION_BY_ID_SUCCESS:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'success'
            };
            break;
        case actionConstants.DELETE_ACTION_BY_ID_FAILURE:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'error'
            };
            break;
        case actionConstants.UPDATE_ACTION_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
                };
            break;
        case actionConstants.UPDATE_ACTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success'
            };
            break;
    }
    return state;
};
