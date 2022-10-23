import { tagConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    tags: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case tagConstants.GET_ALL_TAG_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case tagConstants.GET_ALL_TAG_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                tags: action.payload.tags
            };
            break;
        case tagConstants.GET_ALL_TAG_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case tagConstants.CREATE_TAG_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case tagConstants.CREATE_TAG_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'successcreate'
            };
            break;
        case tagConstants.DELETE_TAG_BY_ID_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case tagConstants.DELETE_TAG_BY_ID_SUCCESS:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'success'
            };
            break;
        case tagConstants.DELETE_TAG_BY_ID_FAILURE:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'error'
            };
            break;
        case tagConstants.UPDATE_TAG_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
                };
            break;
        case tagConstants.UPDATE_TAG_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success'
            };
            break;
    }
    return state;
};
