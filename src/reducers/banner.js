import { bannerConstants } from 'actions/constants';

const initState = {
    error: null,
    message: '',
    loading: false,
    banners: []
};
export default (state = initState, action) => {
    switch (action.type) {
        case bannerConstants.GET_ALL_BANNER_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case bannerConstants.GET_ALL_BANNER_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'success',
                banners: action.payload.allBanners
            };
            break;
        case bannerConstants.GET_ALL_BANNER_FAILURE:
            state = {
                ...state,
                loading: false,
                error: 'error'
            };
            break;
        case bannerConstants.CREATE_BANNER_REQUEST:
            state = {
                ...state,
                loading: true,
                message: '',
                error: ''
            };
            break;
        case bannerConstants.CREATE_BANNER_SUCCESS:
            state = {
                ...state,
                loading: false,
                message: 'successcreate'
            };
            break;
    }
    return state;
};
