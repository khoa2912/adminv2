import { orderConstants } from 'actions/constants';

const initState = {
    orders: [],
    loading: false,
    error: null
};

export default (state = initState, action) => {
    switch (action.type) {
        case orderConstants.GET_CUSTOMER_ORDER_REQUEST:
            state = {
                ...state,
                loading: true
            };
            break;
        case orderConstants.GET_CUSTOMER_ORDER_SUCCESS:
            state = {
                ...state,
                orders: action.payload.orders,
                loading: false
            };
            break;
        case orderConstants.GET_CUSTOMER_ORDER_FAILURE:
            state = {
                ...state,
                error: 'error',
                loading: false
            };
            break;
        case orderConstants.GET_Data_Sales_REQUEST:
            state = {
                ...state,
                loading: true
            };

            break;
        case orderConstants.GET_Data_Sales_SUCCESS:
            state = {
                ...state,
                orders: action.payload.orders,
                loading: false
            };

            break;
    }

    return state;
};
