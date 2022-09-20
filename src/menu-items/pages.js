// assets
import { LoginOutlined, ProfileOutlined, ApartmentOutlined } from '@ant-design/icons';

// icons
const icons = {
    LoginOutlined,
    ProfileOutlined,
    ApartmentOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'media',
    title: 'Hệ thống',
    type: 'group',
    children: [
        {
            id: 'logout',
            title: 'Phân quyền',
            type: 'item',
            url: '/role',
            icon: icons.ApartmentOutlined
        }
    ]
};

export default pages;
