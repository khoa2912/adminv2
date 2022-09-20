import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
// import { generatePublicUrl } from 'urlConfig';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, Modal, TextField } from '../../../node_modules/@mui/material/index';
import { Tabs } from 'antd';
import { Popconfirm, Upload } from '../../../node_modules/antd/lib/index';
import { PlusOutlined } from '@ant-design/icons';
import { deleteCategories } from 'actions/category';
import DeleteIcon from '@mui/icons-material/Delete';
// import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
/* eslint-disable */
const SimpleCard = (props) => {
    const { TabPane } = Tabs;
    const { card, image, name, value } = props.item;
    console.log('props.item;', props.item);
    const category = useSelector((state) => state.category);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleView = () => {
        setType('view');
        handleOpen();
    };
    const confirm = () => {
        dispatch(deleteCategories(value));
        if (category.message === 'deletesuccess') {
            notification['success']({
                message: 'Xoá nhãn hàng',
                description: 'Xoá nhãn hàng thành công.'
            });
        }
        if (category.deleteMessage === 'deleteerror') {
            notification['error']({
                message: 'Xoá nhãn hàng',
                description: 'Xoá nhãn hàng không thành công.'
            });
        }
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
    const text = 'Bạn có chắc chắn muốn xoá?';
    const modalProduct = (type) => {
        let title;
        let disable;
        if (type === 'edit') {
            title = 'Chỉnh sửa nhãn hàng';
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
                                        value={name ? name : ''}
                                        disabled={disable}
                                    />

                                    <ul></ul>
                                    <Upload
                                        listType="picture-card"
                                        fileList={
                                            image
                                                ? [{ url: image }]
                                                : [{ url: 'https://theme.hstatic.net/1000026716/1000440777/14/solid1.jpg?v=27314' }]
                                        }
                                        // onPreview={handlePreview}
                                        // onChange={handleChange}
                                        // beforeUpload={() => {
                                        //     /* update state here */
                                        //     return false;
                                        // }}
                                        disabled={disable}
                                    >
                                        {type === 'view' ? null : uploadButton}
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
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{}}>
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
