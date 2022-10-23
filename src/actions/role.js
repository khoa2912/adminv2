import role from 'reducers/role';
import axios from '../helpers/axios';
import { roleConstants } from './constants';

export var getRoles = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: roleConstants.GET_ALL_ROLE_REQUEST });
            const res = await axios.post('role/getRoles');
            // console.log(res);
            if (res.status === 200) {
                const { roles } = res.data;
                roles.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: roleConstants.GET_ALL_ROLE_SUCCESS,
                    payload: { roles }
                });
                return roles;
            } else {
                dispatch({ type: roleConstants.GET_ALL_ROLE_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var getDataFilterRole = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('role/getDataFilterRole', searchModel);
            // console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};

export var deleteRoleById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete('role/deleteRoleById', {
                data: { payload }
            });
            dispatch({ type: roleConstants.DELETE_ROLE_BY_ID_REQUEST });
            if (res.status === 202) {
                dispatch({ type: roleConstants.DELETE_ROLE_BY_ID_SUCCESS });
                dispatch(getRoles());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: roleConstants.DELETE_ROLE_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: roleConstants.DELETE_ROLE_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }
    };
};

export var updateRole = (form) => {
    return async (dispatch) => {
        dispatch({ type: roleConstants.UPDATE_ROLE_REQUEST });
        try {
            const res = await axios.post('role/updateRole', form);
            if (res.status === 201) {
                dispatch({ type: roleConstants.UPDATE_ROLE_SUCCESS });
                dispatch(getRoles());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: roleConstants.UPDATE_ROLE_FAILURE,
                    payload: {error}
                });
            }
        } catch (error) {
            dispatch({ type: roleConstants.UPDATE_ROLE_FAILURE });
            return 'error';
        }
    };
};

export var addRole = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: roleConstants.CREATE_ROLE_REQUEST });
            const res = await axios.post('role/create', form);
            if (res.status === 201) {
                dispatch({ type: roleConstants.CREATE_ROLE_SUCCESS });
                dispatch(getRoles());
                return 'success';
            } else {
                dispatch({ type: roleConstants.CREATE_ROLE_FAILURE });
            }
        } catch (error) {
            dispatch({ type: roleConstants.CREATE_ROLE_FAILURE });
        }
    };
};
