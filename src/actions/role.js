import role from 'reducers/role';
import axios from '../helpers/axios';
import { roleConstants } from './constants';

export var getRoles = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: roleConstants.GET_ALL_ROLE_REQUEST });
            const res = await axios.post('role/getRoles');
            console.log(res);
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
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
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
            } else {
                dispatch({ type: roleConstants.CREATE_ROLE_FAILURE });
            }
        } catch (error) {
            dispatch({ type: roleConstants.CREATE_ROLE_FAILURE });
        }
    };
};
