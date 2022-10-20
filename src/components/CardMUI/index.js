import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
// import { generatePublicUrl } from 'urlConfig';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Box, Modal, TextField } from '../../../node_modules/@mui/material/index';
import { Tabs } from 'antd';
import { notification, Image, Space } from 'antd';
import { Popconfirm, Upload } from '../../../node_modules/antd/lib/index';
import { useDispatch} from 'react-redux';
import { PlusOutlined } from '@ant-design/icons';
import { deleteCategories, updateCategories, getAllCategory, getDataFilter } from 'actions/category';
import DeleteIcon from '@mui/icons-material/Delete';
// import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
/* eslint-disable */
const SimpleCard = (props) => {
    const { TabPane } = Tabs;
    const { card, image, name, value } = props.item;
    // console.log('props.item;', props.item);
    const category = useSelector((state) => state.category);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const [nameCategory, setNameCategory] = useState('');
    const [slug, setSlug] = useState('');
    const [ids, SetIds] = useState('');
    const [fileList, setFileList] = useState([]);
    const [categoryInPage, setCategoryInPage] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCancel = () => setPreviewVisible(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const handlePreview = async (file) => {
        console.log(file);
        setPreviewImage(file.url);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleView = () => {
        setType('view');
        handleOpen();
    };
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilter()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setCategoryInPage(data);
            setLoading(false);
        });
    }, [dispatch]);
    const confirm = () => {
        console.log(props.item);
        var idTemp = props.item._id;
        const data = {
            ids: idTemp,
        }
        console.log(data)
        const tempLenght = category.length;
        console.log(tempLenght)
        dispatch(deleteCategories(data)).then((data) => {
            setLoading(true);
            dispatch(getDataFilter()).then((data) => {
                data.map((item, index) => (item.id = index + 1));
                setCategoryInPage(data);
                setLoading(false);
            });
        });
        
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4
    };
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
    const handleEdit = () => {
        setType('edit');
        handleOpen();
    };
    const handleUpdateCategory = async () => {
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
                            _id: props.item._id,
                            nameCategory,
                            categoryImage: responseJson.result[0]
                        };
                        console.log(data);
                        dispatch(updateCategories(data)).then((data) => {
                            console.log('run if')
                            dispatch(getDataFilter()).then((data) => {
                                data.map((item, index) => (item.id = index + 1));
                                setCategoryInPage(data);
                                setLoading(false);
                            });
                            console.log(data);
                            if (data === 'success') {
                                handleClose();
                                notification['success']({
                                    message: 'Cập nhập Nhãn hàng',
                                    description: 'Cập nhập Nhãn hàng thành công.'
                                });
                            } else {
                                handleClose();
                                notification['error'] ({
                                    message: 'Cập nhập Nhãn hàng',
                                    description: 'Cập nhập Nhãn hàng thất bại.',
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
                _id: props.item._id,
                nameCategory,
                categoryImage: fileList.length!=0?fileList[0].url:null
            };
            console.log(data);
            dispatch(updateCategories(data)).then((data) => {
                console.log('run else')
                dispatch(getDataFilter()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setCategoryInPage(data);
                    setLoading(false);
                });
                console.log(data);
                if (data === 'success') {
                    handleClose();
                    notification['success']({
                        message: 'Cập nhập Nhãn hàng',
                        description: 'Cập nhập Nhãn hàng thành công.'
                    });
                } else {
                    handleClose();
                    notification['error'] ({
                        message: 'Cập nhập Nhãn hàng',
                        description: 'Cập nhập Nhãn hàng thất bại.',
                    });
                    
                }
            });
        }
        
    };
    const text = 'Bạn có chắc chắn muốn xoá?';
    const modalProduct = (type) => {
        let title;
        let disable;
        if (type === 'edit') {
            title = 'Chỉnh sửa nhãn hàng';
            disable = false;
        }
        else if (type === 'create') {
            title = 'Thêm nhãn hàng';
            disable = false;
        } else {
            title = 'Xem chi tiết nhãn hàng';
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
                                        paddingBottom: '50px',
                                        width: '40%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        id="outlined-error"
                                        label="Tên nhãn hàng"
                                        defaultValue={props?.item ? props?.item.name : ''}
                                        disabled={disable}
                                        onChange={(e) => setNameCategory(e.target.value)}
                                    />
                                    <ul></ul>
                                    <Upload
                                        listType="picture-card"
                                        defaultValue={fileList !== '' ? fileList : [{url: ''}]}
                                        onChange={handleChange}
                                        onPreview={handlePreview}
                                        // onChange={handleChange}
                                        beforeUpload={() => {
                                            /* update state here */
                                            return false;
                                        }}
                                        disabled={disable}
                                    >
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
                                    {/* <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
                                        <img
                                            alt="example"
                                            style={{
                                                width: '100%'
                                            }}
                                            src={previewImage}
                                        />
                                    </Modal> */}
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{}}>
                        <Button size="small" variant="contained" color="success" disabled={disable} onClick={handleUpdateCategory}>
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
        <div style={{ display: 'inline-block', marginBottom: '20px', width: '19%', minWidth: '265px' }}>
            {modalProduct(type)}

            <Card className={card} style={{ width: '95%' }}>
                <CardMedia component="img" height="100" image={image} alt="green iguana" style={{ objectFit: 'cover' }} />
                <CardContent>
                    <Typography className={name} color="textPrimary" variant="h4">
                        {name}
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button size="small" variant="contained" onClick={handleEdit}>
                        Chỉnh sửa
                    </Button>
                    <Button size="small" variant="contained" onClick={handleView}>
                        Chi tiết
                    </Button>
                    <Popconfirm placement="right" title={text} onConfirm={confirm} okText="Đồng ý" cancelText="Không">
                        <Button variant="outlined" color="error" style={{ cursor: 'pointer' }} startIcon={<DeleteIcon />} size="small">
                            Xoá
                        </Button>
                    </Popconfirm>
                </CardActions>
            </Card>
        </div>
        /* eslint-enable */
    );
};
// SimpleCard.PropTypes = {
//     item: PropTypes.object.isRequired,
//     card: PropTypes.string,
//     label: PropTypes.string
// };
export default SimpleCard;
