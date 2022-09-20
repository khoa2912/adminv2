import axios from '../helpers/axios';
import { categoryConstants } from './constants';

export var getAllCategory = () => {
    return async (dispatch) => {
        dispatch({ type: categoryConstants.GET_ALL_CATEGORIES_REQUEST });
        const res = await axios.get(`category/getcategory`);
        if (res.status === 200) {
            const { categoryList } = res.data;
            console.log(categoryList);
            dispatch({
                type: categoryConstants.GET_ALL_CATEGORIES_SUCCESS,
                payload: { categories: categoryList }
            });
            return categoryList;
        } else {
            dispatch({
                type: categoryConstants.GET_ALL_CATEGORIES_FAILURE,
                payload: { error: res.data.error }
            });
        }
    };
};

export var addCategory = (form) => {
    return async (dispatch) => {
        dispatch({ type: categoryConstants.ADD_NEW_CATEGORIES_REQUEST });

        try {
            const res = await axios.post('/category/create', form);
            if (res.status === 201) {
                dispatch({
                    type: categoryConstants.ADD_NEW_CATEGORIES_SUCCESS,
                    payload: { category: res.data.category }
                });
                dispatch(getAllCategory());
            } else {
                dispatch({
                    type: categoryConstants.ADD_NEW_CATEGORIES_FAILURE,
                    payload: res.data.error
                });
            }
        } catch (error) {
            console.log(error.response);
        }
    };
};

export var updateCategories = (form) => {
    return async (dispatch) => {
        dispatch({ type: categoryConstants.UPDATE_CATEGORIES_REQUEST });
        const res = await axios.post(`/category/update`, form);
        if (res.status === 201) {
            dispatch({ type: categoryConstants.UPDATE_CATEGORIES_SUCCESS });
            dispatch(getAllCategory());
        } else {
            const { error } = res.data;
            dispatch({
                type: categoryConstants.UPDATE_CATEGORIES_FAILURE,
                payload: { error }
            });
        }
    };
};

export var deleteCategories = (ids) => {
    return async (dispatch) => {
        dispatch({ type: categoryConstants.DELETE_CATEGORIES_REQUEST });
        const res = await axios.post(`/category/delete`, {
            payload: {
                ids
            }
        });
        if (res.status == 201) {
            dispatch(getAllCategory());
            dispatch({ type: categoryConstants.DELETE_CATEGORIES_SUCCESS });
        } else {
            const { error } = res.data;
            dispatch({
                type: categoryConstants.DELETE_CATEGORIES_FAILURE,
                payload: { error }
            });
        }
    };
};
export var getDataFilter = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('/category/getDataFilter', searchModel);
            console.log(res);
            return res.data.result;
        } catch (e) {
            console.log(e);
        }
    };
};
