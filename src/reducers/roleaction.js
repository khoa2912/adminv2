import { roleactionConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    roleactions: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case roleactionConstants.GET_ALL_ROLEACTION_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case roleactionConstants.GET_ALL_ROLEACTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                roleactions: action.payload.roleactions
            };
            break;
        case roleactionConstants.GET_ALL_ROLEACTION_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case roleactionConstants.CREATE_ROLEACTION_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case roleactionConstants.CREATE_ROLEACTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'successcreate'
            };
            break;
        case roleactionConstants.DELETE_ROLEACTION_BY_ID_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case roleactionConstants.DELETE_ROLEACTION_BY_ID_SUCCESS:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'success'
            };
            break;
        case roleactionConstants.DELETE_ROLEACTION_BY_ID_FAILURE:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'error'
            };
            break;
        case roleactionConstants.UPDATE_ROLEACTION_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
                };
            break;
        case roleactionConstants.UPDATE_ROLEACTION_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success'
            };
            break;
    }
    return state;
};
