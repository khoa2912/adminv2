// third-party
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/index';

// project import

// ==============================|| REDUX TOOLKIT - MAIN STORE ||============================== //

const store = configureStore({
    reducer: rootReducer
});

export default store;
