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
import { EditorState, convertToRaw } from 'draft-js';
import { PlusOutlined } from '@ant-design/icons';

import {
    Button,
    CardActions,
    Divider,
    FormControl,
    InputAdornment,
    InputLabel,
    Select as SelectMui,
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
import { deleteProductById, getDataFilter, getProducts, getProductWarning, editProduct, getProductRelated } from 'actions/product';
import { getAllCategory } from 'actions/category';
import { getTags } from 'actions/tag';
import SearchIcon from '@mui/icons-material/Search';
import { DataArraySharp, SettingsBackupRestoreSharp } from '../../../node_modules/@mui/icons-material/index';
import tag from 'reducers/tag';

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
        Product_Tag: ''
    });
    const product = useSelector((state) => state.product);
    const tag = useSelector((state) => state.tag);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const category = useSelector((state) => state.category);
    const [productPicture, setProductPicture] = useState([]);
    const [productInPage, setProductInPage] = useState([]);
    const [name, setName] = useState('');
    const [file, setFile] = useState([]);
    const [quantity, setQuantity] = useState('');
    const [regularPrice, setRegularPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [timeBaoHanh, setTimeBaoHanh] = useState('');
    const [series, setSeries] = useState('');
    const [color, setColor] = useState('');
    const [cpu, setCPU] = useState('');
    const [card, setCard] = useState('');
    const [ram, setRam] = useState('');
    const [manhinh, setManHinh] = useState('');
    const [ocung, setOCung] = useState('');
    const [hedieuhanh, setHeDieuHanh] = useState('');
    const [khoiluong, setKhoiLuong] = useState('');
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [filebase64, setFileBase64] = useState([]);
    const handleCancel = () => setPreviewVisible(false);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });
    
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilter()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
            setLoading(false);
        });
        // dispatch(getProductRelated());
        dispatch(getAllCategory());
        dispatch(getTags());
    }, [dispatch]);
    useEffect(() => {
        if (selectedRows[0]) {
            selectedRows[0] && selectedRows[0].productPicture.map((item) => Object.assign(item, { url: item.img }));
        }
        setProductPicture(selectedRows[0] ? selectedRows[0].productPicture : []);
    }, [selectedRows]);

    const handleEdit = () => {};
    const handleUpdateProduct = async () => {
        if (name.trim() === '') {
            notification['warning']({
                message: 'Thêm mới Sản phẩm',
                description: 'Vui lòng nhập dữ liệu.'
            });
            return;
        }
        const list = [];
        console.log(fileList);
        console.log(productPicture);
        
        if(fileList && fileList.length > 0 && fileList[0].type && fileList[0].type  !== null)
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
                            name,
                            quantity,
                            regularPrice,
                            salePrice,
                            description,
                            categoryId: selectedRows[0].category,
                            productPicture: responseJson,
                            timeBaoHanh,
                            series,
                            color,
                            cpu,
                            card,
                            ram,
                            manhinh,
                            ocung,
                            hedieuhanh,
                            khoiluong
                        };
                        console.log('run if')
                        dispatch(editProduct(data)).then((data) => {
                            dispatch(getDataFilter()).then((data) => {
                                data.map((item, index) => (item.id = index + 1));
                                setProductInPage(data);
                                setLoading(false);
                            });
                            if (data === 'success') {
                                notification['success']({
                                    message: 'Chỉnh sửa Sản phẩm',
                                    description: 'Chỉnh sửa Sản phẩm thành công.'
                                });
                            } else {
                                notification['error'] ({
                                    message: 'Chỉnh sửa Sản phẩm',
                                    description: 'Chỉnh sửa Sản phẩm thất bại.',
                                });
                                
                            }
                        });
                    });
            } catch (err) {
                throw new Error('Something went wrong');
            }
        }
        else {
            console.log(fileList)
            const data = {
                _id: selectedRows[0]._id,
                name,
                quantity,
                regularPrice,
                salePrice,
                description,
                categoryId: selectedRows[0].category,
                productPicture: fileList.length!=0&&fileList[0].url.length!=0?fileList[0].url:[],
                timeBaoHanh,
                series,
                color,
                cpu,
                card,
                ram,
                manhinh,
                ocung,
                hedieuhanh,
                khoiluong
            };
            console.log(data);
            dispatch(editProduct(data)).then((data) => {
                console.log('run else')
                dispatch(getDataFilter()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setProductInPage(data);
                    setLoading(false);
                });
                console.log(data);
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Chỉnh sửa Sản phẩm',
                        description: 'Chỉnh sửa Sản phẩm thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Chỉnh sửa Sản phẩm',
                        description: 'Chỉnh sửa Sản phẩm thất bại.',
                    });
                    
                }
            });
        } 
    };
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
            dispatch(deleteProductById(payload)).then((data) => {
                dispatch(getDataFilter()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setProductInPage(data);
                    if(data === 'success') {
                        notification['success']({
                            message: 'Xoá Sản phẩm',
                            description: 'Xoá Sản phẩm thành công.'
                        });
                    } 
                    else {
                        notification['error']({
                            message: 'Xoá Sản phẩm',
                            description: 'Xoá Sản phẩm không thành công.'
                        });
                    }
                });
            });
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
    const handleChangeTag = (value) => {
        searchModel.Product_Tag = value;
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
    // console.log(filterArrayName);

    // Filter Price
    var filterArrayPrice = removeDuplicates(product.products, "salePrice");
    // console.log(filterArrayPrice);

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
        } 
        if (type === 'view') {
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
                                        defaultValue={name ? name : ''}
                                        disabled={disable}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                        }}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Số lượng"
                                        type="number"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        defaultValue={quantity ? quantity : ''}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        disabled={disable}
                                        onChange={(e) => {
                                            setQuantity(e.target.value);
                                        }}
                                    />

                                    <FormControl fullWidth style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel htmlFor="outlined-adornment-amount" disabled = {disable}>Giá tiền gốc</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            placeholder={formatThousand(regularPrice ? regularPrice : '')}
                                            defaultValue={regularPrice ? regularPrice : null}
                                            startAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                            label="Giá tiền gốc"
                                            disabled={disable}
                                            onChange={(e) => {
                                                setRegularPrice(e.target.value);
                                            }}
                                            // InputProps={{
                                            //     inputComponent: NumberFormatCustom
                                            // }}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel htmlFor="outlined-adornment-amount" disabled = {disable}>Giá tiền giảm giá</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            defaultValue={salePrice ? salePrice : null}
                                            disabled={disable}
                                            startAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                            label="Giá tiền giảm giá"
                                            onChange={(e) => {
                                                setSalePrice(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                        <InputLabel id="demo-simple-select-label" disabled = {disable}>Thương hiệu</InputLabel>
                                        <SelectMui
                                            disabled={disable}
                                            defaultValue={selectedRows[0] ? selectedRows[0].category._id : ''}
                                            label="Thương hiệu"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            onChange={(e) => setCategoryId(e.target.value)}
                                        >
                                            {createCategoryList(category.categories).map((option) => (
                                                <option value={option.value}>{option.name}</option>
                                            ))}
                                        </SelectMui>
                                    </FormControl>
                                    <Upload
                                        listType="picture-card"
                                        defaultFileList={productPicture ? productPicture : []}
                                        onPreview={handlePreview}
                                        beforeUpload={() => {
                                            /* update state here */
                                            return false;
                                        }}
                                        disabled={disable}
                                        onChange={handleChange}
                                    >
                                        {uploadButton}
                                    </Upload>
                                    
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
                                    initData={description ? description : null}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
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
                                        disabled={disable}
                                        style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                        value={timeBaoHanh ? timeBaoHanh: null}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        onChange={(e) => {
                                            setTimeBaoHanh(e.target.value);
                                        }}
                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Series"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        defaultValue={series ? series : null}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        onChange={(e) => {
                                            setSeries(e.target.value);
                                        }}
                                        disabled={disable}                                    />
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
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0]?.color[0]?.name : null}
                                        onChange={(e) => {
                                            setColor(e.target.value);
                                        }}
                                        disabled={disable}                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="CPU"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0]?.cpu[0]?.name : null}
                                        onChange={(e) => {
                                            setCPU(e.target.value);
                                        }}
                                        disabled={disable}                                    />
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
                                        defaultValue={card ? card : null}
                                        onChange={(e) => {
                                            setCard(e.target.value);
                                        }}
                                        disabled={disable}                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Ram"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0]?.ram[0]?.name : null}
                                        onChange={(e) => {
                                            setRam(e.target.value);
                                        }}
                                        disabled={disable}                                    />
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
                                        defaultValue={selectedRows[0] ? selectedRows[0].descriptionTable[0]?.manhinh[0]?.name : null}
                                        onChange={(e) => {
                                            setManHinh(e.target.value);
                                        }}
                                        disabled={disable}                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Ổ cứng"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        defaultValue={ocung ? ocung : null}
                                        onChange={(e) => {
                                            setOCung(e.target.value);
                                        }}
                                        disabled={disable}                                    />
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
                                        value={hedieuhanh ? hedieuhanh : null}
                                        onChange={(e) => {
                                            setHeDieuHanh(e.target.value);
                                        }}
                                        disabled={disable}                                    />

                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Khối lượng"
                                        style={{ width: '45%', marginBottom: '15px' }}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        value={khoiluong ? khoiluong : null}
                                        onChange={(e) => {
                                            setKhoiLuong(e.target.value);
                                        }}
                                        disabled={disable}                                    />
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{ paddingLeft: '0' }}>
                        <Button size="small" variant="outlined" color="success" onClick={handleUpdateProduct} disabled = {disable}>
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
                                        <Form.Item>Tag</Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Select
                                                mode="multiple"
                                                optionFilterProp="data"
                                                optionLabelProp="text"
                                                onChange={handleChangeTag}
                                            >
                                                {tag.tags.map((item, index) => (
                                                    <Option key={item._id} data={item._id} text={item.tagName}>
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
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />} style={{ cursor: 'pointer' }}>
                    Tìm kiếm
                </Button>
                <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                    Xem
                </Button>
                <Button variant="outlined" href="/createProduct" color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
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
                <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditProduct}>
                    Chỉnh sửa
                </Button>
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
                            if (selectedRows.length === 1) {
                                setName(selectedRows[0].name);
                                setRegularPrice(selectedRows[0].regularPrice);
                                setSalePrice(selectedRows[0].salePrice);
                                setQuantity(selectedRows[0].quantity);
                                setCategoryId(selectedRows[0].category);
                                setFileList([{ url: selectedRows[0].productPicture }]);
                                setDescription(selectedRows[0].description);
                                setTimeBaoHanh(selectedRows[0].descriptionTable[0].baohanh);
                                setSeries(selectedRows[0].descriptionTable[0].Series);
                                setColor(selectedRows[0].descriptionTable[0].color);
                                setCPU(selectedRows[0].descriptionTable[0].cpu);
                                setCard(selectedRows[0].descriptionTable[0].cardDohoa);
                                setRam(selectedRows[0].descriptionTable[0].ram);
                                setManHinh(selectedRows[0].descriptionTable[0].manhinh);
                                setOCung(selectedRows[0].descriptionTable[0].ocung);
                                setHeDieuHanh(selectedRows[0].descriptionTable[0].hedieuhanh);
                                setKhoiLuong(selectedRows[0].descriptionTable[0].khoiluong);
                            }
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
