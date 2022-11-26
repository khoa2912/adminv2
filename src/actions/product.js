import axios from '../helpers/axios';
import { productConstants } from './constants';
import { notification, Space, Popconfirm } from 'antd';
import { message } from '../../node_modules/antd/lib/index';

// new action
export var getProducts = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: productConstants.GET_ALL_PRODUCT_REQUEST });
            const res = await axios.post(`product/getProducts`);
            console.log(res);
            if (res.status === 200) {
                const { products } = res.data;
                products.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: productConstants.GET_ALL_PRODUCT_SUCCESS,
                    payload: { products }
                });
                return products;
            } else {
                dispatch({ type: productConstants.GET_ALL_PRODUCT_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var getProductRelated = (data) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('/product/getProductRelated', data);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };
};


export var getProductWarning = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get(`/productWarning`);
            if(res.status===200){
                return res.data.productWarning
            }
            return []
        } catch (error) {
            console.log(error);
        }
    };
};

// modified actrion
export var addProduct = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: productConstants.ADD_PRODUCT_REQUEST });
            const res = await axios.post('product/create', form);
            if (res.status === 201) {
                dispatch({ type: productConstants.ADD_PRODUCT_SUCCESS });
                dispatch(getProducts());
                return 'success';
            }
            // else if(res.status === 403) {
            //     const { error } = res.data;
            //     dispatch({ type: productConstants.ADD_PRODUCT_FAILURE, payload: { error } });
            //     return 'Khongduquyen'
            // }
            else {
                const { error } = res.data;
                dispatch({ type: productConstants.ADD_PRODUCT_FAILURE, payload: { error } });
            }
        } catch (error) {
            console.log(error);
        }
    };
};
export var getDataFilterProduct = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('/product/getDataFilter', searchModel);
            // console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
// export var editProduct = (form) => {
//     return async (dispatch) => {
//         try {
//             dispatch({ type: productConstants.UPDATE_PRODUCT_REQUEST });
//             const res = await axios.post('product/update', form);
//             console.log(res);
//             if (res.status === 201) {
//                 dispatch({ type: productConstants.UPDATE_PRODUCT_SUCCESS });
//                 dispatch(getProducts());
//                 return 'success';
//             } else {
//                 const { error } = res.data;
//                 dispatch({ type: productConstants.UPDATE_PRODUCT_FAILURE, payload: { error } });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
// };

export var editProduct = (form) => {
    return async (dispatch) => {
        dispatch({ type: productConstants.UPDATE_PRODUCT_REQUEST });
        try {
            const res = await axios.post('product/update', form);
            if (res.status === 201) {
                dispatch({ type: productConstants.UPDATE_PRODUCT_SUCCESS });
                dispatch(getProducts());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: productConstants.UPDATE_PRODUCT_FAILURE,
                    payload: {error}
                });
            }
        } catch (error) {
            dispatch({ type: productConstants.UPDATE_PRODUCT_FAILURE });
            return 'error';
        }
    };
};

// new action
export var deleteProductById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`product/deleteProductById`, {
                data: { payload }
            });
            dispatch({ type: productConstants.DELETE_PRODUCT_BY_ID_REQUEST });
            if (res.status === 202) {
                dispatch({ type: productConstants.DELETE_PRODUCT_BY_ID_SUCCESS });
                dispatch(getProducts());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: productConstants.DELETE_PRODUCT_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: productConstants.DELETE_PRODUCT_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }
    };
};

export var getProductDetailsById = (payload) => {
    return async (dispatch) => {
        dispatch({ type: productConstants.GET_PRODUCT_DETAILS_BY_ID_REQUEST });
        let res;
        try {
            const { productId } = payload.params;
            res = await axios.get(`/product/${productId}`);

            dispatch({
                type: productConstants.GET_PRODUCT_DETAILS_BY_ID_SUCCESS,
                payload: { productDetails: res.data.product }
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: productConstants.GET_PRODUCT_DETAILS_BY_ID_FAILURE,
                payload: { error: res.data.error }
            });
        }
    };
};
