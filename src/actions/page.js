import { pageConstants } from './constants';
import axios from '../helpers/axios';

export var createPage = (form) => {
    return async (dispatch) => {
        dispatch({ type: pageConstants.CREATE_PAGE_REQUEST });
        try {
            const res = await axios.post('/page/create', form);
            if (res.status === 201) {
                dispatch({
                    type: pageConstants.CREATE_PAGE_SUCCESS,
                    payload: { page: res.data.page }
                });
            } else {
                dispatch({
                    type: pageConstants.CREATE_PAGE_FAILURE,
                    payload: { error: res.data.error }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var getPages = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: pageConstants.GET_ALL_PAGE_REQUEST });
            const res = await axios.post('page/getPages');
            console.log(res);
            if (res.status === 200) {
                const { pages } = res.data;
                pages.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: pageConstants.GET_ALL_PAGE_SUCCESS,
                    payload: { pages }
                });
                return pages;
            } else {
                dispatch({ type: pageConstants.GET_ALL_PAGE_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var getDataFilterPage = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('page/getDataFilterPage', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
