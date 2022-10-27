// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import { Card as CardANTD, Spin } from 'antd';
import { Col, Collapse, Form, Row, Upload, Select } from '../../../node_modules/antd/lib/index';
import {
    Box,
    Button,
    Divider,
    Grid,
    Modal,
    Stack,
    NativeSelect,
    Select as SelectMui,
    SelectChangeEvent,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    OutlinedInput,
    MenuItem,
    CardActions
} from '../../../node_modules/@mui/material/index';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Image, Space, Popconfirm } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import { Tabs } from 'antd';
import { getRoleActions, addRoleAction, deleteRoleActionById, updateRoleAction, getDataFilterRoleAction } from 'actions/roleaction';
import { getActions } from 'actions/action';
import { getRoles } from 'actions/role';
import { PlusOutlined } from '@ant-design/icons';
import { object } from 'prop-types';
import role from 'reducers/role';
import action from 'reducers/action';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| Tag Page ||============================ //

const RoleActionPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        RoleID: '',
    });
    const action = useSelector((state) => state.action);
    const role = useSelector((state) => state.role);
    const [open, setOpen] = useState(false);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const [loading, setLoading] = useState(false);
    const [roleactionInPage, setRoleActionInPage] = useState([]);
    const [type, setType] = useState('');
    const [roleId, setRoleId] = useState('');
    const [listAction, setListAction] = useState([]);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterRoleAction()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setRoleActionInPage(data);
            setLoading(false);
        });
        dispatch(getRoles());
        dispatch(getActions());
        
    }, [dispatch]);
    console.log(roleactionInPage);
    const columns = [
        { field: '_id', headerName: 'Mã Role Action', width: 200 },
        { field: 'createdTime', headerName: 'Ngày tạo', width: 250 },
        { field: 'updatedTime', headerName: 'Ngày cập nhập', width: 250 }
    ];
    // eslint-disable-next-line
    const [selectedRows, setSelectedRows] = useState([]);
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem Role Action',
                description: 'Vui lòng chọn Role Action bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Role Action',
                description: 'Vui lòng chỉ chọn một Role Action.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        setRoleId('');
        setListAction([]);
        handleOpen();
    };
    
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá Role Action',
                description: 'Vui lòng chọn Role Action bạn muốn xoá.'
            });
        } else {
            let listRoleaction = [];
            selectedRows.map((item) => {
                listRoleaction.push(item._id);
            });
            const payload = {
                roleactionId: listRoleaction
            };            
            dispatch(deleteRoleActionById(payload)).then((data) => {
                dispatch(getDataFilterRoleAction()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleActionInPage(data);
                    setLoading(false);
                });
                if(data === 'success') {
                    notification['success']({
                        message: 'Xoá Role Action',
                        description: 'Xoá Role Action thành công.'
                    });
                } 
                else {
                    notification['error']({
                        message: 'Xoá Role Action',
                        description: 'Xoá Role Action không thành công.'
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
        width: 1200,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        zIndex: 50,
        p: 4
    };
    notification.config({
        placement: 'topRight',
        top: 80,
        duration: 3,
        rtl: false,
        zIndex: 100
    });
    const handleChangeRole = (value) => {
        searchModel.RoleID = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        dispatch(getDataFilterRoleAction(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setRoleActionInPage(data);
            setLoading(false);
        });
    };
    
    const handleEditTag = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa Role Action',
                description: 'Vui lòng chọn Role Action bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Role Action',
                description: 'Vui lòng chỉ chọn một Role Action.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };

    const handleAddRoleAction = async () => {
        if (roleId.trim() === '') {
            notification['warning']({
                message: 'Thêm mới Role Action',
                description: 'Vui lòng nhập dữ liệu.'
            });
            return;
        }
        try {
            const data = {
                roleId,
                listAction,
                updatedTime: Date.now()
            };
            console.log(data)
            dispatch(addRoleAction(data)).then((data) => {
                dispatch(getDataFilterRoleAction()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleActionInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Thêm mới Role Action',
                        description: 'Thêm mới Role Action thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Thêm mới Role Action',
                        description: 'Thêm mới Role Action thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };
    const handleUpdateRoleAction = async (e) => {
        try {
            const data = {
                _id: selectedRows[0]._id,
                roleId,
                listAction,
                updatedTime: Date.now()
            };        
            console.log(data);
            dispatch(updateRoleAction(data)).then((data) => {
                dispatch(getDataFilterRoleAction()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setRoleActionInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Cập nhập Role Action',
                        description: 'Cập nhập Role Action thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Cập nhập Role Action',
                        description: 'Cập nhập Role Action thất bại.',
                    });
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }  
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            },
        },
    };
    const handleChangeAction = (e) => {
        const {
          target: { value },
        } = e;
        setListAction(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const modalRoleAction = (type) => {
        let title;
        let disable;
        let Setonclick;
        if (type === 'edit') {
            title = 'Chỉnh sửa Role Action';
            disable = false;
            Setonclick = handleUpdateRoleAction;
        } else if (type === 'view') {
            title = 'Xem chi tiết Role Action';
            disable = true;
        } else if (type === 'create') {
            title = 'Tạo mới Role Action';
            disable = false;
            Setonclick = handleAddRoleAction;
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
                                className="container_infoRoleAction"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_infoRoleAction"
                                    style={{
                                        paddingBottom: '20px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Role</InputLabel>
                                        <SelectMui
                                            disabled={disable}
                                            value={roleId ? roleId: null}
                                            label="Role"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            onChange={(e) => setRoleId(e.target.value)}
                                        >
                                            {role.roles.map((option) => (
                                                <MenuItem value={option._id}>{option.nameRole}</MenuItem>
                                            ))}
                                        </SelectMui>
                                    </FormControl>
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Action</InputLabel>
                                        <SelectMui
                                            disabled={disable}
                                            value={listAction ? listAction: []}
                                            label="Action"
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            input={<OutlinedInput label="Action" />}
                                            renderValue={
                                                (selected) => {
                                                    const newArr = selected.map((element, index) => {
                                                        const a = action.actions.find(data => data._id === element)
                                                        return a.actionName
                                                    })
                                                    selected = newArr;
                                                    // console.log(selected);
                                                    return selected.join(', ')
                                                }
                                            }
                                            onChange={handleChangeAction}
                                            MenuProps={MenuProps}
                                        >
                                            {action.actions.map((option) => (
                                                // <MenuItem value={option._id}>{option.actionName}</MenuItem>
                                                <MenuItem key={option._id} value={option._id}>
                                                    <Checkbox checked={listAction.indexOf(option._id) > -1}/>
                                                    <ListItemText primary={option.actionName} />
                                                </MenuItem>
                                            ))}
                                            {/* <MenuItem key={option._id} value={option._id}>
                                                <Checkbox checked={option.indexOf(_id) > -1} />
                                                <ListItemText primary={option.actionName} />
                                            </MenuItem> */}
                                        </SelectMui>
                                    </FormControl>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{ padding: '0' }}>
                        <Button size="small" variant="outlined" color="success" onClick={Setonclick} disabled = {disable}>
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
                                        <Form.Item>Tên Role</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeRole}
                                            >
                                                {roleactionInPage.map((item) => (
                                                    <Option key={item.roleId} data={item.roleId} text={item.roleId}>
                                                        <div className="global-search-item">
                                                            <span>{item.roleId}</span>
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
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditTag}>
                        Chỉnh sửa
                    </Button>
                </Stack>
                {modalRoleAction(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={roleactionInPage.length !== 0 ? roleactionInPage : []}
                            columns={roleactionInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = roleactionInPage.filter((row) => selectedIDs.has(row._id));
                                if (selectedRows.length === 1) {
                                    setRoleId(selectedRows[0].roleId);
                                    setListAction(selectedRows[0].listAction);
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

export default RoleActionPage;
