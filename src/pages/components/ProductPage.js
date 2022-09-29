import PropTypes from 'prop-types';

// material-ui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card as CardANTD, Spin } from 'antd';
import { Col, Collapse, Form, Row, Upload, Select } from '../../../node_modules/antd/lib/index';
import { FormGroup } from 'react-bootstrap';
import { PlusOutlined } from '@ant-design/icons';

import {
    Button,
    CardActions,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    NativeSelect,
    MenuItem,
    Modal,
    OutlinedInput,
    TextField
} from '../../../node_modules/@mui/material/index';
import { CKEditor } from 'ckeditor4-react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Popconfirm } from 'antd';
import { Tabs } from 'antd';
import formatThousand from 'util/formatThousans';
import { deleteProductById, getDataFilter, getProducts } from 'actions/product';
import { getAllCategory } from 'actions/category';
import SearchIcon from '@mui/icons-material/Search';
import { DataArraySharp } from '../../../node_modules/@mui/icons-material/index';

// ===============================|| COLOR BOX ||=============================== //
const { TabPane } = Tabs;
const { Option } = Select;
function ColorBox({ bgcolor, title, data, dark, main }) {
    return (
        <>
            <Card sx={{ '&.MuiPaper-root': { borderRadius: '0px' } }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 2.5,
                        bgcolor,
                        color: dark ? 'grey.800' : '#ffffff',
                        border: main ? '1px dashed' : '1px solid transparent'
                    }}
                >
                    {title && (
                        <Grid container justifyContent="space-around" alignItems="center">
                            <Grid item>
                                {data && (
                                    <Stack spacing={0.75} alignItems="center">
                                        <Typography variant="subtitle2">{data.label}</Typography>
                                        <Typography variant="subtitle1">{data.color}</Typography>
                                    </Stack>
                                )}
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                    {title}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Card>
        </>
    );
}

ColorBox.propTypes = {
    bgcolor: PropTypes.string,
    title: PropTypes.string,
    data: PropTypes.object.isRequired,
    dark: PropTypes.bool,
    main: PropTypes.bool
};

// ===============================|| COMPONENT - COLOR ||=============================== //

const ComponentColor = () => {
    const dispatch = useDispatch();
    const [searchModel, setSearchModel] = useState({
        ProductName: '',
        CategoryId: '',
        Price: ''
    });
    const product = useSelector((state) => state.product);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const category = useSelector((state) => state.category);
    const [productPicture, setProductPicture] = useState([]);
    const [productInPage, setProductInPage] = useState([]);
    const [categoryId,setCategoryId]=useState('')
    useEffect(() => {
        setLoading(true);
        dispatch(getProducts()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
            setLoading(false);
        });
        dispatch(getAllCategory());
    }, [dispatch]);
    useEffect(() => {
        if (selectedRows[0]) {
            selectedRows[0] && selectedRows[0].productPicture.map((item) => Object.assign(item, { url: item.img }));
        }

        setProductPicture(selectedRows[0] ? selectedRows[0].productPicture : []);
    }, [selectedRows]);

    const handleEdit = () => {};
    const text = 'Bạn có chắc chắn muốn xoá?';
    const columns = [
        {
            field: '_id',
            headerName: 'Mã sản phẩm',
            width: 230,
            renderCell: (params) => {
                return <div className="rowitem">{params.row._id}</div>;
            }
        },
        { field: 'name', headerName: 'Tên sản phẩm', width: 300 },
        {
            field: 'category',
            headerName: 'Hãng',
            width: 130,
            renderCell: (params) => {
                return <div className="rowitem">{params.value.name}</div>;
            }
        },
        {
            field: 'salePrice',
            headerName: 'Giá tiền',
            width: 130,
            renderCell: (params) => {
                return <div className="rowitem">{formatThousand(params.row.salePrice)} VND</div>;
            }
        },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            type: 'number',
            width: 90,
            renderCell: (params) => {
                return (
                    <div className="rowitem" style={{ textAlign: 'center' }}>
                        {formatThousand(params.row.quantity)}{' '}
                    </div>
                );
            }
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160
            // valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
        }
    ];
    const gridStyle = {
        width: '50%',
        height: '80px'
    };
    // eslint-disable-next-line
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
                message: 'Xem sản phẩm',
                description: 'Vui lòng chọn sản phẩm bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem sản phẩm',
                description: 'Vui lòng chỉ chọn một sản phẩm.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };

    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá sản phẩm',
                description: 'Vui lòng chọn sản phẩm bạn muốn xoá.'
            });
        } else {
            let listIdProduct = [];
            selectedRows.map((item) => {
                listIdProduct.push(item._id);
            });
            const payload = {
                productId: listIdProduct
            };
            dispatch(deleteProductById(payload));
            if (product.deleteMessage === 'success') {
                notification['success']({
                    message: 'Xoá sản phẩm',
                    description: 'Xoá sản phẩm thành công.'
                });
            }
            if (product.deleteMessage === 'error') {
                notification['error']({
                    message: 'Xoá sản phẩm',
                    description: 'Xoá sản phẩm không thành công.'
                });
            }
        }
    };
    const handleEditProduct = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa sản phẩm',
                description: 'Vui lòng chọn sản phẩm bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem sản phẩm',
                description: 'Vui lòng chỉ chọn một sản phẩm.'
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
    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({ value: category._id, name: category.name });
            if (category.children.length > 0) {
                createCategoryList(category.children, options);
            }
        }
        return options;
    };
    const handleChangeCategory = (value) => {
        searchModel.CategoryId = value;
        setSearchModel(searchModel);
    };
    const handleChangePrice = (value) => {
        searchModel.Price = value;
        setSearchModel(searchModel);
    };
    const handleChangeProduct = (value) => {
        searchModel.ProductName = value;
        setSearchModel(searchModel);
    };

    // Filter in Product
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
   
    // Filter Name
    var filterArrayName = removeDuplicates(product.products, "name");
    console.log(filterArrayName);

    // Filter Price
    var filterArrayPrice = removeDuplicates(product.products, "salePrice");
    console.log(filterArrayPrice);

    const handleSearch = () => {
        setLoading(true);
        console.log(searchModel);
        dispatch(getDataFilter(searchModel)).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
            setLoading(false);
        });
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
    const modalProduct = (type) => {
        let title;
        let disable;
        if (type === 'edit') {
            title = 'Chỉnh sửa sản phẩm';
            disable = false;
        } else {
            title = 'Xem chi tiết sản phẩm';
            disable = true;
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
                                        paddingBottom: '10px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        id="outlined-error"
                                        label="Tên sản phẩm"
                                        value={selectedRows[0] ? selectedRows[0].name : ''}
                                        disabled={disable}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Số lượng"
                                        type="number"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={selectedRows[0] ? selectedRows[0].quantity : ''}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        disabled={disable}
                                    />

                                    <FormControl fullWidth style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Giá tiền gốc</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            placeholder={formatThousand(selectedRows[0] ? selectedRows[0].regularPrice : '')}
                                            value={selectedRows[0] ? formatThousand(selectedRows[0].regularPrice) : ''}
                                            startAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                            label="Giá tiền gốc"
                                            disabled={disable}
                                            // InputProps={{
                                            //     inputComponent: NumberFormatCustom
                                            // }}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Giá tiền giảm giá</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            defaultValue={selectedRows[0] ? formatThousand(selectedRows[0].salePrice) : ''}
                                            disabled={disable}
                                            startAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                            label="Giá tiền giảm giá"
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                            Thương hiệu
                                        </InputLabel>
                                        <NativeSelect
                                            disabled={disable}
                                            defaultValue={selectedRows[0] ? selectedRows[0].category._id : ''}
                                            label="Thương hiệu"
                                            inputProps={{
                                            name: 'role',
                                            id: 'uncontrolled-native',
                                            }}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                        >
                                            {createCategoryList(category.categories).map((option) => (
                                                <option value={option.value}>{option.name}</option>
                                            ))}
                                        </NativeSelect>
                                    </FormControl>
                                    <Upload
                                        listType="picture-card"
                                        defaultFileList={productPicture ? productPicture : []}
                                        // onPreview={handlePreview}
                                        // onChange={handleChange}
                                        beforeUpload={() => {
                                            /* update state here */
                                            return false;
                                        }}
                                        disabled={disable}
                                    >
                                        {uploadButton}
                                    </Upload>
                                    {/* <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                            <img
                                alt="example"
                                style={{
                                    width: '100%'
                                }}
                                src={previewImage}
                            />
                        </Modal> */}
                                    {/* {productPicture.length > 0 ? productPicture.map((pic, index) => <div key={index}>{pic.name}</div>) : null}
                    <input type="file" name="productPicture" onChange={handleProductPictures} /> */}
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab={<span>Mô tả sản phẩm</span>} style={{ paddingBottom: '20px' }} key="2">
                            <FormGroup>
                                <CKEditor
                                    config={{
                                        enterMode: 2,
                                        resize_minWidth: '100%',
                                        resize_maxHeight: 600,
                                        //filebrowserBrowseUrl: '/browser/browse.php',
                                        //filebrowserUploadUrl: '/uploader/upload.php',
                                        pasteFromWordRemoveStyles: false,
                                        pasteFromWordNumberedHeadingToList: true,
                                        pasteFromWordPromptCleanup: true
                                    }}
                                    initData={selectedRows[0] ? selectedRows[0].description : null}
                                    readOnly={disable}
                                />
                            </FormGroup>
                        </TabPane>
                        <TabPane tab={<span>Mô tả chi tiết</span>} key="3">
                            <div className="table_des" style={{ width: '100%', color: 'black', fontSize: '17px' }}>
                                <div style={{ display: 'block', width: '100%' }}>
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Thời gian bảo hành"
                                        style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].baohanh : null}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        disable={disable}
                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Series"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].Series : null}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        disable={disable}
                                    />
                                </div>
                                <div style={{ display: 'block', width: '100%' }}>
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Màu sắc"
                                        style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].color : null}
                                        disable={disable}
                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="CPU"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].cpu : null}
                                        disable={disable}
                                    />
                                </div>
                                <div style={{ display: 'block', width: '100%' }}>
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Card đồ họa"
                                        style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].cardDohoa : null}
                                        disable={disable}
                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Ram"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].ram : null}
                                        disable={disable}
                                    />
                                </div>
                                <div style={{ display: 'block', width: '100%' }}>
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Màn hình"
                                        style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].manhinh : null}
                                        disable={disable}
                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Ổ cứng"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].ocung : null}
                                        disable={disable}
                                    />
                                </div>
                                <div style={{ display: 'block', width: '100%' }}>
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Hệ điều hành"
                                        style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0].hedieuhanh : null}
                                        disable={disable}
                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Khối lượng"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        vdefaultValuealue={selectedRows[0] ? selectedRows[0].descriptionTable[0].khoiluong : null}
                                        disable={disable}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{ paddingLeft: '0' }}>
                        <Button size="small" variant="contained" color="success" onClick={handleEdit}>
                            Lưu
                        </Button>
                        <Button size="small" variant="contained" onClick={handleClose}>
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
                                        <Form.Item>Mã sản phẩm</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeProduct}
                                            >
                                                {filterArrayName.map((item, index) => (
                                                    <Option key={item._id} data={item._id} text={item._id}>
                                                        <div className="global-search-item">
                                                            <span>{item._id}</span>
                                                            {/* <span style={{ float: 'right' }}> {index} </span> */}
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
                                        <Form.Item>Tên sản phẩm</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeProduct}
                                            >
                                                {filterArrayName.map((item, index) => (
                                                    <Option key={item._id} data={item.name} text={item.name}>
                                                        <div className="global-search-item">
                                                            <span>{item.name}</span>
                                                            {/* <span style={{ float: 'right' }}> {index} </span> */}
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
                                        <Form.Item>Tên nhãn hàng</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeCategory}
                                            >
                                                {category.categories.map((item, index) => (
                                                    <Option key={item._id} data={item._id} text={item.name}>
                                                        <div className="global-search-item">
                                                            <span>{item.name}</span>
                                                            {/* <span style={{ float: 'right' }}> {index} </span> */}
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
                                        <Form.Item>Giá tiền</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeCategory}
                                            >
                                                {filterArrayName.map((item, index) => (
                                                    <Option key={item.salePrice} data={item.salePrice} text={item.salePrice}>
                                                        <div className="global-search-item">
                                                            <span>{item.salePrice}</span>
                                                            {/* <span style={{ float: 'right' }}> {index} </span> */}
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
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />} style={{ cursor: 'pointer' }}>
                    Tìm kiếm
                </Button>
                <Button variant="outlined" href="/createProduct" color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                    Thêm mới
                </Button>
                <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                    Xem
                </Button>
                <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditProduct}>
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
            </Stack>
            {modalProduct(type)}
            {/* <Spin tip="Loading..." spinning={loading}> */}
            <Grid container spacing={3}>
                <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                    <DataGrid
                        rows={productInPage.length !== 0 ? productInPage : []}
                        columns={productInPage.length !== 0 ? columns : []}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        checkboxSelection
                        getRowId={(row) => row._id}
                        // onRowClick={(newSelection) => {
                        //     setArraySelect((arraySelect) => [...arraySelect, newSelection]);
                        //     console.log(arraySelect);
                        // }}
                        onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids);
                            const selectedRows = productInPage.filter((row) => selectedIDs.has(row._id));

                            setSelectedRows(selectedRows);
                        }}
                        loading={loading}
                    />
                </div>
            </Grid>
            {/* </Spin> */}
        </ComponentSkeleton>
    );
};

export default ComponentColor;
