import axios from '../helpers/axios';
import { screenConstants } from './constants';

export var addScreen = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: screenConstants.CREATE_SCREEN_REQUEST });
            const res = await axios.post('screen/createScreen', form);
            if (res.status === 201) {
                dispatch({ type: screenConstants.CREATE_SCREEN_SUCCESS });
                dispatch(getScreens());
                return 'success';
            } else {
                dispatch({ type: screenConstants.CREATE_SCREEN_FAILURE });
                return 'error';
            }
        } catch (error) {
            dispatch({ type: screenConstants.CREATE_SCREEN_FAILURE });
            return 'error';
        }
    };
};

export var getScreens = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: screenConstants.GET_ALL_SCREEN_REQUEST });
            const res = await axios.post('screen/getScreens');
            console.log(res);
            if (res.status === 200) {
                const { screens } = res.data;
                screens.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: screenConstants.GET_ALL_SCREEN_SUCCESS,
                    payload: { screens }
                });
                return screens;
            } else {
                dispatch({ type: screenConstants.GET_ALL_SCREEN_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var getDataFilterScreen = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('screen/getDataFilterScreen', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
