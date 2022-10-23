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
import { addTag, getDataFilterTag, deleteTagById, updateTag, getTags } from 'actions/tag';
import { PlusOutlined } from '@ant-design/icons';
import { object } from 'prop-types';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| Tag Page ||============================ //

const TagPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        TagName: '',
    });
    const tag = useSelector((state) => state.tag);
    const [open, setOpen] = useState(false);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const [loading, setLoading] = useState(false);
    const [tagInPage, setTagInPage] = useState([]);
    const [type, setType] = useState('');
    const [parentId, setParentId] = useState(null);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [tagName, setTagName] = useState('');
    const [listTag, setListTag] = useState([]);
    const [updatedTime, setUpdatedTime] = useState('');
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterTag()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setTagInPage(data);
            setLoading(false);
        });
        dispatch(getTags());
    }, [dispatch]);
    const columns = [
        { field: '_id', headerName: 'Mã Tag', width: 200 },
        { field: 'tagName', headerName: 'Tên Tag', width: 300 },
        { field: 'createdTime', headerName: 'Mô tả', width: 250 },
        { field: 'updatedTime', headerName: 'Mô tả', width: 250 }
    ];
    // eslint-disable-next-line
    const [selectedRows, setSelectedRows] = useState([]);
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem Tag',
                description: 'Vui lòng chọn Tag bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Tag',
                description: 'Vui lòng chỉ chọn một Tag.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        setTagName('');
        handleOpen();
    };
    
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá Tag',
                description: 'Vui lòng chọn Tag bạn muốn xoá.'
            });
        } else {
            let listTag = [];
            selectedRows.map((item) => {
                listTag.push(item._id);
            });
            const payload = {
                tagId: listTag
            };            
            dispatch(deleteTagById(payload)).then((data) => {
                dispatch(getDataFilterTag()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setTagInPage(data);
                    setLoading(false);
                });
                if(data === 'success') {
                    notification['success']({
                        message: 'Xoá Tag',
                        description: 'Xoá Tag thành công.'
                    });
                } 
                else {
                    notification['error']({
                        message: 'Xoá Tag',
                        description: 'Xoá Tag không thành công.'
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
    const handleChangeTagName = (value) => {
        searchModel.TagName = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        dispatch(getDataFilterTag(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setTagInPage(data);
            setLoading(false);
        });
    };
    
    const handleEditTag = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa Tag',
                description: 'Vui lòng chọn Tag bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Tag',
                description: 'Vui lòng chỉ chọn một Tag.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };

    const handleAddTag = async () => {
        if (tagName.trim() === '') {
            notification['warning']({
                message: 'Thêm mới Tag',
                description: 'Vui lòng nhập dữ liệu.'
            });
            return;
        }
        try {
            const data = {
                tagName,
                parentId,
                updatedTime: Date.now()
            };
            console.log(data)
            dispatch(addTag(data)).then((data) => {
                dispatch(getDataFilterTag()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setTagInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Thêm mới Tag',
                        description: 'Thêm mới Tag thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Thêm mới Tag',
                        description: 'Thêm mới Tag thất bại.',
                    });
                    
                }
            });
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };
    const handleUpdateTag = async (e) => {
        try {
            const data = {
                _id: selectedRows[0]._id,
                tagName,
                updatedTime: Date.now()
            };        
            console.log(data);
            dispatch(updateTag(data)).then((data) => {
                dispatch(getDataFilterTag()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setTagInPage(data);
                    setLoading(false);
                });
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Cập nhập Tag',
                        description: 'Cập nhập Tag thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Cập nhập Tag',
                        description: 'Cập nhập Tag thất bại.',
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
            title = 'Chỉnh sửa Tag';
            disable = false;
            Setonclick = handleUpdateTag;
        } else if (type === 'view') {
            title = 'Xem chi tiết Tag';
            disable = true;
        } else if (type === 'create') {
            title = 'Tạo mới Tag';
            disable = false;
            Setonclick = handleAddTag;
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
                                className="container_infoTag"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_infoTag"
                                    style={{
                                        paddingBottom: '20px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Tên Tag"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={tagName}
                                        disabled={disable}
                                        onChange={(e) => setTagName(e.target.value)}
                                    />
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Tag</InputLabel>
                                        <SelectMui
                                            disabled={disable}
                                            value={parentId ? parentId: null}
                                            label="Tag"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            onChange={(e) => setParentId(e.target.value)}
                                        >
                                            {tag.tags.map((option) => (
                                                <MenuItem value={option._id}>{option.tagName}</MenuItem>
                                            ))}
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
                                        <Form.Item>Tên Tag</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeTagName}
                                            >
                                                {tagInPage.map((item) => (
                                                    <Option key={item.tagName} data={item.tagName} text={item.tagName}>
                                                        <div className="global-search-item">
                                                            <span>{item.tagName}</span>
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
                {modalUser(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={tagInPage.length !== 0 ? tagInPage : []}
                            columns={tagInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = tagInPage.filter((row) => selectedIDs.has(row._id));
                                if (selectedRows.length === 1) {
                                    setTagName(selectedRows[0].tagName);
                                    setParentId(selectedRows[0].parentId);
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

export default TagPage;
