import { getProducts } from '.';
import axios from '../helpers/axios';
import { authConstants } from './constants';

export var login = (user) => {
    return async (dispatch) => {
        try {
            dispatch({ type: authConstants.LOGIN_REQUEST });
            const res = await axios.post('/admin/signin', {
                ...user
            });

            if (res.status === 200) {
                const { token } = res.data;
                localStorage.setItem('refreshtoken', token);

                dispatch({
                    type: authConstants.LOGIN_SUCCESS,
                    payload: {
                        token
                    }
                });
                dispatch(getToken(token));
                dispatch(getProducts());
            } else {
                dispatch({
                    type: authConstants.LOGIN_FAILURE
                });
            }
        } catch (err) {
            dispatch({
                type: authConstants.LOGIN_FAILURE
            });
        }
    };
};

export var signup = (user) => {
    return async (dispatch) => {
        dispatch({ type: authConstants.LOGIN_REQUEST });
        const res = await axios.post('/admin/signup', {
            ...user
        });

        if (res.status === 200) {
            const { message } = res.data;
            dispatch({
                type: authConstants.LOGIN_SUCCESS,
                payload: {
                    message
                }
            });
        } else {
            if (res.status === 400) {
                dispatch({
                    type: authConstants.LOGIN_FAILURE,
                    payload: { error: res.data.error }
                });
            }
        }
        dispatch({
            type: authConstants.LOGIN_REQUEST,
            payload: {
                ...user
            }
        });
    };
};

export var isUserLoggedIn = () => {
    return async (dispatch) => {
        const token = localStorage.getItem('token');
        if (token) {
            const user = JSON.parse(localStorage.getItem('user'));
            dispatch({
                type: authConstants.LOGIN_SUCCESS,
                payload: {
                    token,
                    user
                }
            });
        } else {
            dispatch({
                type: 'USERNONLOGIN',
                payload: { error: null }
            });
        }
    };
};
export var signout = () => {
    return async (dispatch) => {
        dispatch({ type: authConstants.LOGOUT_REQUEST });
        // const res = await axios.post('/admin/signout');
        localStorage.clear();
        dispatch({
            type: authConstants.LOGOUT_SUCCESS
        });
    };
};
export var getToken = (refreshtoken) => {
    return async (dispatch) => {
        try {
            dispatch({ type: authConstants.GETTOKEN_REQUEST });
            const res = await axios.post('/admin/refresh_token', { refreshtoken: refreshtoken });

            localStorage.setItem('token', res.data.access_token);

            dispatch({
                type: authConstants.GETTOKEN_SUCCESS,
                payload: { token: res.data.access_token }
            });
            dispatch(getUser(res.data.access_token));
        } catch (error) {
            /* const { data } = error.response; */
        }
    };
};

export var getUser = (token, history) => {
    return async (dispatch) => {
        try {
            dispatch({ type: authConstants.GETUSER_REQUEST });
            const res = await axios.get('/admin/infor');
            localStorage.setItem('user', JSON.stringify(res.data));
            dispatch({
                type: authConstants.GETUSER_SUCCESS,
                payload: { user: res.data }
            });
            dispatch(getProducts());
        } catch (error) {
            /* const { data } = error.response; */
        }
    };
};

export var getUsers = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: authConstants.GET_ALL_USER_REQUEST });
            const res = await axios.post('admin/getUsers');
            console.log(res);
            if (res.status === 200) {
                const { users } = res.data;
                users.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: authConstants.GET_ALL_USER_SUCCESS,
                    payload: { users }
                });
                return users;
            } else {
                dispatch({ type: authConstants.GET_ALL_USER_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var addUser = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: authConstants.CREATE_USER_REQUEST });
            const res = await axios.post('admin/createUser', form);
            if (res.status === 201) {
                dispatch({ type: authConstants.CREATE_USER_SUCCESS });
                dispatch(getUsers());
                return 'success';
            } else {
                dispatch({ type: authConstants.CREATE_USER_FAILURE });
                return 'error';
            }
        } catch (error) {
            dispatch({ type: authConstants.CREATE_USER_FAILURE });
            return 'error';
        }
    };
};

export var deleteAccountById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete('admin/deleteAccountById', {
                data: { payload }
            });
            dispatch({ type: authConstants.DELETE_ACCOUNT_BY_ID_REQUEST });
            if (res.status === 202) {
                dispatch({ type: authConstants.DELETE_ACCOUNT_BY_ID_SUCCESS });
                dispatch(getUsers());
            } else {
                const { error } = res.data;
                dispatch({
                    type: authConstants.DELETE_ACCOUNT_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: authConstants.DELETE_ACCOUNT_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }
    };
};

export var getDataFilterUser = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('admin/getDataFilterUser', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
