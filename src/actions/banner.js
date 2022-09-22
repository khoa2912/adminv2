import axios from '../helpers/axios';
import { bannerConstants } from './constants';

export var getBanners = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: bannerConstants.GET_ALL_BANNER_REQUEST });
            const res = await axios.post('banner/getBanners');
            console.log(res);
            if (res.status === 200) {
                const { banners } = res.data;
                banners.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: bannerConstants.GET_ALL_BANNER_SUCCESS,
                    payload: { banners }
                });
                return banners;
            } else {
                dispatch({ type: bannerConstants.GET_ALL_BANNER_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var addBanner = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: bannerConstants.CREATE_BANNER_REQUEST });
            const res = await axios.post('banner/createBanner', form);
            if (res.status === 201) {
                dispatch({ type: bannerConstants.CREATE_BANNER_SUCCESS });
                dispatch(getBanners());
                return 'success';
            } else {
                dispatch({ type: bannerConstants.CREATE_ROLE_FAILURE });
                return 'error';
            }
        } catch (error) {
            dispatch({ type: bannerConstants.CREATE_ROLE_FAILURE });
            return 'error';
        }
    };
};

export var getDataFilterBanner = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('banner/getDataFilterBanner', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
