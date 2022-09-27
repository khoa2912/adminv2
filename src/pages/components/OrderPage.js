import PropTypes, { object } from 'prop-types';
import { Grid, Stack, Typography } from '@mui/material';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card as CardANTD, Spin } from 'antd';
import { Col, Collapse, Form, Row, Upload, Select } from '../../../node_modules/antd/lib/index';
import { FormGroup } from 'react-bootstrap';

import {
    Button,
    CardActions,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    OutlinedInput,
    TextField
} from '../../../node_modules/@mui/material/index';
import { CKEditor } from 'ckeditor4-react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Popconfirm } from 'antd';
import { Tabs } from 'antd';
import formatThousand from 'util/formatThousans';
import { getProducts } from 'actions/product';
import { getAllCategory } from 'actions/category';
import { getAllUser } from 'actions/user';
import SearchIcon from '@mui/icons-material/Search';
import { deleteOrderById, getDataFilterOrder, getOrders } from 'actions/order';
import { DataArraySharp } from '../../../node_modules/@mui/icons-material/index';
import { isArray, isObject } from 'lodash';

// ===============================|| ORDER - PAGE ||=============================== //

const OrderPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        Order_Code: '',
        TotalAmount: '',
        UserId: '',
        Address_Name: '',
        Payment_Status: '',
        Payment_Type: ''
    });
    const { TabPane } = Tabs;
    const order = useSelector((state) => state.order);
    const [selectedRows, setSelectedRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loading, setLoading] = useState(false);
    const [orderInPage, setOrderInPage] = useState([]);
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterOrder()).then((data) => {
            data&&data.map((item, index) => (item.id = index + 1));
            setOrderInPage(data);
            setLoading(false);
        });
        dispatch(getOrders());
    }, [dispatch]);
    const handleEdit = () => {};
    const text = 'Bạn có chắc chắn muốn xóa?';

    // Filter in Order
    function removeDuplicates(startArray, prop) {
        var newArray = [];
        var lookupObject  = {};
   
        for(var i in startArray) {
           lookupObject[startArray[i][prop]] = startArray[i];
        }
   
        for(i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }
   
    // Filter User
    var filterArrayUser = removeDuplicates(orderInPage, "user");
    console.log(filterArrayUser);

    //Filter TotalAmount
    var filterArrayTotalAmount = removeDuplicates(orderInPage, "totalAmount");
    console.log(filterArrayTotalAmount);

    //Filter Address
    var filterArrayAddress = removeDuplicates(orderInPage, "addressId");
    console.log(filterArrayAddress);

    //Filter Paymentstatus
    var filterArrayPaymentstatus = removeDuplicates(orderInPage, "paymentStatus");
    console.log(filterArrayPaymentstatus);

    //Filter Paymenttype
    var filterArrayPaymenttype = removeDuplicates(orderInPage, "paymentType");
    console.log(filterArrayPaymenttype);

    const columns = [
        // { field: 'id', headerName: 'Số thứ tự', width: 150 },
        {
            field: 'id',
            headerName: 'Mã đơn hàng',
            width: 250,
            renderCell: (params) => {
                if(params.value)
                    return <div className="rowitem">{params.row._id}</div>;
            }
        },
        {
            field: 'userObject',
            headerName: 'Tên khách hàng',
            width: 200,
            renderCell: (params) => {
                if(params.value)
                    return <div className="rowitem">{params.value.firstName + ' ' + params.value.lastName}</div>;
            }
        },
        {
            field: 'addressObject',
            headerName: 'Địa chỉ',
            width: 200,
            renderCell: (params) => {
                if (params.value) {
                    for ( let i = 0; i <5; i++ ) {
                        if (params.value.address[i]._id === params.row.addressId) {
                            return <div className="rowitem">{params.value.address[i].districtName + ', ' + params.value.address[i].provinceName}</div>;
                        }
                    }
                }
            }
        },
        {
            field: 'orderStatus',
            headerName: 'Trạng thái đơn hàng',
            width: 180,
            renderCell: (params) => {
                if (params.value) {
                    for (let i = 0; i < 4; i++) {
                        if (params.value[i].isCompleted === true) {
                            return <div className="rowitem">{params.value[i].type}</div>;
                        }
                    }
                }
            }
        },
        { field: 'paymentType', headerName: 'Loại thanh toán', width: 180 },
        { field: 'paymentStatus', headerName: 'Trạng thái thanh toán', width: 180 },
        // {
        //     field: 'totalAmount',
        //     headerName: 'Tổng tiền hàng',
        //     width: 200,
        //     renderCell: (params) => {
        //         if (params.row.shipAmount === undefined) {
        //             return <div className="rowitem">{formatThousand(`${params.row.totalAmount}`)} VND</div>;
        //         }
        //         return <div className="rowitem">{formatThousand(`${params.row.totalAmount}` - `${params.row.shipAmount}`)} VND</div>;
        //     }
        // }
        {
            field: 'totalAmount',
            headerName: 'Tổng tiền hàng',
            width: 150,
            renderCell: (params) => {
                return <div className="rowitem">{formatThousand(`${params.row.totalAmount}`)} VND</div>;
            }
        }
    ];
    const gridStyle = {
        width: '33.33%',
        height: '80px'
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1000,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };
    notification.config({
        placement: 'topRight',
        top: 80,
        duration: 3,
        rtl: false
    });
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem đơn hàng',
                description: 'Vui lòng chọn đơn hàng bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem đơn hàng',
                description: 'Vui lòng chỉ chọn một đơn hàng.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá đơn hàng',
                description: 'Vui lòng chọn đơn hàng bạn muốn xoá.'
            });
        } else {
            let listIdOrder = [];
            selectedRows.map((item) => {
                listIdOrder.push(item._id);
            });
            const payload = {
                OrdertId: listIdOrder
            };
            dispatch(deleteOrderById(payload));
            if (order.deleteMessage === 'success') {
                notification['success']({
                    message: 'Xoá đơn hàng',
                    description: 'Xoá đơn hàng thành công.'
                });
            }
            if (order.deleteMessage === 'error') {
                notification['error']({
                    message: 'Xoá đơn hàng',
                    description: 'Xoá đơn hàng không thành công.'
                });
            }
        }
    };

    const handleUpdateOrder = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Cập nhập đơn hàng',
                description: 'Vui lòng chọn đơn hàng bạn muốn cập nhập.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem đơn hàng',
                description: 'Vui lòng chỉ chọn một đơn hàng.'
            });
        } else {
            setType('update');
            handleOpen();
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
        console.log(searchModel);
        dispatch(getDataFilterOrder(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setOrderInPage(data);
            setLoading(false);
        });
    };
    return (
        <ComponentSkeleton>
            <Form style={{ marginBottom: '10px' }}>
                <Collapse defaultActiveKey={['1']} expandIconPosition={'right'} className="mps-search-header-collapse">
                    <Collapse.Panel header={<span className="mps-search-header-panel-title"> Thông tin tìm kiếm</span>} key="1">
                        <CardANTD style={{ border: 'none' }}>
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
                                                {orderInPage&&orderInPage.map((item) => (
                                                    <Option key={item._id} data={item._id} text={item._id}>
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
                                                {orderInPage &&
                                                    filterArrayUser.map((item, index) => ( item.userObject &&
                                                        <Option 
                                                            key = {item.user}
                                                            data = {item.userObject.firstName + ' ' + item.userObject.lastName}
                                                            text = {item.userObject.firstName + ' ' + item.userObject.lastName}
                                                        >
                                                            {console.log(item)}
                                                            <div className="global-search-item">
                                                                <span>{item.userObject.firstName + ` ` + item.userObject.lastName}</span>
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
                                        <Form.Item>Tổng tiền hàng</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeTotalAmount}
                                            >
                                                {filterArrayTotalAmount&&filterArrayTotalAmount.map((item) => (
                                                    <Option key={item.totalAmount} data={item._id} text={item.totalAmount}>
                                                        <div className="global-search-item">
                                                            <span>{item.totalAmount}</span>
                                                        </div>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </CardANTD.Grid>
                            {/* <CardANTD.Grid style={gridStyle}>
                                <Row>
                                    <Col span={8}>
                                        <Form.Item>Địa chỉ</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeAddress}
                                            >
                                                {orderInPage &&
                                                    filterArrayAddress.map((item, index) => ( item.addressObject && 
                                                        <Option 
                                                            key = {item.addressId}
                                                            // data = {item.addressId}
                                                            // text = {item.addressId}
                                                            data = {item.addressId}
                                                            text = {item.addressObject.address[0].districtName + ' ' + item.addressObject.address[0].provinceName}
                                                        >
                                                            {console.log(item)}
                                                            <div className="global-search-item">
                                                                <span> {
                                                                    item.addressObject.address[0].districtName + ' ' + item.addressObject.address[0].provinceName }
                                                                </span>
                                                            </div>
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </CardANTD.Grid> */}
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
                                                {filterArrayPaymentstatus&&filterArrayPaymentstatus.map((item) => (
                                                    <Option key={item.paymentStatus} data={item.paymentStatus} text={item.paymentStatus}>
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
                                                {filterArrayPaymenttype&&filterArrayPaymenttype.map((item) => (
                                                    <Option key={item.paymentType} data={item.paymentType} text={item.paymentType}>
                                                        <div className="global-search-item">
                                                            <span>{item.paymentType}</span>
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
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                {/* <Button variant="outlined" href="/createProduct" color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                    Thêm mới
                </Button> */}
                <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                    Xem
                </Button>
                <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleUpdateOrder}>
                    Cập nhập
                </Button>
                <Popconfirm placement="right" title={text} onConfirm={confirm} okText="Đồng ý" cancelText="Không">
                    <Button
                        variant="outlined"
                        color="error"
                        style={{ cursor: 'pointer' }}
                        startIcon={<DeleteIcon />}
                        // onClick={handleDeleteProduct}
                    >
                        Xoá
                    </Button>
                </Popconfirm>
                <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />} style={{ cursor: 'pointer' }}>
                    Tìm kiếm
                </Button>
            </Stack>
            {/* {modalOrder(type)} */}
            {/* <Spin tip="Loading..." spinning={loading}> */}
            <Grid container spacing={3}>
                <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                    <DataGrid
                        rows={orderInPage ? orderInPage : []}
                        columns={orderInPage ? columns : []}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                        onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids);
                            const selectedRows = orderInPage&&orderInPage.filter((row) => selectedIDs.has(row._id));

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
