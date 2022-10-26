import axios from '../helpers/axios';
import { roleactionConstants } from './constants';

export var getRoleActions = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: roleactionConstants.GET_ALL_ROLEACTION_REQUEST });
            const res = await axios.post('roleaction/getRoleActions');
            console.log(res);
            if (res.status === 200) {
                const { roleactions } = res.data;
                roleactions.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: roleactionConstants.GET_ALL_ROLEACTION_SUCCESS,
                    payload: { roleactions }
                });
                console.log(roleactions);
                return roleactions;
            } else {
                dispatch({ type: roleactionConstants.GET_ALL_ROLEACTION_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var addRoleAction = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: roleactionConstants.CREATE_ROLEACTION_REQUEST });
            const res = await axios.post('roleaction/createRoleAction', form);
            if (res.status === 201) {
                dispatch({ type: roleactionConstants.CREATE_ROLEACTION_SUCCESS });
                dispatch(getRoleActions());
                return 'success';
            } else {
                dispatch({ type: roleactionConstants.CREATE_ROLEACTION_FAILURE });
                return 'error';
            }
        } catch (error) {
            dispatch({ type: roleactionConstants.CREATE_ROLEACTION_FAILURE });
            return 'error';
        }
    };
};

export var deleteRoleActionById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete('roleaction/deleteRoleActionById', {
                data: { payload }
            });
            dispatch({ type: roleactionConstants.DELETE_ROLEACTION_BY_ID_REQUEST });
            if (res.status === 202) {
                dispatch({ type: roleactionConstants.DELETE_ROLEACTION_BY_ID_SUCCESS });
                dispatch(getRoleActions());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: roleactionConstants.DELETE_ROLEACTION_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: roleactionConstants.DELETE_ROLEACTION_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }
    };
};

export var updateRoleAction = (form) => {
    return async (dispatch) => {
        dispatch({ type: roleactionConstants.UPDATE_ROLEACTION_REQUEST });
        try {
            const res = await axios.post('roleaction/updateRoleAction', form);
            if (res.status === 201) {
                dispatch({ type: roleactionConstants.UPDATE_ROLEACTION_SUCCESS });
                dispatch(getRoleActions());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: roleactionConstants.UPDATE_ROLEACTION_FAILURE,
                    payload: {error}
                });
            }
        } catch (error) {
            dispatch({ type: roleactionConstants.UPDATE_ROLEACTION_FAILURE });
            return 'error';
        }
    };
};

export var getDataFilterRoleAction = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('roleaction/getDataFilterRoleAction', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
