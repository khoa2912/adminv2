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

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Quản lý thương hiệu và sản phẩm',
    type: 'group',
    children: [
        {
            id: 'util-category',
            title: 'Nhãn hàng',
            type: 'item',
            url: '/category',
            icon: icons.TagsOutlined
        },
        {
            id: 'util-product',
            title: 'Sản phẩm',
            type: 'item',
            url: '/product',
            icon: icons.DesktopOutlined
        },
        {
            id: 'util-orders',
            title: 'Đơn hàng',
            type: 'item',
            url: '/orders',
            icon: icons.UnorderedListOutlined
        },
        {
            id: 'accounts',
            title: 'Tài khoản',
            type: 'item',
            url: '/accounts',
            icon: icons.UserOutlined,
            breadcrumbs: false
        },
        {
            id: 'media',
            title: 'Quản lý media',
            type: 'item',
            url: '/media',
            icon: icons.ProfileOutlined
        },
        {
            id: 'listscreen',
            title: 'Quản lý screen',
            type: 'item',
            url: '/listscreen',
            icon: icons.ProfileOutlined
        },
        {
            id: 'banner',
            title: 'Quản lý Banner',
            type: 'item',
            url: '/banner',
            icon: icons.DesktopOutlined
        },
        {
            id: 'tag',
            title: 'Tag',
            type: 'item',
            url: '/tag',
            icon: icons.TagsOutlined
        },
    ]
};

export default utilities;
