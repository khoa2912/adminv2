// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { Card as CardANTD, Spin } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { Col, Collapse, Form, Row, Upload, Select } from '../../../node_modules/antd/lib/index';
import {
    Box,
    Button,
    Divider,
    Grid,
    Modal,
    Stack,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    NativeSelect,
    OutlinedInput,
    MenuItem,
    CardActions
} from '../../../node_modules/@mui/material/index';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, getDataFilterUser } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| ANT ICONS ||============================ //

const AccountPage = () => {
    const dispatch = useDispatch();
    const { Option } = Select;
    const [searchModel, setSearchModel] = useState({
        RoleName: '',
        StatusName: '',
        Email: '',
        Account_Name: ''
    });
    // useEffect(() => {
    //     dispatch(getInitialData());
    // }, []);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const auth = useSelector((state) => state.auth);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');
    const [status, setStatus] = useState('enable');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInPage, setUserInPage] = useState([]);
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterUser()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setUserInPage(data);
            setLoading(false);
        });
    }, [dispatch]);

    // Filter in Account
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

    // Filter Role
    var filterArrayRole = removeDuplicates(userInPage, "role");
    console.log(filterArrayRole);

    // Filter Status
    var filterArrayStatus = removeDuplicates(userInPage, "status");
    console.log(filterArrayStatus);

    // Filter Name
    var filterArrayName = removeDuplicates(userInPage, "lastName");
    console.log(filterArrayName);

    // Filter email
    var filterArrayEmail = removeDuplicates(userInPage, "email");
    console.log(filterArrayEmail);

    const columns = [
        { field: 'id', headerName: 'STT', width: 100 },
        {
            field: 'firstName',
            headerName: 'Họ và tên',
            width: 200,
            renderCell: (params) => {
                if(params.value)
                    return <div className="rowitem">{params.row.firstName + ' ' + params.row.lastName}</div>;
            }
        },
        { field: 'email', headerName: 'Email', width: 300 },
        {
            field: 'role',
            headerName: 'Quyền',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="rowitem" style={{ textAlign: 'center' }}>
                        {params.row.role === 'user' ? 'Khách hàng' : 'Quản trị viên'}
                    </div>
                );
            }
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            type: 'number',
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="rowitem" style={{ textAlign: 'center' }}>
                        {params.row.status === 'enable' ? 'Sử dụng' : 'Ngừng sử dụng'}
                    </div>
                );
            }
        }
    ];
    // eslint-disable-next-line
    const [selectedRows, setSelectedRows] = useState([]);
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem tài khoản',
                description: 'Vui lòng chọn tài khoản bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem tài khoản',
                description: 'Vui lòng chỉ chọn một tài khoản.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        handleOpen();
    };
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá sản phẩm',
                description: 'Vui lòng chọn sản phẩm bạn muốn xoá.'
            });
        } else {
            notification['success']({
                message: 'Xoá sản phẩm',
                description: 'Xoá sản phẩm thành công.'
            });
        }
    };
    const gridStyle = {
        width: '50%',
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
    const handleEditUser = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa tài khoản',
                description: 'Vui lòng chọn tài khoản bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem tài khoản',
                description: 'Vui lòng chỉ chọn một tài khoản.'
            });
        } else {
            // notification['success']({
            //     message: 'Chỉnh sửa sản phẩm',
            //     description: 'Coming Soon'
            // });
            setType('edit');
            handleOpen();
        }
    };
    const handleEdit = () => {};
    const handleChangeRole = (value) => {
        searchModel.RoleName = value;
        setSearchModel(searchModel);
    };
    const handleChangeStatus = (value) => {
        searchModel.StatusName = value;
        setSearchModel(searchModel);
    };
    const handleChangeName = (value) => {
        searchModel.Account_Name = value;
        setSearchModel(searchModel);
    };
    const handleChangeEmail = (value) => {
        searchModel.Email = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        console.log(searchModel);
        dispatch(getDataFilterUser(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setUserInPage(data);
            setLoading(false);
        });
    };
    const modalUser = (type) => {
        let title;
        let disable;
        if (type === 'edit') {
            title = 'Chỉnh sửa tài khoản';
            disable = false;
        } else if (type === 'view') {
            title = 'Xem chi tiết tài khoản';
            disable = true;
        } else {
            title = 'Tạo mới tài khoản';
        }
        return (
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h3" component="h2">
                        {title}
                    </Typography>
                    <Tabs defaultActiveKey="1" style={{ color: 'black', fontSize: '19px' }}>
                        <TabPane tab={<span>Thông tin chung</span>} key="1">
                            <div
                                className="container_addProduct"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_addProduct"
                                    style={{
                                        paddingBottom: '20px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        id="outlined-error"
                                        label="Họ"
                                        defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].firstName : firstName}
                                        disabled={disable}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Tên"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].lastName : lastName}
                                        disabled={disable}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Email"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].email : email}
                                        disabled={disable}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                            Quyền
                                        </InputLabel>
                                        <NativeSelect
                                            disabled={disable}
                                            
                                            defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].role : role}
                                            inputProps={{
                                            name: 'role',
                                            id: 'uncontrolled-native',
                                            }}
                                            // onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value={'user'}>Khách hàng</option>
                                            <option value={'admin'}>Quản trị viên</option>
                                        </NativeSelect>
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                            Trạng thái
                                        </InputLabel>
                                        <NativeSelect
                                            disabled={disable}
                                            defaultValue={type === 'create' ? '' : selectedRows[0] ? selectedRows[0].status : status}
                                            inputProps={{
                                            name: 'paymentStatus',
                                            id: 'uncontrolled-native',
                                            }}
                                            // onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value={'enable'}>Sử dụng</option>
                                            <option value={'disable'}>Ngừng sử dụng</option>
                                        </NativeSelect>
                                    </FormControl>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{}}>
                        <Button size="small" variant="outlined" color="success" onClick={handleEdit}>
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
            <Form style={{ marginBottom: '10px' }}>
                <Collapse defaultActiveKey={['1']} expandIconPosition={'right'} className="mps-search-header-collapse">
                    <Collapse.Panel header={<span className="mps-search-header-panel-title"> Thông tin tìm kiếm</span>} key="1">
                        <CardANTD style={{ border: 'none' }}>
                        <CardANTD.Grid style={gridStyle}>
                                <Row>
                                    <Col span={8}>
                                        <Form.Item>Vai trò</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeRole}
                                            >
                                                {filterArrayRole.map((item) => (
                                                    <Option key={item.role} data={item._id} text={item.role === 'user' ? 'Khách hàng' : 'Quản trị viên'}>
                                                        {console.log(item)}
                                                        <div className="global-search-item">
                                                            <span>{item.role === 'user' ? 'Khách hàng' : 'Quản trị viên'}</span>
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
                                        <Form.Item>Tên</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeName}
                                            >
                                                {filterArrayName.map((item) => (
                                                    <Option key={item._id} data={item._id} text={item.lastName}>
                                                        <div className="global-search-item">
                                                            <span>{item.lastName}</span>
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
                                        <Form.Item>Trạng thái</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeStatus}
                                            >
                                                {filterArrayStatus.map((item) => (
                                                    <Option key={item.status} data={item._id} text={item.status === 'enable' ? 'Sử dụng' : 'Ngừng sử dụng'}>
                                                        <div className="global-search-item">
                                                            <span>{item.status === 'enable' ? 'Sử dụng' : 'Ngừng sử dụng'}</span>
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
                                        <Form.Item>Email</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeEmail}
                                            >
                                                {filterArrayEmail.map((item) => (
                                                    <Option key={item.email} data={item.email} text={item.email}>
                                                        <div className="global-search-item">
                                                            <span>{item.email   }</span>
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
            <MainCard title="Tài khoản">
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                    <Button variant="outlined" onClick={handleCreate} color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                        Thêm mới
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                        Xem
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditUser}>
                        Chỉnh sửa
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
                {modalUser(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={userInPage.length !== 0 ? userInPage : []}
                            columns={userInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = userInPage.filter((row) => selectedIDs.has(row._id));

                                setSelectedRows(selectedRows);
                            }}
                            loading={loading}
                        />
                    </div>
                </Grid>
            </MainCard>
        </ComponentSkeleton>
    );
};

export default AccountPage;
