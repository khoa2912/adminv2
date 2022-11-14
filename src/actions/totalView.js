import axios from '../helpers/axios';
import { totalViewConstants } from './constants';

export var addTotalView = (form) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('totalView/createTotalView', form);
        } catch (error) {
            console.log(error);
        }
    };
};

export var getTotalViews = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: totalViewConstants.GET_ALL_VIEW_REQUEST });
            const res = await axios.post('totalView/getTotalViews');
            console.log(res);
            if (res.status === 200) {
                const { total } = res.data;
                total.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: totalViewConstants.GET_ALL_VIEW_SUCCESS,
                    payload: { total }
                });
                console.log(total);
                return total;
            } else {
                dispatch({ type: totalViewConstants.GET_ALL_VIEW_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};
