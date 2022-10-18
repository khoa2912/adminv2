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
import 'antd/dist/antd.css';
import { PlusOutlined } from '@ant-design/icons';
import {
    Box,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from '../../../../node_modules/@mui/material/index';
import { Tabs } from 'antd';

import formatThousand from 'util/formatThousans';
import { Upload } from '../../../../node_modules/antd/lib/index';
import { getAllCategory, addCategory, getDataFilter } from 'actions/category';
import { useHistory } from 'react-router-dom';
import {useNavigate} from "react-router-dom"

export const AddCategory = (props) => {
    // eslint-disable-next-line
    const { TabPane } = Tabs;
    const product = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [file, setFile] = useState([]);
    const [loading, setLoading] = useState(false);
    const category = useSelector((state) => state.category);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [filebase64, setFileBase64] = useState([]);
    const handleCancel = () => setPreviewVisible(false);
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    // const handlePreview = async (file) => {
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }

    //     setPreviewImage(file.url || file.preview);
    //     setPreviewVisible(true);
    //     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    // };
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        }
    );
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
        dispatch(getAllCategory());
    }, []);
    const navigate = useNavigate();
    // useEffect(() => {
    //     if (category.addCategory != null) {
    //         navigate('/categoryPage');
    //     }
    // }, [category.loading]);

    const createCategoryList = (categories, options = []) => {
        for (let category of categories) {
            options.push({ value: category._id, name: category.name });
            if (category.children.length > 0) {
                createCategoryList(category.children, options);
            }
        }
        return options;
    };
    const uploadPicture = async () => {
        if (name.trim() === '') {
            notification['warning']({
                message: 'Thêm mới nhãn hàng',
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
                        name,
                        categoryImage: responseJson.result[0]
                    };
                    dispatch(addCategory(data)).then((data) => {
                        dispatch(getDataFilter()).then((data) => {
                            data.map((item, index) => (item.id = index + 1));
                            setLoading(false);
                        });
                        if (data === 'success') {
                            notification['success']({
                                message: 'Thêm mới Nhãn hàng',
                                description: 'Thêm mới Nhãn hàng thành công.'
                            });
                            navigate('/category');
                        } else {
                            notification['error'] ({
                                message: 'Thêm mới Nhãn hàng',
                                description: 'Thêm mới Nhãn hàng thất bại.',
                            });
                            
                        }
                    });
                });
        } catch (err) {
            throw new Error('Something went wrong');
        }
    };
    return (
        <ComponentSkeleton>
            <Box sx={{ width: '100%' }}>
                <Tabs defaultActiveKey="1" style={{ color: 'black', fontSize: '19px' }}>
                    <TabPane tab={<span>Thông tin chung</span>} key="1">
                        <div
                            className="container_addCategory"
                            style={{
                                display: 'flex',
                                paddingTop: '0px',
                                color: 'black',
                                fontSize: '17px'
                            }}
                        >
                            <div
                                className="container_form_addCategory"
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
                                    label="Tên Nhãn hàng"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
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
                                {/* {productPicture.length > 0 ? productPicture.map((pic, index) => <div key={index}>{pic.name}</div>) : null}
                                <input type="file" name="productPicture" onChange={handleProductPictures} /> */}
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </Box>
            <Button variant="contained" color="success" onClick={uploadPicture} style={{ marginBottom: '50px' }}>
                Thêm nhãn hàng
            </Button>
        </ComponentSkeleton>
    );
};
