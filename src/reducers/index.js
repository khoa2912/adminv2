import authReducer from './auth';
import { combineReducers } from 'redux';
import userReducer from './user';
import productReducer from './product';
import orderReducer from './order';
import categoryReducer from './category';
import pageReducer from './page';
import menu from './menu';
import role from './role';
import banner from './banner';
import tag from './tag';
import action from './action';
import roleaction from './roleaction';
import infoProduct from './infoProduct';
export const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    order: orderReducer,
    category: categoryReducer,
    page: pageReducer,
    menu: menu,
    role: role,
    banner: banner,
    tag: tag,
    action: action,
    roleaction: roleaction,
    infoProduct: infoProduct
});

export default rootReducer;
