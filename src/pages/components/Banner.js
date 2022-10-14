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
import { addBanner, getDataFilterBanner, deleteBannerById, updateBanner } from 'actions/banner';
import { PlusOutlined } from '@ant-design/icons';
import { object } from 'prop-types';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| Banner Page ||============================ //

const BannerPage = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        Banner_Code: '',
        BannerName: ''
    });

    const text = 'Bạn có chắc chắn muốn xoá?';
    const [loading, setLoading] = useState(false);
    const [bannerInPage, setBannerInPage] = useState([]);
    const { banners } = useSelector((state) => state.banner);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [codeBanner, setCodeBanner] = useState('');
    const [nameBanner, setNameBanner] = useState('');
    // const [descriptionRole, setDescriptionRole] = useState('');
    const [image, setImage] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState('enable');
    const [open, setOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handleCancel = () => setPreviewVisible(false);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const handlePreview = async (file) => {
        console.log(file);
        setPreviewImage(file.url);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterBanner()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setBannerInPage(data);
            setLoading(false);
        });
    }, [dispatch]);
    const columns = [
        { field: 'id', headerName: 'STT', width: 100 },
        { field: 'codeBanner', headerName: 'Mã Banner', width: 150 },
        {
            headerName: 'Hình ảnh',
            field: 'image',
            renderCell: (params) =>{
                return(
                    <Image
                        preview={false}
                        src={`${params.row.image}`}
                        width={200}
                    />
                )
            },
            width: 300
          },
        { field: 'nameBanner', headerName: 'Tên Banner', width: 150 },
        { field: 'slug', headerName: 'Slug', width: 130 }
    ];
    // eslint-disable-next-line
    const [selectedRows, setSelectedRows] = useState([]);
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem Banner',
                description: 'Vui lòng chọn Banner bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Banner',
                description: 'Vui lòng chỉ chọn một Banner.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        setCodeBanner('');
        setNameBanner('');
        setSlug('');
        handleOpen();
    };
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
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá Banner',
                description: 'Vui lòng chọn Banner bạn muốn xoá.'
            });
        } else {
            let listIdBanner = [];
            selectedRows.map((item) => {
                listIdBanner.push(item._id);
            });
            const payload = {
                bannerId: listIdBanner
            };
            const temp = bannerInPage.length;
            
            dispatch(deleteBannerById(payload)).then((data) => {
                dispatch(getDataFilterBanner()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setBannerInPage(data);
                    setLoading(false);
                    if(temp!=data.length) {
                        notification['success']({
                            message: 'Xoá Banner',
                            description: 'Xoá Banner thành công.'
                        });
                    } 
                    else {
                        notification['error']({
                            message: 'Xoá Banner',
                            description: 'Xoá Banner không thành công.'
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
    const handleChangeBannerName = (value) => {
        searchModel.BannerName = value;
        setSearchModel(searchModel);
    };
    const handleChangeBanenerId = (value) => {
        searchModel.Banner_Code = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        console.log(searchModel);
        dispatch(getDataFilterBanner(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setBannerInPage(data);
            setLoading(false);
        });
    };
    const handleEditUser = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa Banner',
                description: 'Vui lòng chọn Banner bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem Banner',
                description: 'Vui lòng chỉ chọn một Banner.'
            });
        } else {
            setType('edit');
            handleOpen();
        }
    };
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        }
    );

    const uploadPicture = async () => {
        if (codeBanner.trim() === '' || nameBanner.trim() === '') {
            notification['warning']({
                message: 'Thêm mới Banner',
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
                        nameBanner,
                        codeBanner,
                        slug,
                        image: responseJson.result[0]
                    };
                    dispatch(addBanner(data)).then((data) => {
                        dispatch(getDataFilterBanner()).then((data) => {
                            data.map((item, index) => (item.id = index + 1));
                            setBannerInPage(data);
                            setLoading(false);
                        });
                        if (data === 'success') {
                            handleClose();
                            notification['success']({
                                message: 'Thêm mới Banner',
                                description: 'Thêm mới Banner thành công.'
                            });
                            setCodeBanner('');
                            setNameBanner('');
                            setSlug('');
                            setFileList([]);
                        } else {
                            handleClose();
                            notification['error'] ({
                                message: 'Thêm mới Banner',
                                description: 'Thêm mới Banner thất bại.',
                            });
                            
                        }
                    });
                });
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };
    const handleUpdateBanner = async () => {
        console.log(selectedRows[0]);
        console.log(fileList);
        // if (!fileList) return;
        const list = [];
        if(fileList&&fileList[0]&&fileList[0].type!=null)
        {
            
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
                            _id: selectedRows[0]._id,
                            createdBy: selectedRows[0].createdBy,
                            nameBanner,
                            codeBanner,
                            slug,
                            image: responseJson.result[0]
                        };
                        console.log(data);
                        dispatch(updateBanner(data)).then((data) => {
                            console.log('run if')
                            dispatch(getDataFilterBanner()).then((data) => {
                                data.map((item, index) => (item.id = index + 1));
                                setBannerInPage(data);
                                setLoading(false);
                            });
                            console.log(data);
                            if (data === 'success') {
                                handleClose();
                                notification['success']({
                                    message: 'Cập nhập Banenr',
                                    description: 'Cập nhập Banenr thành công.'
                                });
                            } else {
                                handleClose();
                                notification['error'] ({
                                    message: 'Cập nhập Banenr',
                                    description: 'Cập nhập Banenr thất bại.',
                                });
                                
                            }
                        });
                    });
            } catch (err) {
                throw new Error('Something went wrong');
            }
        } 
        else {
            const data = {
                _id: selectedRows[0]._id,
                createdBy: selectedRows[0].createdBy,
                nameBanner,
                codeBanner,
                slug,
                image: fileList.length!=0?fileList[0].url:null
            };
            console.log(data);
            dispatch(updateBanner(data)).then((data) => {
                console.log('run else')
                dispatch(getDataFilterBanner()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setBannerInPage(data);
                    setLoading(false);
                });
                console.log(data);
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Cập nhập Banenr',
                        description: 'Cập nhập Banenr thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Cập nhập Banenr',
                        description: 'Cập nhập Banenr thất bại.',
                    });
                    
                }
            });
        }
        
    };
    const modalUser = (type) => {
        let title;
        let disable;
        let Setonclick;
        if (type === 'edit') {
            title = 'Chỉnh sửa Banner';
            disable = false;
            Setonclick = handleUpdateBanner;
        } else if (type === 'view') {
            title = 'Xem chi tiết Banner';
            disable = true;
        } else if (type === 'create') {
            title = 'Tạo mới Banner';
            disable = false;
            Setonclick = uploadPicture;
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
                                className="container_infoBanner"
                                style={{
                                    display: 'flex',
                                    paddingTop: '0px',
                                    color: 'black',
                                    fontSize: '17px'
                                }}
                            >
                                <div
                                    className="container_form_infoBanner"
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
                                        label="Mã Banner"
                                        value={codeBanner}
                                        disabled={disable}
                                        onChange={(e) => setCodeBanner(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Tên Banner"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={nameBanner}
                                        disabled={disable}
                                        onChange={(e) => setNameBanner(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Slug"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={slug}
                                        disabled={disable}
                                        onChange={(e) => setSlug(e.target.value)}
                                    />
                                    <ul></ul>
                                    <Upload
                                        listType="picture-card"
                                        // fileList={fileList}
                                        defaultFileList={fileList ? fileList : []}
                                        // onPreview={handlePreview}
                                        onChange={handleChange}
                                        beforeUpload={() => {
                                            /* update state here */
                                            return false;
                                        }}
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
                                        <Form.Item>Mã Banner</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeBanenerId}
                                            >
                                                {bannerInPage.map((item) => (
                                                    <Option key={item.codeBanner} data={item._id} text={item.codeBanner}>
                                                        <div className="global-search-item">
                                                            <span>{item.codeBanner}</span>
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
                                        <Form.Item>Tên Banner</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeBannerName}
                                            >
                                                {bannerInPage.map((item) => (
                                                    <Option key={item.nameBanner} data={item._id} text={item.nameBanner}>
                                                        <div className="global-search-item">
                                                            <span>{item.nameBanner}</span>
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
                            rows={bannerInPage.length !== 0 ? bannerInPage : []}
                            columns={bannerInPage.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = bannerInPage.filter((row) => selectedIDs.has(row._id));
                                if (selectedRows.length === 1) {
                                    setCodeBanner(selectedRows[0].codeBanner);
                                    setNameBanner(selectedRows[0].nameBanner);
                                    setSlug(selectedRows[0].slug);
                                    setFileList([{ url: selectedRows[0].image }]);
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

export default BannerPage;
