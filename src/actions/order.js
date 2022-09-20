import axios from '../helpers/axios';
import { orderConstants } from './constants';

export var getOrders = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: orderConstants.GET_ALL_ORDER_REQUEST });
            const res = await axios.post('admin/order/getOrders');
            console.log(res);
            if (res.status === 200) {
                const { orders } = res.data;
                orders.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: orderConstants.GET_ALL_ORDER_SUCCESS,
                    payload: { orders }
                });
                return orders;
            } else {
                dispatch({ type: orderConstants.GET_ALL_ORDER_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};
export var getCustomerOrders = () => {
    return async (dispatch) => {
        dispatch({ type: orderConstants.GET_CUSTOMER_ORDER_REQUEST });
        try {
            const res = await axios.post('admin/order/getCustomerOrders');
            if (res.status === 200) {
                const { orders } = res.data;
                dispatch({
                    type: orderConstants.GET_CUSTOMER_ORDER_SUCCESS,
                    payload: { orders }
                });
            } else {
                const { error } = res.data;
                dispatch({
                    type: orderConstants.GET_CUSTOMER_ORDER_FAILURE,
                    payload: { error }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: orderConstants.GET_CUSTOMER_ORDER_FAILURE,
                payload: { error }
            });
        }
    };
};

export var updateOrder = (payload) => {
    return async (dispatch) => {
        dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_REQUEST });
        try {
            const res = await axios.post('admin/order/update', payload);
            if (res.status === 201) {
                dispatch({ type: orderConstants.UPDATE_CUSTOMER_ORDER_SUCCESS });
                dispatch(getCustomerOrders());
            } else {
                const { error } = res.data;
                dispatch({
                    type: orderConstants.UPDATE_CUSTOMER_ORDER_FAILURE,
                    payload: { error }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var deleteOrderById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete(`admin/order/deleteOrderById`, {
                data: { payload }
            });
            dispatch({ type: orderConstants.DELETE_ORDER_REQUEST });
            if (res.status === 202) {
                dispatch({ type: orderConstants.DELETE_ORDER_SUCCESS });
                dispatch(getCustomerOrders());
            } else {
                const { error } = res.data;
                dispatch({
                    type: orderConstants.DELETE_ORDER_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var getDataFilterOrder = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('admin/order/getDataFilterOrder', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
