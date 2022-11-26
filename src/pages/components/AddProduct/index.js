// eslint-disable-next-line
import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { FormGroup } from 'react-bootstrap';
import Button from '@mui/material/Button';
import './style.css';
import { Form, Modal, Card, notification } from 'antd';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Tab from '@mui/material/Tab';
import { CKEditor } from 'ckeditor4-react';
import ComponentSkeleton from '../ComponentSkeleton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
import {
    Box,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select as SelectMui,
    TextField
} from '../../../../node_modules/@mui/material/index';
import { Tabs } from 'antd';

import formatThousand from 'util/formatThousans';
import { Upload } from '../../../../node_modules/antd/lib/index';
import { getAllCategory } from 'actions/category';
import { getTags } from 'actions/tag';
import { getInfoProducts } from 'actions/infoProduct';
import { addProduct, getProducts, getDataFilterProduct } from 'actions/product';
import { useHistory } from 'react-router-dom';
import {useNavigate} from "react-router-dom"
import infoProduct from 'reducers/infoProduct';

export const AddProduct = (props) => {
    // eslint-disable-next-line
    const { TabPane } = Tabs;
    const product = useSelector((state) => state.product);
    const infoProduct = useSelector((state) => state.infoProduct);
    const [loading, setLoading] = useState(false);
    const [productInPage, setProductInPage] = useState([]);
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [file, setFile] = useState([]);
    const [quantity, setQuantity] = useState('');
    const [regularPrice, setRegularPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [description, setDescription] = useState('');
    const [productPicture, setProductPicture] = useState([]);
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
    const category = useSelector((state) => state.category);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const tag = useSelector((state) => state.tag);
    const [listTag, setListTag] = useState([]);
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
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilterProduct()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
            setLoading(false);
        });
        dispatch(getAllCategory());
        dispatch(getTags());
        dispatch(getInfoProducts());
    }, [dispatch]);
    // useEffect(() => {
    //     dispatch(getAllCategory());
    //     dispatch(getTags());
    // }, []);
    const navigate = useNavigate();
    useEffect(() => {
        if (product.addProduct != null) {
            navigate('/product');
        }
    }, [product.loading]);

    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({ value: category._id, name: category.name });
            if (category.children.length > 0) {
                createCategoryList(category.children, options);
            }
        }
        return options;
    };
    const temp = product.length;
    const uploadPicture = async () => {
        if (name.trim() === '' || regularPrice.trim() === '' || quantity.trim() === '') {
            notification['warning']({
                message: 'Thêm mới Sản phẩm',
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
        const objFilterColor = filterColor?.find(data => data._id === color);
        const objFilterRam = filterRam?.find(data => data._id === ram);
        const objFilterCpu = filterCpu?.find(data => data._id === cpu);
        const objFilterScreen = filterScreen?.find(data => data._id === manhinh);
        console.log(objFilterColor)
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
                        cpuId: objFilterCpu ? objFilterCpu._id : '',
                        nameCpu: objFilterCpu ? objFilterCpu.name : '',
                        typeCpu: objFilterCpu ? objFilterCpu.type : '',
                        colorId: objFilterColor ? objFilterColor._id : '',
                        nameColor: objFilterColor ? objFilterColor.name : '',
                        typeColor: objFilterColor ? objFilterColor.type : '',
                        ramId: objFilterRam ? objFilterRam._id : '',
                        nameRam: objFilterRam ? objFilterRam.name : '',
                        typeRam: objFilterRam ? objFilterRam.type : '',
                        screenId: objFilterScreen ? objFilterScreen._id : '',
                        nameScreen: objFilterScreen ? objFilterScreen.name : '',
                        typeScreen: objFilterScreen ? objFilterScreen.type : '',
                        name,
                        quantity,
                        regularPrice,
                        salePrice,
                        description,
                        categoryId,
                        listTag,
                        productPicture: responseJson.result,
                        timeBaoHanh,
                        series,
                        card,
                        ocung,
                        hedieuhanh,
                        khoiluong
                    };
                    // console.log(data)
                    dispatch(addProduct(data)).then((data) => {
                        console.log(data)
                        if (data === 'success') {
                            notification['success']({
                                message: 'Thêm Sản phẩm',
                                description: 'Thêm Sản phẩm thành công.'
                            });
                        }
                        else {
                            notification['error'] ({
                                message: 'Thêm Sản phẩm',
                                description: 'Thêm Sản phẩm thất bại.',
                            });
                            
                        }
                    });
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
    const handleChangeTag = (e) => {
        const {
          target: { value },
        } = e;
        console.log(e)
        setListTag(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleProductPictures = (e) => {
        setProductPicture([...productPicture, e.target.files[0]]);
    };
    // const handleUploadFile = (value) => {
    //     setProductPicture(...productPicture, value);
    // };
    const handleOnChangeDesciption = (event) => {
        setDescription(event.editor.getData());
    };

    var filterColor = infoProduct.infoProducts.filter((item) => {
        if (item.type === 'mausac')
            return item;
    });
    var filterScreen = infoProduct.infoProducts.filter((item) => {
        if (item.type === 'manhinh')
            return item;
    });
    var filterRam = infoProduct.infoProducts.filter((item) => {
        if (item.type === 'ram')
            return item;
    });
    var filterCpu = infoProduct.infoProducts.filter((item) => {
        if (item.type === 'cpu')
            return item;
    });

    return (
        <ComponentSkeleton>
            <Box sx={{ width: '100%' }}>
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
                                    paddingBottom: '50px',
                                    width: '40%',
                                    paddingRight: '30px'
                                }}
                            >
                                <TextField
                                    required
                                    style={{ width: '100%', marginBottom: '15px' }}
                                    id="outlined-error"
                                    label="Tên sản phẩm"
                                    value={name}
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
                                    value={quantity}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    onChange={(e) => {
                                        setQuantity(e.target.value);
                                    }}
                                />

                                <FormControl fullWidth style={{ width: '100%', marginBottom: '15px' }}>
                                    <InputLabel htmlFor="outlined-adornment-amount">Giá tiền gốc</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        placeholder={formatThousand(regularPrice)}
                                        value={regularPrice}
                                        onChange={(e) => {
                                            setRegularPrice(e.target.value);
                                        }}
                                        startAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                        label="Giá tiền gốc"
                                    />
                                </FormControl>
                                <FormControl fullWidth style={{ width: '100%', marginBottom: '15px' }}>
                                    <InputLabel htmlFor="outlined-adornment-amount">Giá tiền giảm giá</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        value={salePrice}
                                        onChange={(e) => {
                                            setSalePrice(e.target.value);
                                        }}
                                        startAdornment={<InputAdornment position="start">VNĐ</InputAdornment>}
                                        label="Giá tiền giảm giá"
                                    />
                                </FormControl>
                                <FormControl style={{ width: '100%', marginBottom: '15px' }}>
                                    <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                                    <SelectMui
                                        // disabled={disable}
                                        value={listTag}
                                        label="Tag"
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        input={<OutlinedInput label="Tag" />}
                                        // renderValue={(selected) => selected.join(', ')}
                                        MenuProps={MenuProps}
                                        // onChange={(e) => setParentId(e.target.value)}
                                        onChange={handleChangeTag}
                                    >
                                        {tag.tags.map((option) => (
                                            <MenuItem value={option._id}>{option.tagName}</MenuItem>
                                        ))}
                                    </SelectMui>
                                </FormControl>        
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Thương hiệu</InputLabel>
                                    <SelectMui
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={categoryId}
                                        label="Thương hiệu"
                                        onChange={(e) => setCategoryId(e.target.value)}
                                    >
                                        {createCategoryList(category.categories).map((option) => (
                                            <MenuItem value={option.value}>{option.name}</MenuItem>
                                        ))}
                                    </SelectMui>
                                </FormControl>

                                <ul></ul>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                    beforeUpload={() => {
                                        /* update state here */
                                        return false;
                                    }}
                                >
                                    {console.log(fileList)}
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img
                                        alt="example"
                                        style={{
                                            width: '100%'
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
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
                                initData={description}
                                onChange={handleOnChangeDesciption}
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
                                    value={timeBaoHanh}
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
                                    value={series}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    onChange={(e) => {
                                        setSeries(e.target.value);
                                    }}
                                />
                            </div>
                            <div style={{ display: 'block', width: '100%' }}>
                                {/* <TextField
                                    required
                                    id="outlined-number"
                                    label="Màu sắc"
                                    style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={color}
                                    onChange={(e) => {
                                        setColor(e.target.value);
                                    }}
                                /> */}
                                <FormControl style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}>
                                    <InputLabel id="demo-simple-select-label">Màu sắc</InputLabel>
                                    <SelectMui
                                        value={color ? color: null}
                                        label="Màu sắc"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        onChange={(e) => setColor(e.target.value)}
                                    >
                                        {filterColor.map((option) => (
                                            <MenuItem value={option._id}>{option.name}</MenuItem>
                                        ))}
                                    </SelectMui>
                                </FormControl>

                                <FormControl style={{ width: '45%', marginBottom: '15px' }}>
                                    <InputLabel id="demo-simple-select-label" >CPU</InputLabel>
                                    <SelectMui
                                        value={cpu ? cpu: null}
                                        label="CPU"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        onChange={(e) => setCPU(e.target.value)}
                                    >
                                        {filterCpu.map((option) => (
                                            <MenuItem value={option._id}>{option.name}</MenuItem>
                                        ))}
                                    </SelectMui>
                                </FormControl>
{/* 
                                <TextField
                                    required
                                    id="outlined-number"
                                    label="CPU"
                                    style={{ width: '45%', marginBottom: '15px' }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={cpu}
                                    onChange={(e) => {
                                        setCPU(e.target.value);
                                    }}
                                /> */}
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
                                    value={card}
                                    onChange={(e) => {
                                        setCard(e.target.value);
                                    }}
                                />

                                <FormControl style={{ width: '45%', marginBottom: '15px' }}>
                                    <InputLabel id="demo-simple-select-label" >Ram</InputLabel>
                                    <SelectMui
                                        value={ram ? ram: null}
                                        label="Ram"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        onChange={(e) => setRam(e.target.value)}
                                    >
                                        {filterRam.map((option) => (
                                            <MenuItem value={option._id}>{option.name}</MenuItem>
                                        ))}
                                    </SelectMui>
                                </FormControl>
                                {/* <TextField
                                    required
                                    id="outlined-number"
                                    label="Ram"
                                    style={{ width: '45%', marginBottom: '15px' }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={ram}
                                    onChange={(e) => {
                                        setRam(e.target.value);
                                    }}
                                /> */}
                            </div>
                            <div style={{ display: 'block', width: '100%' }}>
                                {/* <TextField
                                    required
                                    id="outlined-number"
                                    label="Màn hình"
                                    style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={manhinh}
                                    onChange={(e) => {
                                        setManHinh(e.target.value);
                                    }}
                                /> */}
                                <FormControl style={{ width: '45%', marginBottom: '15px', marginRight: '20px' }}>
                                    <InputLabel id="demo-simple-select-label" >Màn hình</InputLabel>
                                    <SelectMui
                                        value={manhinh ? manhinh: null}
                                        label="Màn hình"
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        onChange={(e) => setManHinh(e.target.value)}
                                    >
                                        {filterScreen.map((option) => (
                                            <MenuItem value={option._id}>{option.name}</MenuItem>
                                        ))}
                                    </SelectMui>
                                </FormControl>

                                <TextField
                                    required
                                    id="outlined-number"
                                    label="Ổ cứng"
                                    style={{ width: '45%', marginBottom: '15px' }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={ocung}
                                    onChange={(e) => {
                                        setOCung(e.target.value);
                                    }}
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
                                    value={hedieuhanh}
                                    onChange={(e) => {
                                        setHeDieuHanh(e.target.value);
                                    }}
                                />

                                <TextField
                                    required
                                    id="outlined-number"
                                    label="Khối lượng"
                                    style={{ width: '45%', marginBottom: '15px' }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={khoiluong}
                                    onChange={(e) => {
                                        setKhoiLuong(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </Box>
            <Button variant="contained" color="success" onClick={uploadPicture} style={{ marginBottom: '50px' }}>
                Thêm sản phẩm
            </Button>
        </ComponentSkeleton>
    );
};
