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
import { createInfoProduct, getDataFilterInfoProduct, deleteInfoProductById, updateInfoProduct, getInfoProducts } from 'actions/infoProduct';
import { PlusOutlined } from '@ant-design/icons';
import { object } from 'prop-types';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| Info Product Page ||============================ //

const InfoProductPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        TypeInfo: '',
    });
    const tag = useSelector((state) => state.tag);
    const [open, setOpen] = useState(false);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const [loading, setLoading] = useState(false);
    const [infoInPage, setInfoInPage] = useState([]);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [name, setName] = useState('');
    const [typeInfo, setTypeInfo] = useState('');
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterInfoProduct()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setInfoInPage(data);
            setLoading(false);
        });
        dispatch(getInfoProducts());
    }, [dispatch]);
    const columns = [
        { field: '_id', headerName: 'Mã thông tin sản phẩm', width: 250 },
        { field: 'name', headerName: 'Thông tin', width: 150 },
        {
            field: 'type',
            headerName: 'Loại thông tin',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="rowitem" style={{ textAlign: 'center' }}>
                        {params.row.type === 'ram' ? 'RAM' : params.row.type === 'cpu' ? 'CPU' : params.row.type === 'mausac' ? 'Màu sắc' :
                        params.row.type === 'manhinh' ? 'Màn hình' : ''}
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
                message: 'Xem thông tin',
                description: 'Vui lòng chọn thông tin bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem thông tin',
                description: 'Vui lòng chỉ chọn một thông tin.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        setName('');
        setTypeInfo('');
        handleOpen();
    };
    
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá thông tin',
                description: 'Vui lòng chọn thông tin bạn muốn xoá.'
            });
        } else {
            let listInfo = [];
            selectedRows.map((item) => {
                listInfo.push(item._id);
            });
            const payload = {
                infoProductId: listInfo
            };            
            dispatch(deleteInfoProductById(payload)).then((data) => {
                dispatch(getDataFilterInfoProduct()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setInfoInPage(data);
                    setLoading(false);
                });
                if(data === 'success') {
                    notification['success']({
                        message: 'Xoá thông tin',
                        description: 'Xoá thông tin thành công.'
                    });
                } 
                else {
                    notification['error']({
                        message: 'Xoá thông tin',
                        description: 'Xoá thông tin không thành công.'
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
    const handleChangeType = (value) => {
        searchModel.TypeInfo = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        dispatch(getDataFilterInfoProduct(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setInfoInPage(data);
            setLoading(false);
        });
    };
    
    const handleEditInfo = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa thông tin',
                description: 'Vui lòng chọn thông tin bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem thông tin',
                description: 'Vui lòng chỉ chọn một thông tin.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };

    const handleAddInfo = async () => {
        if (name.trim() === '' || typeInfo === '') {
            notification['warning']({
                message: 'Thêm mới thông tin',
                description: 'Vui lòng nhập dữ liệu.'
            });
            return;
        }
        try {
            const data = {
                name,
                typeInfo
            };
            console.log(data)
            dispatch(createInfoProduct(data)).then((data) => {
                dispatch(getDataFilterInfoProduct()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setInfoInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Thêm mới thông tin',
                        description: 'Thêm mới thông tin thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Thêm mới thông tin',
                        description: 'Thêm mới thông tin thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };
    const handleUpdateInfo = async (e) => {
        try {
            const data = {
                _id: selectedRows[0]._id,
                name,
                typeInfo
            };        
            console.log(data);
            dispatch(updateInfoProduct(data)).then((data) => {
                dispatch(getDataFilterInfoProduct()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setInfoInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Cập nhập thông tin',
                        description: 'Cập nhập thông tin thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Cập nhập thông tin',
                        description: 'Cập nhập thông tin thất bại.',
                    });
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }  
    };
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
    var filterArrayType = removeDuplicates(infoInPage, "type");
    const modalInfoProduct = (type) => {
        let title;
        let disable;
        let Setonclick;
        if (type === 'edit') {
            title = 'Chỉnh sửa thông tin';
            disable = false;
            Setonclick = handleUpdateInfo;
        } else if (type === 'view') {
            title = 'Xem chi tiết thông tin';
            disable = true;
        } else if (type === 'create') {
            title = 'Tạo mới thông tin';
            disable = false;
            Setonclick = handleAddInfo;
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
                                className="container_infoOfProduct"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_infoOfProduct"
                                    style={{
                                        paddingBottom: '20px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Thông tin"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={name ? name : ''}
                                        disabled={disable}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    {/* <TextField
                                        required
                                        id="outlined-number"
                                        label="Loại thông tin"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={typeInfo ? typeInfo : ''}
                                        disabled={disable}
                                        onChange={(e) => setTypeInfo(e.target.value)}
                                    /> */}
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Loại thông tin</InputLabel>
                                        <SelectMui
                                            disabled={disable}
                                            value={typeInfo ? typeInfo : ''}                                            
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            onChange={(e) => setTypeInfo(e.target.value)}
                                        >
                                            <MenuItem value={'ram'}>Ram</MenuItem>
                                            <MenuItem value={'cpu'}>CPU</MenuItem>
                                            <MenuItem value={'mausac'}>Màu sắc</MenuItem>
                                            <MenuItem value={'manhinh'}>Màn hình</MenuItem>
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
                                        <Form.Item>Loại thông tin</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeType}
                                            >
                                                {filterArrayType.map((item) => (
                                                    <Option key={item.type} data={item.type}
                                                        text={item.type === 'ram' ? 'RAM' : item.type === 'mausac' ? 'Màu sắc' : 
                                                        item.type === 'manhinh' ? 'Màn hình' : item.type === 'cpu' ? 'CPU' : null}
                                                    >
                                                        <div className="global-search-item">
                                                            <span>{item.type === 'ram' ? 'RAM' : item.type === 'mausac' ? 'Màu sắc' : 
                                                            item.type === 'manhinh' ? 'Màn hình' : item.type === 'cpu' ? 'CPU' : null}</span>
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
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditInfo}>
                        Chỉnh sửa
                    </Button>
                </Stack>
                {modalInfoProduct(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={infoInPage.length !== 0 ? infoInPage : []}
                            columns={infoInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = infoInPage.filter((row) => selectedIDs.has(row._id));
                                if (selectedRows.length === 1) {
                                    setName(selectedRows[0].name);
                                    setTypeInfo(selectedRows[0].typeInfo);
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

export default InfoProductPage;
