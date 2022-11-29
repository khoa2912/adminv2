// material-ui
import { Box, Typography } from "@mui/material";

// project import
import NavGroup from "./NavGroup";
import menuItem from "menu-items";
import { useEffect } from "react";
// assets
import {
  LoginOutlined,
  ProfileOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
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
} from "@ant-design/icons";
// icons

// assets

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  ApartmentOutlined,
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
  DesktopOutlined,
};
// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const auth = useSelector((state) => state.auth);
  const tempItem = [
    {
      id: "logout",
      title: "Phân quyền",
      type: "item",
      url: "/role",
      disabled: true,
      icon: icons.ApartmentOutlined,
    },
    {
      id: "logouted",
      title: "Action",
      type: "item",
      url: "/action",
      disabled: true,
      icon: icons.ApartmentOutlined,
    },
    {
      id: "roleaction",
      title: "RoleActions",
      type: "item",
      url: "/roleaction",
      disabled: true,
      icon: icons.ApartmentOutlined,
    },
  ];
  const tempItem2 = [
    {
      id: "util-category",
      title: "Nhãn hàng",
      type: "item",
      url: "/category",
      disabled: true,
      icon: icons.TagsOutlined,
    },
    {
      id: "util-product",
      title: "Sản phẩm",
      type: "item",
      url: "/product",
      disabled: true,
      icon: icons.DesktopOutlined,
    },
    {
      id: "util-orders",
      title: "Đơn hàng",
      type: "item",
      url: "/orders",
      disabled: true,
      icon: icons.UnorderedListOutlined,
    },
    {
      id: "accounts",
      title: "Tài khoản",
      type: "item",
      url: "/accounts",
      disabled: true,
      icon: icons.UserOutlined,
      breadcrumbs: true,
    },
    {
      id: "media",
      title: "Quản lý media",
      type: "item",
      url: "/media",
      disabled: true,
      icon: icons.ProfileOutlined,
    },
    {
      id: "listscreen",
      title: "Quản lý screen",
      type: "item",
      url: "/listscreen",
      disabled: true,
      icon: icons.ProfileOutlined,
    },
    {
      id: "banner",
      title: "Quản lý Banner",
      type: "item",
      url: "/banner",
      disabled: true,
      icon: icons.DesktopOutlined,
    },
    {
      id: "tag",
      title: "Tag",
      type: "item",
      url: "/tag",
      disabled: true,
      icon: icons.TagsOutlined,
    },
    {
      id: "infoProduct",
      title: "Info Product",
      type: "item",
      url: "/infoProduct",
      disabled: true,
      icon: icons.TagsOutlined,
    },
  ];
  //get value localstorage

  // Temp Children

  const [menu, setMenu] = useState(menuItem.items);
  useEffect(() => {
    if (localStorage.getItem("screenrole")) {
      const valueScreen = JSON.parse(localStorage.getItem("screenrole"));

      let tempChildren2 = [];
      tempItem2.map((e) => {
        const temp = valueScreen.find((item) => item.screenSlug === e.url);
        if (temp !== undefined) {
          tempChildren2.push({
            id: e.id,
            title: e.title,
            type: e.type,
            url: e.url,
            icon: e.icon,
            disabled: false,
          });
        } else {
          tempChildren2.push(e);
        }
      });

      const utilities = {
        id: "utilities",
        title: "Quản lý thương hiệu và sản phẩm",
        type: "group",
        children: tempChildren2,
      };
      menu.map((item) => {
        if (item.id === "utilities") {
          item = utilities;
        } else {
          menu[4] = utilities;
        }
      });

      setMenu(menu);

      //get value localstorage
    }
  }, []);

  return (
    <Box sx={{ pt: 2 }}>
      {menu.map((item) => {
        switch (item.type) {
          case "group":
            return <NavGroup key={item.id} item={item} />;
          default:
            return (
              <Typography
                key={item.id}
                variant="h6"
                color="error"
                align="center"
              >
                Fix - Navigation Group
              </Typography>
            );
        }
      })}
    </Box>
  );
};

export default Navigation;
