import PropTypes, { object } from "prop-types";
import { Grid, Stack, Typography } from "@mui/material";

// project import
import ComponentSkeleton from "./ComponentSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card as CardANTD, Spin } from "antd";
import {
  Col,
  Collapse,
  Form,
  Row,
  Upload,
  Select,
} from "../../../node_modules/antd/lib/index";
import { FormGroup } from "react-bootstrap";

import {
  Box,
  Button,
  CardActions,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select as SelectMui,
  OutlinedInput,
  NativeSelect,
  TextField,
} from "../../../node_modules/@mui/material/index";
import { CKEditor } from "ckeditor4-react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { notification, Popconfirm } from "antd";
import { Tabs } from "antd";
import formatThousand from "util/formatThousans";
import { getProducts } from "actions/product";
import { getAllCategory } from "actions/category";
import { getAllUser } from "actions/user";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import {
  deleteOrderById,
  updateOrder,
  getDataFilterOrder,
  getOrders,
} from "actions/order";
import { DataArraySharp } from "../../../node_modules/@mui/icons-material/index";
import { isArray, isObject } from "lodash";
import { useNavigate } from "react-router-dom";
// ===============================|| ORDER - PAGE ||=============================== //

const OrderPage = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [searchModel, setSearchModel] = useState({
    Order_Code: "",
    TotalAmount: "",
    UserId: "",
    Address_Name: "",
    Payment_Status: "",
    Payment_Type: "",
    Order_Status: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const listScreen = JSON.parse(localStorage.getItem("screenrole"));
    let obj = listScreen.find((o) => o.screenSlug === "/orders");
    console.log("obj", navigate);
    if (!obj) {
      navigate("/404");
    }
  }, []);
  const { TabPane } = Tabs;
  const order = useSelector((state) => state.order);
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [typeofModal, setTypeofModal] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const [orderInPage, setOrderInPage] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [item, setItem] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState([]);
  const [type, SetType] = useState("");
  const [typeExactly, SetTypeExactly] = useState("");
  const [date, SetDate] = useState("");

  useEffect(() => {
    setLoading(true);
    dispatch(getDataFilterOrder()).then((data) => {
      data && data.map((item, index) => (item.id = index + 1));
      setOrderInPage(data);
      setLoading(false);
    });
    dispatch(getOrders());
  }, [dispatch]);
  const handleEdit = () => {};
  const text = "Bạn có chắc chắn muốn xóa?";

  // Filter in Order
  function removeDuplicates(startArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in startArray) {
      lookupObject[startArray[i][prop]] = startArray[i];
    }

    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
  //Filter TotalAmount
  var filterArrayTotalAmount = removeDuplicates(orderInPage, "totalAmount");
  //Filter UserName
  var filterArrayUserName = removeDuplicates(orderInPage, "userObject._id");
  //Filter Paymentstatus
  var filterArrayPaymentstatus = removeDuplicates(orderInPage, "paymentStatus");

  const columns = [
    // { field: 'id', headerName: 'Số thứ tự', width: 150 },
    {
      field: "id",
      headerName: "Mã đơn hàng",
      width: 250,
      renderCell: (params) => {
        if (params.value)
          return <div className="rowitem">{params.row._id}</div>;
      },
    },
    {
      field: "userObject",
      headerName: "Tên khách hàng",
      width: 200,
      renderCell: (params) => {
        if (params.value)
          return (
            <div className="rowitem">
              {params.value.firstName + " " + params.value.lastName}
            </div>
          );
      },
    },
    {
      field: "addressId",
      headerName: "Địa chỉ",
      width: 200,
      renderCell: (params, row) => {
        console.log(params);
        if (params.value) {
          return (
            <div className="rowitem">
              {params.value.districtName + ", " + params.value.provinceName}
            </div>
          );
        }
      },
    },
    {
      field: "orderStatus",
      headerName: "Trạng thái đơn hàng",
      width: 180,
      renderCell: (params) => {
        if (params?.row?.paymentStatus === "cancelled")
          return <div className="rowitem">{"Đã huỷ"}</div>;
        if (params.value) {
          for (let i = 0; i < 4; i++) {
            if (params.value[i].isCompleted === true) {
              if (params.value[i].type == "packed")
                return <div className="rowitem">{"Đang đóng gói"}</div>;
              else if (params.value[i].type == "ordered")
                return <div className="rowitem">{"Đã đặt hàng"}</div>;
              else if (params.value[i].type == "shipped")
                return <div className="rowitem">{"Đang vận chuyển"}</div>;
              else return <div className="rowitem">{"Đã nhận"}</div>;
            }
          }
        }
      },
    },
    {
      field: "paymentType",
      headerName: "Loại thanh toán",
      width: 180,
      renderCell: (params) => {
        if (params.value) {
          if (params.value === "cod")
            return <div className="rowitem">{"Thanh toán khi nhận hàng"}</div>;
          else return <div className="rowitem">{"Thẻ tín dụng"}</div>;
        }
      },
    },
    {
      field: "paymentStatus",
      headerName: "Trạng thái thanh toán",
      width: 180,
      renderCell: (params) => {
        if (params.value) {
          if (params.value == "pending")
            return <div className="rowitem">{"Đang chờ"}</div>;
          else if (params.value === "completed")
            return <div className="rowitem">{"Đã thanh toán"}</div>;
          else return <div className="rowitem">{"Đã hủy"}</div>;
        }
      },
    },
    {
      field: "totalAmount",
      headerName: "Tổng tiền hàng",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="rowitem">
            {formatThousand(`${params.row.totalAmount}`)} VND
          </div>
        );
      },
    },
  ];
  const gridStyle = {
    width: "33.33%",
    height: "80px",
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  notification.config({
    placement: "topRight",
    top: 80,
    duration: 3,
    rtl: false,
  });
  const handleView = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Xem đơn hàng",
        description: "Vui lòng chọn đơn hàng bạn muốn xem.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Xem đơn hàng",
        description: "Vui lòng chỉ chọn một đơn hàng.",
      });
    } else {
      setTypeofModal("view");
      handleOpen();
    }
  };
  const handleChange = (event) => {
    setPaymentStatus(event.target.value);
  };

  const handleUpdateOrder = () => {
    if (selectedRows.length === 0) {
      notification["warning"]({
        message: "Cập nhập đơn hàng",
        description: "Vui lòng chọn đơn hàng bạn muốn cập nhập.",
      });
    } else if (selectedRows.length >= 2) {
      notification["warning"]({
        message: "Xem đơn hàng",
        description: "Vui lòng chỉ chọn một đơn hàng.",
      });
    } else {
      setTypeofModal("update");
      handleOpen();
    }
  };
  const handleUpdateOrderStatus = async (e) => {
    try {
      const data = {
        _id: selectedRows[0]._id,
        date: new Date(),
        type,
      };
      if (typeofOrderStatus !== data.type && data.type !== "") {
        dispatch(updateOrder(data)).then((data) => {
          if (data === "success") {
            dispatch(getDataFilterOrder()).then((data) => {
              data.map((item, index) => (item.id = index + 1));
              data.map((item) => {
                if (item._id === selectedRows[0]._id) {
                  selectedRows[0] = item;
                  setSelectedRows(selectedRows);
                }
              });
              setOrderInPage(data);
              setLoading(false);
            });
            handleClose();
            SetType("");
            notification["success"]({
              message: "Cập nhập trạng thái đơn hàng",
              description: "Cập nhập trạng thái đơn hàng thành công.",
            });
          } else {
            handleClose();
            notification["error"]({
              message: "Cập nhập trạng thái đơn hàng",
              description: "Cập nhập trạng thái đơn hàng thất bại.",
            });
          }
        });
      } else {
        notification["warning"]({
          message: "Cập nhập đơn hàng",
          description: "Chưa cập nhập đơn hàng.",
        });
      }
    } catch (err) {
      throw new Error("Something went wrong");
    }
  };
  const handleChangeTotalAmount = (value) => {
    searchModel.TotalAmount = value;
    setSearchModel(searchModel);
  };
  const handleChangeOrder = (value) => {
    searchModel.Order_Code = value;
    setSearchModel(searchModel);
  };
  const handleChangeUser = (value) => {
    searchModel.UserId = value;
    setSearchModel(searchModel);
  };
  const handleChangeAddress = (value) => {
    searchModel.Address_Name = value;
    setSearchModel(searchModel);
  };
  const handleChangePaymentStatus = (value) => {
    searchModel.Payment_Status = value;
    setSearchModel(searchModel);
  };
  const handleChangePaymentType = (value) => {
    searchModel.Payment_Type = value;
    setSearchModel(searchModel);
  };
  const handleChangeOrderStatus = (value) => {
    searchModel.Order_Status = value;
    setSearchModel(searchModel);
  };
  const createUserList = (users, options = []) => {
    for (let user of users) {
      options.push({ value: user._id, name: user.lastName });
      if (user.children.length > 0) {
        createUserList(user.children, options);
      }
    }
    return options;
  };
  const handleSearch = () => {
    setLoading(true);
    dispatch(getDataFilterOrder(searchModel)).then((data) => {
      data.map((item, index) => (item.id = index + 1));
      setOrderInPage(data);
      setLoading(false);
    });
  };
  var typeofOrderStatus;
  let disableType1;
  let disableType2;
  let disableType3;
  let disableType4;
  const resultType = (e) => {
    if (e === "ordered") {
      disableType1 = true;
      disableType2 = false;
      disableType3 = true;
      disableType4 = true;
    } else if (e === "packed") {
      disableType1 = true;
      disableType2 = true;
      disableType3 = false;
      disableType4 = true;
    } else if (e === "shipped") {
      disableType1 = true;
      disableType2 = true;
      disableType3 = true;
      disableType4 = false;
    } else {
      disableType1 = true;
      disableType2 = true;
      disableType3 = true;
      disableType4 = true;
    }
  };
  const objOrderStatus = [
    { type: "ordered" },
    { type: "packed" },
    { type: "shipped" },
    { type: "delivered" },
  ];
  const objTypePayment = [
    { type: "cod", description: "Thanh toán khi nhận hàng" },
    { type: "card", description: "Thẻ tín dụng" },
  ];
  const modalOrder = (typeofModal) => {
    let title;
    let disable;
    let Setonclick;
    var arraytemp;
    var tempItems;
    var arraytempAddress;
    let quantityOrder = 0;
    var ListProductOrder = "";

    if (typeofModal === "update") {
      title = "Cập nhập đơn hàng";
      disable = false;
      Setonclick = handleUpdateOrderStatus;
      const tempOrderStatus = selectedRows[0]?.orderStatus?.find(
        (data) => data.isCompleted === true
      );
      arraytemp = tempOrderStatus;
      typeofOrderStatus = arraytemp?.type;
      resultType(typeofOrderStatus);
    } else if (typeofModal === "view") {
      title = "Xem chi tiết đơn hàng";
      disable = true;
      const tempOrderStatus = selectedRows[0]?.orderStatus?.find(
        (data) => data.isCompleted === true
      );
      const tempAddressObject = selectedRows[0]?.addressObject?.address?.find(
        (data) => data._id === selectedRows[0]?.addressId
      );
      var items = [];
      selectedRows[0]?.items.map((e) => items.push(e));
      tempItems = items;
      console.log(tempItems, "Test");
      arraytemp = tempOrderStatus;
      arraytempAddress = tempAddressObject;
      selectedRows[0]?.items?.forEach((e) => {
        quantityOrder += e.purchasedQty;
      });
      const listNeed = selectedRows[0]?.items?.values();
      //lỗi lấy danh sách sản phẩm
      if (listNeed && listNeed.length !== 0) {
        for (const value of listNeed) {
          ListProductOrder = ListProductOrder + value.productId.name + ``;
        }
      }
    }
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h3" component="h2">
            {title}
          </Typography>
          <Tabs
            defaultActiveKey="1"
            style={{ color: "black", fontSize: "19px" }}
          >
            <TabPane tab={<span>Thông tin chung</span>} key="1">
              <div
                className="container_infoOrder"
                style={{
                  display: "flex",
                  paddingTop: "0px",
                  color: "black",
                  fontSize: "17px",
                }}
              >
                <div
                  className="container_form_infoOrder"
                  style={{
                    paddingBottom: "20px",
                    width: "100%",
                    paddingRight: "30px",
                  }}
                >
                  <TextField
                    required
                    style={{ width: "100%", marginBottom: "15px" }}
                    id="outlined-error"
                    label="Mã đơn hàng"
                    value={selectedRows[0] ? selectedRows[0]._id : null}
                    disabled="true"
                  />
                  <TextField
                    required
                    id="outlined-number"
                    label="Tổng tiền hàng"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={
                      selectedRows[0]
                        ? formatThousand(selectedRows[0].totalAmount) + " VNĐ"
                        : null
                    }
                    disabled="true"
                  />
                  <TextField
                    required
                    id="outlined-number"
                    label="Loại thanh toán"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={
                      selectedRows[0]?.paymentType === "cod"
                        ? "Thanh toán khi nhận hàng"
                        : "Thẻ tín dụng"
                    }
                    disabled="true"
                  />
                  <FormControl style={{ width: "100%", marginBottom: "15px" }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      disabled={disable}
                    >
                      Trạng thái Thanh toán
                    </InputLabel>
                    <SelectMui
                      disabled="true"
                      defaultValue={
                        selectedRows[0] ? selectedRows[0].paymentStatus : null
                      }
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                    >
                      <MenuItem value={"completed"}>Đã hoàn thành</MenuItem>
                      <MenuItem value={"pending"}>Đang chờ</MenuItem>
                      <MenuItem value={"cancelled"}>Đã hủy</MenuItem>
                    </SelectMui>
                  </FormControl>
                  <FormControl style={{ width: "100%", marginBottom: "15px" }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      disabled={disable}
                    >
                      Trạng thái Đơn hàng
                    </InputLabel>
                    <SelectMui
                      disabled={
                        disable ||
                        selectedRows[0]?.paymentStatus === "cancelled"
                      }
                      // defaultValue={selectedRows[0] ? selectedRows[0].orderStatus[0].type : null}
                      value={type ? type : arraytemp?.type}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(e) => SetType(e.target.value)}
                    >
                      <MenuItem value={"ordered"} disabled={disableType1}>
                        Đã đặt hàng
                      </MenuItem>
                      <MenuItem value={"packed"} disabled={disableType2}>
                        Đang đóng gói
                      </MenuItem>
                      <MenuItem value={"shipped"} disabled={disableType3}>
                        Đang vận chuyển
                      </MenuItem>
                      <MenuItem value={"delivered"} disabled={disableType4}>
                        Đã nhận
                      </MenuItem>
                    </SelectMui>
                  </FormControl>
                </div>
              </div>
            </TabPane>
            <TabPane tab={<span>Thông tin chi tiết</span>} key="2">
              <div
                className="container_infoOrder"
                style={{
                  display: "flex",
                  paddingTop: "0px",
                  color: "black",
                  fontSize: "17px",
                }}
              >
                <div
                  className="container_form_addProduct"
                  style={{
                    paddingBottom: "20px",
                    width: "100%",
                    paddingRight: "30px",
                  }}
                >
                  <TextField
                    required
                    id="outlined-number"
                    label="Họ và tên khách hàng"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={
                      selectedRows[0]
                        ? selectedRows[0].userObject.firstName +
                          " " +
                          selectedRows[0].userObject.lastName
                        : null
                    }
                    disabled="true"
                  />
                  <TextField
                    required
                    id="outlined-number"
                    label="Địa chỉ"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={
                      arraytempAddress
                        ? arraytempAddress.wardName +
                          ", " +
                          arraytempAddress.districtName +
                          ", " +
                          arraytempAddress.provinceName
                        : null
                    }
                    disabled="true"
                  />
                  <TextField
                    required
                    id="outlined-number"
                    label="Số điện thoại"
                    style={{ width: "100%", marginBottom: "15px" }}
                    value={
                      selectedRows[0]
                        ? selectedRows[0].userObject?.contactNumber
                        : null
                    }
                    disabled="true"
                  />
                  <FormControl style={{ width: "100%", marginBottom: "15px" }}>
                    <InputLabel id="demo-simple-select-label" disabled="true">
                      Danh sách sản phẩm
                    </InputLabel>
                    <SelectMui
                      value={tempItems ? tempItems[0]?.productId._id : null}
                      label="Danh sách sản phẩm"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // onChange={}
                    >
                      {tempItems?.map((option) => (
                        <MenuItem disabled="true" value={option.productId._id}>
                          {option.productId.name}
                        </MenuItem>
                      ))}
                    </SelectMui>
                  </FormControl>
                </div>
              </div>
            </TabPane>
          </Tabs>
          <CardActions sx={{ padding: "0" }}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={Setonclick}
              disabled={disable}
            >
              Lưu
            </Button>
            <Button size="small" variant="outlined" onClick={handleClose}>
              Đóng
            </Button>
          </CardActions>
        </Box>
      </Modal>
    );
  };
  return (
    <ComponentSkeleton>
      <Form style={{ marginBottom: "10px" }}>
        <Collapse
          defaultActiveKey={["1"]}
          expandIconPosition={"right"}
          className="mps-search-header-collapse"
        >
          <Collapse.Panel
            header={
              <span className="mps-search-header-panel-title">
                {" "}
                Thông tin tìm kiếm
              </span>
            }
            key="1"
          >
            <CardANTD style={{ border: "none" }}>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>Mã đơn hàng</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeOrder}
                      >
                        {orderInPage &&
                          orderInPage.map((item) => (
                            <Option
                              key={item._id}
                              data={item._id}
                              text={item._id}
                            >
                              <div className="global-search-item">
                                <span>{item._id}</span>
                              </div>
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>Tên khách hàng</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeUser}
                      >
                        {filterArrayUserName &&
                          filterArrayUserName.map(
                            (item, index) =>
                              item.userObject && (
                                <Option
                                  key={item.user}
                                  data={
                                    item.userObject.firstName +
                                    " " +
                                    item.userObject.lastName
                                  }
                                  text={
                                    item.userObject.firstName +
                                    " " +
                                    item.userObject.lastName
                                  }
                                >
                                  <div className="global-search-item">
                                    <span>
                                      {item.userObject.firstName +
                                        ` ` +
                                        item.userObject.lastName}
                                    </span>
                                  </div>
                                </Option>
                              )
                          )}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>Trạng thái thanh toán</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangePaymentStatus}
                      >
                        {filterArrayPaymentstatus &&
                          filterArrayPaymentstatus.map((item) => (
                            <Option
                              key={item.paymentStatus}
                              data={item.paymentStatus}
                              text={
                                item.paymentStatus === "pending"
                                  ? "Đang chờ"
                                  : "Đã thanh toán"
                              }
                            >
                              <div className="global-search-item">
                                <span>{item.paymentStatus}</span>
                              </div>
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>Loại thanh toán</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangePaymentType}
                      >
                        {objTypePayment.map((item) => (
                          <Option
                            key={item.type}
                            data={item.type}
                            text={item.description}
                          >
                            <div className="global-search-item">
                              <span>{item.description}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
              <CardANTD.Grid style={gridStyle}>
                <Row>
                  <Col span={8}>
                    <Form.Item>Trạng thái đơn hàng</Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item>
                      <Select
                        mode="multiple"
                        optionFilterProp="data"
                        optionLabelProp="text"
                        onChange={handleChangeOrderStatus}
                      >
                        {objOrderStatus &&
                          objOrderStatus.map((item) => (
                            <Option
                              key={item.type}
                              data={item.type}
                              text={
                                item.type === "ordered"
                                  ? "Đã đặt hàng"
                                  : item.type === "packed"
                                  ? "Đang đóng gói"
                                  : item.type === "shipped"
                                  ? "Đang vận chuyển"
                                  : "Đã nhận"
                              }
                            >
                              <div className="global-search-item">
                                <span>
                                  {item.type === "ordered"
                                    ? "Đã đặt hàng"
                                    : item.type === "packed"
                                    ? "Đang đóng gói"
                                    : item.type === "shipped"
                                    ? "Đang vận chuyển"
                                    : "Đã nhận"}
                                </span>
                              </div>
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </CardANTD.Grid>
            </CardANTD>
          </Collapse.Panel>
        </Collapse>
      </Form>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={2}
        sx={{ marginBottom: "20px" }}
      >
        <Button
          variant="outlined"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          style={{ cursor: "pointer" }}
        >
          Tìm kiếm
        </Button>
        <Button
          variant="outlined"
          style={{ cursor: "pointer" }}
          onClick={handleView}
        >
          Xem
        </Button>
        <Button
          variant="outlined"
          style={{ cursor: "pointer" }}
          onClick={handleUpdateOrder}
        >
          Cập nhập
        </Button>
      </Stack>
      {modalOrder(typeofModal)}
      {/* <Spin tip="Loading..." spinning={loading}> */}
      <Grid container spacing={3}>
        <div style={{ height: 600, width: "100%", marginLeft: "10px" }}>
          <DataGrid
            rows={orderInPage ? orderInPage : []}
            columns={orderInPage ? columns : []}
            pageSize={8}
            rowsPerPageOptions={[8]}
            checkboxSelection
            getRowId={(row) => row._id}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows =
                orderInPage &&
                orderInPage.filter((row) => selectedIDs.has(row._id));
              // if (selectedRows.length === 1) {
              //     setCodeBanner(selectedRows[0].codeBanner);
              //     setNameBanner(selectedRows[0].nameBanner);
              //     setSlug(selectedRows[0].slug);
              //     setFileList([{ url: selectedRows[0].image }]);
              // }
              setSelectedRows(selectedRows);
            }}
            loading={loading}
          />
        </div>
      </Grid>
      {/* </Spin> */}
    </ComponentSkeleton>
  );
};

export default OrderPage;
