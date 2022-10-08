// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { Card as CardANTD, Spin } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
    IconButton,
    Select as SelectMui,
    NativeSelect,
    OutlinedInput,
    InputAdornment,
    MenuItem,
    CardActions
} from '../../../node_modules/@mui/material/index';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, getDataFilterUser, addUser, deleteAccountById } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import { PlusOutlined } from '@ant-design/icons';
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
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [hash_password, setHash_password] = useState('');
    const [role, setRole] = useState('user');
    const [contactNumber, setContactNumber] = useState('');
    const [status, setStatus] = useState('enable');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInPage, setUserInPage] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [showPassword, SetShowPassword] = useState(false);
    const handleCancel = () => setPreviewVisible(false);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterUser()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setUserInPage(data);
            setLoading(false);
        });
    }, [dispatch]);
    const handlePreview = async (file) => {
        console.log(file);
        setPreviewImage(file.url);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
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
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8
                }}
            >
                Upload
            </div>
        </div>
    );
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });
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
    const handleAddUser = async (e) => {
        if (firstName.trim() === '' || lastName.trim() === '' ||
        email.trim() === '' || hash_password.trim() === '' || status.trim() === '') {
            notification['warning']({
                message: 'Thêm mới tài khoản',
                description: 'Vui lòng nhập dữ liệu.'
            });
            return;
        } 
        if (!fileList) return;
        const list = [];
        for (let pic of fileList) {
            const reader = new FileReader();
            if (pic) {
                const link = await getBase64(pic.originFileObj);
                list.push(link);
            }
        }
        try {
            await fetch('http://localhost:3001/product/uploadPicture', {
                method: 'POST',
                body: JSON.stringify({ data: list }),
                headers: { 'Content-Type': 'application/json' }
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Something went wrong');
                })
                .then((responseJson) => {
                    const data = {
                        firstName,
                        lastName,
                        email,
                        hash_password,
                        role,
                        contactNumber,
                        status,
                        profilePicture: responseJson.result[0]
                    };
                    dispatch(addUser(data)).then((data) => {
                        if (data === 'success') {
                            dispatch(getDataFilterUser()).then((data) => {
                                data.map((item, index) => (item.id = index + 1));
                                setUserInPage(data);
                                setLoading(false);
                            });
                            notification['success']({
                                message: 'Thêm mới Tài khoản',
                                description: 'Thêm mới Tài khoản thành công.'
                            });
                            handleClose();
                            setFirstName('');
                            setLastName('');
                            setEmail('');
                            setHash_password('');
                            setRole('');
                            setContactNumber('');
                            setStatus('');
                            setFileList([]);
                        } else {
                            notification['error']({
                                message: 'Thêm mới Tài khoản',
                                description: 'Thêm mới Tài khoản thất bại.'
                            });
                            handleClose();
                        }
                    });
                });
        } catch (err) {
            throw new Error('Something went wrong');
        }
        // else {
        //     await dispatch(addUser({ firstName, lastName, email, hash_password, role, contactNumber, profilePicture, status })).then(() => {
        //         dispatch(getDataFilterUser()).then((data) => {
        //             data.map((item, index) => (item.id = index + 1));
        //             setUserInPage(data);
        //             setLoading(false);
        //         });
        //     });
        //     handleClose();

        //     if (auth.error) {
        //         notification['error']({
        //             message: 'Thêm tài khoản mới',
        //             description: 'Thêm tài khoản mới thất bại.'
        //         });
        //     }
        // }        
    };
    const handleCreate = () => {
        setType('create');
        setFirstName('');
        setLastName('');
        setEmail('');
        setHash_password('');
        setRole('');
        setContactNumber('');
        setStatus('');
        handleOpen();
    };
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá Tài khoản',
                description: 'Vui lòng chọn Tài khoản bạn muốn xoá.'
            });
        } else {
            let listIdAccount = [];
            selectedRows.map((item) => {
                listIdAccount.push(item._id);
            });
            const payload = {
                userId: listIdAccount
            };
            const temp = userInPage.length;
            
            dispatch(deleteAccountById(payload)).then((data) => {
                dispatch(getDataFilterUser()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setUserInPage(data);
                    setLoading(false);
                    if(temp!=data.length) {
                        notification['success']({
                            message: 'Xoá Tài khoản',
                            description: 'Xoá Tài khoản thành công.'
                        });
                    } 
                    else {
                        notification['error']({
                            message: 'Xoá Tài khoản',
                            description: 'Xoá Tài khoản không thành công.'
                        });
                    }
                    console.log(temp);
                    console.log(data.length);
                });
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
    const handleClickShowPassword = () => {
        SetShowPassword(true);
      };
    
    const handleMouseDownPassword = () => {
        SetShowPassword(false);
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
                                        value={firstName}
                                        disabled={disable}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Tên"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={lastName}
                                        disabled={disable}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                                        <OutlinedInput
                                            id="demo-simple-select"
                                            type={showPassword ? 'text' : 'password'}
                                            value={hash_password}
                                            disabled={disable}
                                            onChange={(e) => setHash_password(e.target.value)}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                                >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            label="hash_password"
                                        />
                                    </FormControl>
                                    {/* <TextField
                                        required
                                        id="outlined-number"
                                        label="Mật khẩu"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        // type="password"
                                        type={hash_password ? 'text' : 'hash_password'}
                                        value={hash_password}
                                        disabled={disable}
                                        onChange={(e) => setHash_password(e.target.value)}
                                    /> */}
                                    <TextField margin = "normal"
                                        required
                                        id="outlined-number"
                                        label="Email"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={email}
                                        disabled={disable}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Số điện thoại"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={contactNumber}
                                        disabled={disable}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                    />
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Quyền</InputLabel>
                                        <SelectMui
                                            labelId="demo-simple-select-label"
                                            disabled={disable}
                                            value={role}
                                            id="demo-simple-select"
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <MenuItem value={'user'}>Khách hàng</MenuItem>
                                            <MenuItem value={'admin'}>Quản trị viên</MenuItem>
                                        </SelectMui>
                                    </FormControl>
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Trạng thái</InputLabel>
                                        <SelectMui
                                            labelId="demo-simple-select-label"
                                            disabled={disable}
                                            value={status}
                                            id="demo-simple-select"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <MenuItem value={'enable'}>Sử dụng</MenuItem>
                                            <MenuItem value={'disable'}>Ngừng sử dụng</MenuItem>
                                        </SelectMui>
                                    </FormControl>
                                    <ul></ul>
                                    <Upload
                                        listType="picture-card"
                                        // fileList={fileList}
                                        defaultFileList={fileList ? fileList : []}
                                        onPreview={handlePreview}
                                        onChange={handleChange}
                                        beforeUpload={() => {
                                            /* update state here */
                                            return false;
                                        }}
                                        disabled={disable}
                                    >
                                        {/* {console.log(fileList)} */}
                                        {fileList.length > 0 ? null : uploadButton}
                                    </Upload>
                                    <Modal
                                        visible={previewVisible}
                                        title={previewTitle}
                                        footer={null}
                                        onCancel={handleCancel}
                                        style={{ zIndex: 9999999 }}
                                    >
                                        <img
                                            alt="example"
                                            style={{
                                                width: '100%'
                                            }}
                                            src={previewImage}
                                        />
                                    </Modal>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{}}>
                        <Button size="small" variant="outlined" color="success" onClick={handleAddUser} disabled = {disable}>
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
                                if (selectedRows.length === 1) {
                                    setFirstName(selectedRows[0].firstName);
                                    setLastName(selectedRows[0].lastName);
                                    setEmail(selectedRows[0].email);
                                    setHash_password(selectedRows[0].hash_password);
                                    setRole(selectedRows[0].role);
                                    setContactNumber(selectedRows[0].contactNumber);
                                    setStatus(selectedRows[0].status);
                                    setFileList([{ url: selectedRows[0].profilePicture }]);
                                }
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
