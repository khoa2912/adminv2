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
    }
    return state;
};
