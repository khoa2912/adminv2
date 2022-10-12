import { roleConstants } from 'actions/constants';
import { message } from '../../node_modules/antd/lib/index';

const initState = {
    error: null,
    message: '',
    loading: false,
    roles: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case roleConstants.GET_ALL_ROLE_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case roleConstants.GET_ALL_ROLE_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                roles: action.payload.roles
            };
            break;
        case roleConstants.GET_ALL_ROLE_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case roleConstants.CREATE_ROLE_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case roleConstants.CREATE_ROLE_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'successcreate'
            };
            break;
        case roleConstants.CREATE_ROLE_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case roleConstants.DELETE_ROLE_BY_ID_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case roleConstants.DELETE_ROLE_BY_ID_SUCCESS:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'success'
            };
            break;
        case roleConstants.DELETE_ROLE_BY_ID_FAILURE:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'error'
            };
            break;
        case roleConstants.UPDATE_ROLE_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                // error: ''
                };
            break;
        case roleConstants.UPDATE_ROLE_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success'
            };
            break;
    }
    return state;
};
