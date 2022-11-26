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

const tempItem = [
    {
        id: 'util-category',
        title: 'Nhãn hàng',
        type: 'item',
        url: '/category',
        disabled: true,
        icon: icons.TagsOutlined
    },
    {
        id: 'util-product',
        title: 'Sản phẩm',
        type: 'item',
        url: '/product',
        disabled: true,
        icon: icons.DesktopOutlined
    },
    {
        id: 'util-orders',
        title: 'Đơn hàng',
        type: 'item',
        url: '/orders',
        disabled: true,
        icon: icons.UnorderedListOutlined
    },
    {
        id: 'accounts',
        title: 'Tài khoản',
        type: 'item',
        url: '/accounts',
        disabled: true,
        icon: icons.UserOutlined,
        breadcrumbs: true
    },
    {
        id: 'media',
        title: 'Quản lý media',
        type: 'item',
        url: '/media',
        disabled: true,
        icon: icons.ProfileOutlined
    },
    {
        id: 'listscreen',
        title: 'Quản lý screen',
        type: 'item',
        url: '/listscreen',
        disabled: true,
        icon: icons.ProfileOutlined
    },
    {
        id: 'banner',
        title: 'Quản lý Banner',
        type: 'item',
        url: '/banner',
        disabled: true,
        icon: icons.DesktopOutlined
    },
    {
        id: 'tag',
        title: 'Tag',
        type: 'item',
        url: '/tag',
        disabled: true,
        icon: icons.TagsOutlined
    },
    {
        id: 'infoProduct',
        title: 'Info Product',
        type: 'item',
        url: '/infoProduct',
        disabled: true,
        icon: icons.TagsOutlined
    },
]

//get value localstorage
var valueScreen = [];
if (localStorage.getItem('screenrole')) {
    valueScreen = JSON.parse(localStorage.getItem('screenrole'));
}
// Temp Children
var tempChildren = [];
tempItem.map(e => {
    const temp = valueScreen.find(item => item.screenSlug === e.url);
    if(temp !== undefined) {
        tempChildren.push({
            id: e.id,
            title: e.title,
            type: e.type,
            url: e.url,
            icon: e.icon,
            disabled: false
        })
    } else {
        tempChildren.push(e)
    }
});

const utilities = {
    id: 'utilities',
    title: 'Quản lý thương hiệu và sản phẩm',
    type: 'group',
    children: tempChildren
};

export default utilities;
