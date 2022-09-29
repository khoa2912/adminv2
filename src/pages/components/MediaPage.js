// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
import { Card as CardANTD, Spin } from 'antd';
import { Col, Collapse, Form, Row, Upload, Select } from '../../../node_modules/antd/lib/index';
import { getPages, getDataFilterPage } from 'actions/page';
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
    OutlinedInput,
    MenuItem,
    CardActions
} from '../../../node_modules/@mui/material/index';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Space, Popconfirm } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;
// ============================|| Media Page ||============================ //

const MediaPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        Title: ''
    });
    const text = 'Bạn có chắc chắn muốn xoá?';
    const [loading, setLoading] = useState(false);
    const [mediaInPage, setMediaInPage] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [banners, setBanners] = useState('');
    const [products, setProducts] = useState('');
    const handleOpen = () => setOpen(true);
    const [type, setType] = useState('');
    const [open, setOpen] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterPage()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setMediaInPage(data);
            setLoading(false);
        });
    }, [dispatch]);

    const columns = [
        { field: 'id', headerName: 'Số thứ tự', width: 100 },
        { field: 'title', headerName: 'Tiêu đề', width: 300 },
        { field: 'description', headerName: 'Mô tả chi tiết', width: 300 }
    ];
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
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem Page',
                description: 'Vui lòng chọn Page bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Page',
                description: 'Vui lòng chỉ chọn một Page.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá Page',
                description: 'Vui lòng chọn Page bạn muốn xoá.'
            });
        } else {
            notification['success']({
                message: 'Xoá Page',
                description: 'Xoá Page thành công.'
            });
        }
    };
    const handleChangeTitle = (value) => {
        searchModel.Title = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        console.log(searchModel);
        dispatch(getDataFilterPage(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setMediaInPage(data);
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
                                        <Form.Item>Tiêu đề</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeTitle}
                                            >
                                                {mediaInPage.map((item) => (
                                                    <Option key={item.title} data={item.title} text={item.title}>
                                                        <div className="global-search-item">
                                                            <span>{item.title}</span>
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
                    {/* <Button variant="outlined" onClick={handleCreate} color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                        Thêm mới
                    </Button> */}
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                        Xem
                    </Button>
                    {/* <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditUser}>
                        Chỉnh sửa
                    </Button> */}

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
                {/* {modalUser(type)} */}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={mediaInPage.length !== 0 ? mediaInPage : []}
                            columns={mediaInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = mediaInPage.filter((row) => selectedIDs.has(row._id));
                                console.log(selectedRows);
                                if (selectedRows.length === 1) {
                                    setTitle(selectedRows[0].title);
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

export default MediaPage;
