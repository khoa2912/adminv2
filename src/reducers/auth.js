import { authConstants } from 'actions/constants';

const initState = {
    tokenres: null,
    token: null,
    user: {
        firstName: '',
        lastName: '',
        email: '',
        picture: ''
    },
    authenticate: false,
    authenticating: false,
    loading: false,
    error: null,
    message: null,
    users: []
};

export default (state = initState, action) => {
    switch (action.type) {
        case authConstants.GET_ALL_USER_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case authConstants.GET_ALL_USER_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                users: action.payload.allUsers
            };
            break;
        case authConstants.GET_ALL_USER_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case authConstants.LOGIN_REQUEST:
            state = {
                ...state,
                loading: true,
                authenticating: true,
                error: null,
                message: null
            };
            break;
        case authConstants.LOGIN_SUCCESS:
            state = {
                ...state,
                tokenres: action.payload.token,
                authenticating: false,
                message: 'loginsuccess'
            };
            break;
        case authConstants.LOGIN_FAILURE:
            state = {
                ...state,
                authenticating: false,
                message: 'loginerror'
            };
            break;
        case authConstants.LOGOUT_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case authConstants.LOGOUT_SUCCESS:
            state = {
                ...initState
            };
            break;
        case authConstants.LOGOUT_FAILURE:
            state = {
                ...state,
                error: action.payload.error,
                loading: false
            };
            break;
        case authConstants.GETTOKEN_SUCCESS:
            state = {
                ...state,
                token: action.payload.token
            };
            break;
        case authConstants.GETUSER_SUCCESS:
            state = {
                ...state,
                user: action.payload.user,
                authenticate: true
            };
            break;
        case authConstants.GET_USERS_SUCCESS:
            state = {
                ...state,
                users: action.payload.users,
                loading: false
            };
            break;
        case authConstants.GET_USERS_REQUEST:
            state = {
                ...state,
                loading: true
            };
        case 'USERNONLOGIN':
            state = {
                ...state,
                message: 'usernonlogin'
            };
    }

    return state;
};
