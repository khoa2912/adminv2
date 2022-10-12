import { screenConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    banners: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case screenConstants.GET_ALL_SCREEN_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case screenConstants.GET_ALL_SCREEN_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                screens: action.payload.screens
            };
            break;
        case screenConstants.GET_ALL_SCREEN_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case screenConstants.CREATE_SCREEN_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
                };
            break;
        case screenConstants.CREATE_SCREEN_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'successcreate'
            };
            break;
        case screenConstants.DELETE_SCREEN_BY_ID_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case screenConstants.DELETE_SCREEN_BY_ID_SUCCESS:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'success'
            };
            break;
        case screenConstants.DELETE_SCREEN_BY_ID_FAILURE:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'error'
            };
            break;
        case screenConstants.UPDATE_SCREEN_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                // error: ''
                };
            break;
        case screenConstants.UPDATE_SCREEN_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success'
            };
            break;
    }
    return state;
};