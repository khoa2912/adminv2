import { infoProductConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    infoProducts: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case infoProductConstants.GET_ALL_INFO_PRODUCT_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case infoProductConstants.GET_ALL_INFO_PRODUCT_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                infoProducts: action.payload.infoProducts
            };
            break;
        case infoProductConstants.GET_ALL_INFO_PRODUCT_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case infoProductConstants.CREATE_INFO_PRODUCT_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case infoProductConstants.CREATE_INFO_PRODUCT_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'successcreate'
            };
            break;
        case infoProductConstants.DELETE_INFO_PRODUCT_BY_ID_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case infoProductConstants.DELETE_INFO_PRODUCT_BY_ID_SUCCESS:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'success'
            };
            break;
        case infoProductConstants.DELETE_INFO_PRODUCT_BY_ID_FAILURE:
            state = {
                ...state,
                loading: false,
                deleteMessage: 'error'
            };
            break;
        case infoProductConstants.UPDATE_INFO_PRODUCT_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
                };
            break;
        case infoProductConstants.UPDATE_INFO_PRODUCT_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success'
            };
            break;
    }
    return state;
};
