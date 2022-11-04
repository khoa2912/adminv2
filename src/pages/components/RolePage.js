// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { Card as CardANTD, Spin } from 'antd';
import { Col, Collapse, Form, Row, Upload, Select } from '../../../node_modules/antd/lib/index';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    Divider,
    Grid,
    Modal,
    Stack,
    Typography,
    TextField,
    Select as SelectMui,
    FormControl,
    InputLabel,
    OutlinedInput,
    NativeSelect,
    MenuItem,
    CardActions
} from '../../../node_modules/@mui/material/index';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import { Tabs } from 'antd';
import { addRole, getDataFilterRole, deleteRoleById, updateRole, getRoles } from 'actions/role';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| ANT ICONS ||============================ //

const RolePage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        RoleID: '',
    });
    const [loading, setLoading] = useState(false);
    const [roleInPage, setRoleInPage] = useState([]);
    // useEffect(() => {
    //     dispatch(getAllRole());
    // }, []);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const auth = useSelector((state) => state.auth);
    const role = useSelector((state) => state.role);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [nameRole, setNameRole] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('enable');
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterRole()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setRoleInPage(data);
            setLoading(false);
        });
    }, [dispatch]);
    console.log(roleInPage)
    const columns = [
        { field: 'id', headerName: 'STT', width: 100 },
        { field: 'nameRole', headerName: 'Tên vai trò', width: 150 },
        { field: 'description', headerName: 'Mô tả', width: 150 },
        { field: 'createdTime', headerName: 'Thời gian tạo', width: 230 },
    ];
    // eslint-disable-next-line
    const [selectedRows, setSelectedRows] = useState([]);
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chọn vai trò bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chỉ chọn một vai trò.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        setNameRole('');
        setDescription('');
        handleOpen();
    };
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá Role',
                description: 'Vui lòng chọn Role bạn muốn xoá.'
            });
        } else {
            let listIdRole = [];
            selectedRows.map((item) => {
                listIdRole.push(item._id);
            });
            const payload = {
                roleId: listIdRole
            };
            dispatch(deleteRoleById(payload)).then((data) => {
                dispatch(getDataFilterRole()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleInPage(data);
                });
                if(data==='success') {
                    notification['success']({
                        message: 'Xoá Role',
                        description: 'Xoá Role thành công.'
                    });
                } 
                else {
                    notification['error']({
                        message: 'Xoá Role',
                        description: 'Xoá Role không thành công.'
                    });
                }
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
    const handleEdit = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa vai trò',
                description: 'Vui lòng chọn vai trò bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chỉ chọn một vai trò.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };
    const hanlePermistion = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Phân quyền vai trò',
                description: 'Vui lòng chọn vai trò bạn muốn phân quyền.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chỉ chọn một vai trò.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };
    const handleAddRole = async (e) => {
        if (nameRole.trim() === '') {
            notification['warning']({
                message: 'Thêm mới vai trò',
                description: 'Vui lòng nhập dữ liệu.'
            });
        }
        try {
            const data = {
                nameRole,
                description
            };
            // const findOther = roleInPage.find(item => item.nameRole === data.nameRole);
            dispatch(addRole(data)).then((data) => {
                dispatch(getDataFilterRole()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleInPage(data);
                });
                console.log(data)
                if (data === 'success') {
                    notification['success']({
                        message: 'Thêm mới Role',
                        description: 'Thêm mới Role thành công.'
                    });
                    handleClose();
                } else {
                    notification['error'] ({
                        message: 'Thêm mới Role',
                        description: 'Thêm mới Role thất bại.',
                    });
                    handleClose();
                }
            })       
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };

    const handleUpdateRole = async (e) => {
        try {
            const data = {
                _id: selectedRows[0]._id,
                nameRole,
                description
            };
            // const findOther = roleInPage.find(item => item.nameRole === data.nameRole);
            dispatch(updateRole(data)).then((data) => {
                dispatch(getDataFilterRole()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleInPage(data);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Chỉnh sửa Role',
                        description: 'Chỉnh sửa Role thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Chỉnh sửa Role',
                        description: 'Chỉnh sửa Role thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }  
    };

    const handleChangeRoleID = (value) => {
        searchModel.RoleID = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        dispatch(getDataFilterRole(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setRoleInPage(data);
            setLoading(false);
        });
    };
    const modalUser = (type) => {
        let title;
        let disable;
        let Setonclick;
        if (type === 'edit') {
            title = 'Chỉnh sửa vai trò';
            disable = false;
            Setonclick = handleUpdateRole;
        } else if (type === 'view') {
            title = 'Xem chi tiết vai trò';
            disable = true;
        } else {
            disable = false;
            Setonclick = handleAddRole;
            title = 'Tạo mới vai trò';
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
                                className="container_infoRole"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_infoRole"
                                    style={{
                                        paddingBottom: '20px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Tên vai trò"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={nameRole}
                                        disabled={disable}
                                        onChange={(e) => setNameRole(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Mô tả"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={description}
                                        disabled={disable}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{ padding: '0' }}>
                        <Button size="small" variant="outlined" color="success" onClick={Setonclick}>
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
                                        <Form.Item>Tên vai trò</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeRoleID}
                                            >
                                                {roleInPage.map((item) => (
                                                    <Option key={item._id} data={item._id} text={item.nameRole}>
                                                        <div className="global-search-item">
                                                            <span>{item.nameRole}</span>
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
            <MainCard>
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                    <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />} style={{ cursor: 'pointer' }}>
                        Tìm kiếm
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                        Xem
                    </Button>
                    <Button variant="outlined" onClick={handleCreate} color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                        Thêm mới
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
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEdit}>
                        Chỉnh sửa
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={hanlePermistion}>
                        Phân quyền
                    </Button>
                </Stack>
                {modalUser(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={roleInPage.length !== 0 ? roleInPage : []}
                            columns={roleInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = roleInPage.filter((row) => selectedIDs.has(row._id));
                                if (selectedRows.length === 1) {
                                    setNameRole(selectedRows[0].nameRole);
                                    setDescription(selectedRows[0].description);
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

export default RolePage;
