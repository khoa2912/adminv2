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
import { addRole, getDataFilterRole, deleteRoleById, updateRole } from 'actions/role';
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
        Role_Name: '',
        Status: ''
    });
    const [loading, setLoading] = useState(false);
    const [roleInPage, setRoleInPage] = useState([]);
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterRole()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setRoleInPage(data);
            setLoading(false);
        });
    }, [dispatch]);
    // useEffect(() => {
    //     dispatch(getAllRole());
    // }, []);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const auth = useSelector((state) => state.auth);
    const role = useSelector((state) => state.role);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [codeRole, setCodeRole] = useState('');
    const [nameRole, setNameRole] = useState('');
    const [descriptionRole, setDescriptionRole] = useState('');
    const [status, setStatus] = useState('enable');
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (role.message === 'successcreate') {
            notification['success']({
                message: 'Thêm mới vai trò',
                description: 'Thêm mới vai trò thành công.'
            });
        }
    }, [role.message]);
    const columns = [
        { field: 'id', headerName: 'STT', width: 100 },
        { field: 'codeRole', headerName: 'Mã vai trò', width: 150 },
        { field: 'nameRole', headerName: 'Tên vai trò', width: 150 },
        { field: 'descriptionRole', headerName: 'Mô tả', width: 130 },

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
        setCodeRole('');
        setDescriptionRole('');
        setNameRole('');
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
            const temp = roleInPage.length;
            
            dispatch(deleteRoleById(payload)).then((data) => {
                dispatch(getDataFilterRole()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleInPage(data);
                    setLoading(false);
                    if(temp!=data.length) {
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
                    // console.log(temp);
                    // console.log(data.length);
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
        if (codeRole.trim() === '' || nameRole.trim() === '') {
            notification['warning']({
                message: 'Thêm mới vai trò',
                description: 'Vui lòng nhập dữ liệu.'
            });
        }
        try {
            const data = {
                codeRole,
                nameRole,
                descriptionRole,
                status
            };
            dispatch(addRole(data)).then((data) => {
                dispatch(getDataFilterRole()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Thêm mới Role',
                        description: 'Thêm mới Role thành công.'
                    });
                    setCodeRole('');
                    setNameRole('');
                    setDescriptionRole('');
                    setStatus('');
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Thêm mới Role',
                        description: 'Thêm mới Role thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };

    const handleUpdateRole = async (e) => {
        try {
            const data = {
                _id: selectedRows[0]._id,
                createdBy: selectedRows[0].createdBy,
                codeRole,
                nameRole,
                descriptionRole,
                status
            };        
            console.log(data);
            dispatch(updateRole(data)).then((data) => {
                dispatch(getDataFilterRole()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Cập nhập Role',
                        description: 'Cập nhập Role thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Cập nhập Role',
                        description: 'Cập nhập Role thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }  
    };
    // Filter in Role
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
   
    // Filter role
    var filterArrayRole = removeDuplicates(roleInPage, "role");
    // console.log(filterArrayRole);
    
    // Filter Status
    var filterArrayStatus = removeDuplicates(roleInPage, "status");
    // console.log(filterArrayStatus);

    const handleChangeRoleName = (value) => {
        searchModel.Role_Name = value;
        setSearchModel(searchModel);
    };
    const handleChangeStatus = (value) => {
        searchModel.Status = value;
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
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        id="outlined-error"
                                        label="Mã vai trò"
                                        value={codeRole}
                                        disabled={disable}
                                        onChange={(e) => setCodeRole(e.target.value)}
                                    />
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
                                        value={descriptionRole}
                                        disabled={disable}
                                        onChange={(e) => setDescriptionRole(e.target.value)}
                                    />
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Trạng thái</InputLabel>
                                        <SelectMui
                                            disabled={disable}
                                            value={ status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                        >
                                            <MenuItem value={'enable'}>Sử dụng</MenuItem>
                                            <MenuItem value={'disable'}>Ngừng sử dụng</MenuItem>
                                        </SelectMui>
                                    </FormControl>
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
                                                onChange={handleChangeRoleName}
                                            >
                                                {filterArrayRole.map((item) => (
                                                    <Option key={item.nameRole} data={item.codeRole} text={item.nameRole}>
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
                                                    <Option key={item.status} data={item.status} text={item.status === 'enable' ? 'Sử dụng' : 'Ngừng sử dụng'}>
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
                                    setCodeRole(selectedRows[0].codeRole);
                                    setNameRole(selectedRows[0].nameRole);
                                    setDescriptionRole(selectedRows[0].descriptionRole);
                                    setStatus(selectedRows[0].status);
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
