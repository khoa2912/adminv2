// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined,
    DesktopOutlined,
    UserOutlined,
    TagsOutlined,
    UnorderedListOutlined,
    ProjectOutlined,
    ProfileOutlined
} from '@ant-design/icons';

// icons
const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined,
    DesktopOutlined,
    UserOutlined,
    TagsOutlined,
    UnorderedListOutlined,
    ProjectOutlined,
    ProfileOutlined,
    DesktopOutlined
};

// ==============================|| MENU ITEMS - User Infomation ||============================== //
const userInfo = {
    id: 'userInfo',
    title: 'Quản lý thương hiệu và sản phẩm',
    type: 'group',
    children: [
        {
            id: 'info-user',
            title: 'Thông tin cá nhân',
            type: 'item',
            url: '/category',
            icon: icons.TagsOutlined
        },
    ]
};

export default userInfo;