// assets
import {
  LoginOutlined,
  ProfileOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useState } from "react";

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  ApartmentOutlined,
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

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

//get value localstorage
var valueScreen = [];
if (localStorage.getItem("screenrole")) {
  valueScreen = JSON.parse(localStorage.getItem("screenrole"));
}
// Temp Children
var tempChildren = [];
tempItem.map((e) => {
  const temp = valueScreen.find((item) => item.screenSlug === e.url);
  if (temp !== undefined) {
    tempChildren.push({
      id: e.id,
      title: e.title,
      type: e.type,
      url: e.url,
      icon: e.icon,
      disabled: false,
    });
  } else {
    tempChildren.push(e);
  }
});

const pages = {
  id: "media",
  title: "Hệ thống",
  type: "group",
  children: tempChildren,
};

export default pages;
