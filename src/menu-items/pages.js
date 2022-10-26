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
        },
        {
            id: 'logouted',
            title: 'Action',
            type: 'item',
            url: '/action',
            icon: icons.ApartmentOutlined
        },
        {
            id: 'roleaction',
            title: 'RoleActions',
            type: 'item',
            url: '/roleaction',
            icon: icons.ApartmentOutlined
        }
    ]
};

export default pages;
