import role from 'reducers/role';
import axios from '../helpers/axios';
import { roleConstants } from './constants';
export var getAllRole = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: roleConstants.GETALL_ROLE_REQUEST });
            const res = await axios.get(`role/getRoles`);
            if (res.status === 200) {
                const { allRole } = res.data;
                dispatch({
                    type: roleConstants.GETALL_ROLE_SUCCESS,
                    payload: { roles: allRole }
                });
            } else {
                dispatch({
                    type: roleConstants.GETALL_ROLE_FAILURE
                });
            }
        } catch (err) {
            dispatch({
                type: roleConstants.GETALL_ROLE_FAILURE
            });
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
                dispatch(getAllRole());
            } else {
                dispatch({ type: roleConstants.CREATE_ROLE_FAILURE });
            }
        } catch (error) {
            dispatch({ type: roleConstants.CREATE_ROLE_FAILURE });
        }
    };
};
