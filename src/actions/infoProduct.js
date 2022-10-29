import axios from '../helpers/axios';
import { infoProductConstants } from './constants';

export var getInfoProducts = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: infoProductConstants.GET_ALL_INFO_PRODUCT_REQUEST });
            const res = await axios.post('infoProduct/getInfoProducts');
            console.log(res);
            if (res.status === 200) {
                const { infoProducts } = res.data;
                infoProducts.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: infoProductConstants.GET_ALL_INFO_PRODUCT_SUCCESS,
                    payload: { infoProducts }
                });
                console.log(infoProducts);
                return infoProducts;
            } else {
                dispatch({ type: infoProductConstants.GET_ALL_INFO_PRODUCT_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var createInfoProduct = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: infoProductConstants.CREATE_INFO_PRODUCT_REQUEST });
            const res = await axios.post('infoProduct/createInfoProduct', form);
            if (res.status === 201) {
                dispatch({ type: infoProductConstants.CREATE_INFO_PRODUCT_SUCCESS });
                dispatch(getInfoProducts());
                return 'success';
            } else {
                dispatch({ type: infoProductConstants.CREATE_INFO_PRODUCT_FAILURE });
                return 'error';
            }
        } catch (error) {
            dispatch({ type: infoProductConstants.CREATE_INFO_PRODUCT_FAILURE });
            return 'error';
        }
    };
};

export var deleteInfoProductById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete('infoProduct/deleteInfoProductById', {
                data: { payload }
            });
            dispatch({ type: infoProductConstants.DELETE_INFO_PRODUCT_BY_ID_REQUEST });
            if (res.status === 202) {
                dispatch({ type: infoProductConstants.DELETE_INFO_PRODUCT_BY_ID_SUCCESS });
                dispatch(getInfoProducts());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: infoProductConstants.DELETE_INFO_PRODUCT_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: infoProductConstants.DELETE_INFO_PRODUCT_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }
    };
};

export var updateInfoProduct = (form) => {
    return async (dispatch) => {
        dispatch({ type: infoProductConstants.UPDATE_INFO_PRODUCT_REQUEST });
        try {
            const res = await axios.post('infoProduct/updateInfoProduct', form);
            if (res.status === 201) {
                dispatch({ type: infoProductConstants.UPDATE_INFO_PRODUCT_SUCCESS });
                dispatch(getInfoProducts());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: infoProductConstants.UPDATE_INFO_PRODUCT_FAILURE,
                    payload: {error}
                });
            }
        } catch (error) {
            dispatch({ type: infoProductConstants.UPDATE_INFO_PRODUCT_FAILURE });
            return 'error';
        }
    };
};

export var getDataFilterInfoProduct = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('infoProduct/getDataFilterInfoProduct', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
