// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
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
import { addAction, getDataFilterAction, deleteActionById, updateAction } from 'actions/action';
import { PlusOutlined } from '@ant-design/icons';
import { object } from 'prop-types';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| Action Page ||============================ //

const ActionPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        ActionName: '',
        Description: ''
    });
    const [open, setOpen] = useState(false);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const [loading, setLoading] = useState(false);
    const [actionInPage, setActionInPage] = useState([]);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [nameAction, setNameAction] = useState('');
    const [description, setDescription] = useState('');
    
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterAction()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setActionInPage(data);
            setLoading(false);
        });
    }, [dispatch]);
    const columns = [
        { field: '_id', headerName: 'Mã Action', width: 200 },
        { field: 'nameAction', headerName: 'Tên Action', width: 300 },
        { field: 'description', headerName: 'Mô tả', width: 500 }
    ];
    // eslint-disable-next-line
    const [selectedRows, setSelectedRows] = useState([]);
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem Action',
                description: 'Vui lòng chọn Action bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Action',
                description: 'Vui lòng chỉ chọn một Action.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        setNameAction('');
        setDescription('');
        handleOpen();
    };
    
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá Action',
                description: 'Vui lòng chọn Action bạn muốn xoá.'
            });
        } else {
            let listAction = [];
            selectedRows.map((item) => {
                listAction.push(item._id);
            });
            const payload = {
                actionId: listAction
            };
            const temp = actionInPage.length;
            
            dispatch(deleteActionById(payload)).then((data) => {
                dispatch(getDataFilterAction()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setActionInPage(data);
                    setLoading(false);
                    if(temp!=data.length) {
                        notification['success']({
                            message: 'Xoá Action',
                            description: 'Xoá Action thành công.'
                        });
                    } 
                    else {
                        notification['error']({
                            message: 'Xoá Action',
                            description: 'Xoá Action không thành công.'
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
    const handleChangeActionName = (value) => {
        searchModel.ActionName = value;
        setSearchModel(searchModel);
    };
    const handleChangeDescription = (value) => {
        searchModel.Description = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        console.log(searchModel);
        dispatch(getDataFilterAction(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setActionInPage(data);
            setLoading(false);
        });
    };
    const handleEditUser = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa Action',
                description: 'Vui lòng chọn Action bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Action',
                description: 'Vui lòng chỉ chọn một Action.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };

    const handleAddAction = async () => {
        if (nameAction.trim() === '') {
            notification['warning']({
                message: 'Thêm mới Action',
                description: 'Vui lòng nhập dữ liệu.'
            });
            return;
        }
        try {
            const data = {
                nameAction,
                description,
            };
            dispatch(addAction(data)).then((data) => {
                dispatch(getDataFilterAction()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setActionInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Thêm mới Action',
                        description: 'Thêm mới Action thành công.'
                    });
                    setNameAction('');
                    setDescription('');
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Thêm mới Action',
                        description: 'Thêm mới Action thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };
    const handleUpdateAction = async (e) => {
        try {
            const data = {
                _id: selectedRows[0]._id,
                nameAction,
                description
            };        
            console.log(data);
            dispatch(updateAction(data)).then((data) => {
                dispatch(getDataFilterAction()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setActionInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Cập nhập Action',
                        description: 'Cập nhập Action thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Cập nhập Action',
                        description: 'Cập nhập Action thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }  
    };
    const modalUser = (type) => {
        let title;
        let disable;
        let Setonclick;
        if (type === 'edit') {
            title = 'Chỉnh sửa Action';
            disable = false;
            Setonclick = handleUpdateAction;
        } else if (type === 'view') {
            title = 'Xem chi tiết Action';
            disable = true;
        } else if (type === 'create') {
            title = 'Tạo mới Action';
            disable = false;
            Setonclick = handleAddAction;
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
                                className="container_infoAction"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_infoAction"
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
                                        label="Mã Action"
                                        value={selectedRows[0] ? selectedRows[0]._id : null}
                                        disabled="true"
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Tên Action"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={nameAction}
                                        disabled={disable}
                                        onChange={(e) => setNameAction(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Slug"
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
                                        <Form.Item>Tên Action</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeActionName}
                                            >
                                                {actionInPage.map((item) => (
                                                    <Option key={item.nameAction} data={item._id} text={item.nameAction}>
                                                        <div className="global-search-item">
                                                            <span>{item.nameAction}</span>
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
                                        <Form.Item>Mô tả</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeDescription}
                                            >
                                                {actionInPage.map((item) => (
                                                    <Option key={item.description} data={item._id} text={item.description}>
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
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditUser}>
                        Chỉnh sửa
                    </Button>
                </Stack>
                {modalUser(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={actionInPage.length !== 0 ? actionInPage : []}
                            columns={actionInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = actionInPage.filter((row) => selectedIDs.has(row._id));
                                if (selectedRows.length === 1) {
                                    setNameAction(selectedRows[0].nameAction);
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

export default ActionPage;
