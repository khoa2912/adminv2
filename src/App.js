// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { getUser, isUserLoggedIn } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import { getProducts } from 'actions/product';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = (props) => {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const token = window.localStorage.getItem('token');
    notification.config({
        placement: 'topRight',
        top: 80,
        duration: 3,
        rtl: false
    });
    useEffect(() => {
        if (!token) {
            if (window.location.pathname !== '/login') {
                navigate('/login');
                notification['error']({
                    message: 'Đăng nhập',
                    description: 'Vui lòng đăng nhập để sử dụng hệ thống.'
                });
            }
        }
    }, []);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(getUser(token, props.history));
        }
        dispatch(getProducts());
    }, [dispatch, auth.token]);
    useEffect(() => {
        if (!auth.authenticate) {
            dispatch(isUserLoggedIn());
        }
        if (auth.authenticate) {
            dispatch(getInitialData());
        }
    }, [auth.authenticate]);
    return (
        <ThemeCustomization>
            <ScrollTop>
                <Routes />
            </ScrollTop>
        </ThemeCustomization>
    );
};

export default App;
