import axios from '../helpers/axios';
import { actionConstants } from './constants';

export var getActions = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: actionConstants.GET_ALL_ACTION_REQUEST });
            const res = await axios.post('action/getActions');
            console.log(res);
            if (res.status === 200) {
                const { actions } = res.data;
                actions.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: actionConstants.GET_ALL_ACTION_SUCCESS,
                    payload: { actions }
                });
                console.log(actions);
                return actions;
            } else {
                dispatch({ type: actionConstants.GET_ALL_ACTION_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var addAction = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: actionConstants.CREATE_ACTION_REQUEST });
            const res = await axios.post('action/createAction', form);
            if (res.status === 201) {
                dispatch({ type: actionConstants.CREATE_ACTION_SUCCESS });
                dispatch(getActions());
                return 'success';
            } else {
                dispatch({ type: actionConstants.CREATE_ACTION_FAILURE });
                return 'error';
            }
        } catch (error) {
            dispatch({ type: actionConstants.CREATE_ACTION_FAILURE });
            return 'error';
        }
    };
};

export var deleteActionById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete('action/deleteActionById', {
                data: { payload }
            });
            dispatch({ type: actionConstants.DELETE_ACTION_BY_ID_REQUEST });
            if (res.status === 202) {
                dispatch({ type: actionConstants.DELETE_ACTION_BY_ID_SUCCESS });
                dispatch(getActions());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: actionConstants.DELETE_ACTION_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: actionConstants.DELETE_ACTION_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }
    };
};

export var updateAction = (form) => {
    return async (dispatch) => {
        dispatch({ type: actionConstants.UPDATE_ACTION_REQUEST });
        try {
            const res = await axios.post('action/updateAction', form);
            if (res.status === 201) {
                dispatch({ type: actionConstants.UPDATE_ACTION_SUCCESS });
                dispatch(getActions());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: actionConstants.UPDATE_ACTION_FAILURE,
                    payload: {error}
                });
            }
        } catch (error) {
            dispatch({ type: actionConstants.UPDATE_ACTION_FAILURE });
            return 'error';
        }
    };
};

export var getDataFilterAction = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('action/getDataFilterAction', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
