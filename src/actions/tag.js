import axios from '../helpers/axios';
import { tagConstants } from './constants';

export var getTags = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: tagConstants.GET_ALL_TAG_REQUEST });
            const res = await axios.post('tag/getTags');
            console.log(res);
            if (res.status === 200) {
                const { tags } = res.data;
                tags.map((item, index) => (item.id = index + 1));
                dispatch({
                    type: tagConstants.GET_ALL_TAG_SUCCESS,
                    payload: { tags }
                });
                console.log(tags);
                return tags;
            } else {
                dispatch({ type: tagConstants.GET_ALL_TAG_FAILURE });
            }
        } catch (error) {
            console.log(error);
        }
    };
};

export var addTag = (form) => {
    return async (dispatch) => {
        try {
            dispatch({ type: tagConstants.CREATE_TAG_REQUEST });
            const res = await axios.post('tag/createTag', form);
            if (res.status === 201) {
                dispatch({ type: tagConstants.CREATE_TAG_SUCCESS });
                dispatch(getTags());
                return 'success';
            } else {
                dispatch({ type: tagConstants.CREATE_TAG_FAILURE });
                return 'error';
            }
        } catch (error) {
            dispatch({ type: tagConstants.CREATE_TAG_FAILURE });
            return 'error';
        }
    };
};

export var deleteTagById = (payload) => {
    return async (dispatch) => {
        try {
            const res = await axios.delete('tag/deleteTagById', {
                data: { payload }
            });
            dispatch({ type: tagConstants.DELETE_TAG_BY_ID_REQUEST });
            if (res.status === 202) {
                dispatch({ type: tagConstants.DELETE_TAG_BY_ID_SUCCESS });
                dispatch(getTags());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: tagConstants.DELETE_TAG_BY_ID_FAILURE,
                    payload: {
                        error
                    }
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: tagConstants.DELETE_TAG_BY_ID_FAILURE,
                payload: {
                    error
                }
            });
        }
    };
};

export var updateTag = (form) => {
    return async (dispatch) => {
        dispatch({ type: tagConstants.UPDATE_TAG_REQUEST });
        try {
            const res = await axios.post('tag/updateTag', form);
            if (res.status === 201) {
                dispatch({ type: tagConstants.UPDATE_TAG_SUCCESS });
                dispatch(getTags());
                return 'success';
            } else {
                const { error } = res.data;
                dispatch({
                    type: tagConstants.UPDATE_TAG_FAILURE,
                    payload: {error}
                });
            }
        } catch (error) {
            dispatch({ type: tagConstants.UPDATE_TAG_FAILURE });
            return 'error';
        }
    };
};

export var getDataFilterTag = (searchModel) => {
    return async (dispatch) => {
        try {
            const res = await axios.post('tag/getDataFilterTag', searchModel);
            console.log(res);
            return res.data.result.docs;
        } catch (e) {
            console.log(e);
        }
    };
};
