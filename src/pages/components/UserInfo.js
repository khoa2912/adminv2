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
    InputAdornment,
    IconButton,
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
import { getUser, getUserUsing, updateUser } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { addTag, getDataFilterTag, deleteTagById, updateTag, getTags } from 'actions/tag';
import { PlusOutlined } from '@ant-design/icons';
import { object } from 'prop-types';
import { Tabs } from 'antd';
import { Calculate } from '../../../node_modules/@mui/icons-material/index';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| Tag Page ||============================ //

const UserInfo = () => {
    const { Option } = Select;
    const dispatch = useDispatch();
    const role = useSelector((state) => state.role);
    const [open, setOpen] = useState(false);
    const [userInfo, setUserInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [roleId, setRoldId] = useState('');
    const [email, setEmail] = useState('');
    const [disableItem, setDisableItem] = useState(false)
    const [disableText, setDisableText] = useState(true)
    const [disableButton, setDisableButton] = useState(true)
    const [hash_password, setHash_password] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [status, setStatus] = useState('enable');
    const [keyOpen, setKeyOpen] = useState('close');
    const [showPassword, SetShowPassword] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewImage, setPreviewImage] = useState('');
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
        dispatch(getUserUsing()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setUserInfo(data);
            setLoading(false);
            setFirstName(data[0]?.firstName);
            setLastName(data[0]?.lastName);
            setHash_password(data[0]?.hash_password);
            setEmail(data[0]?.email);
            setContactNumber(data[0]?.contactNumber)
            setFileList([{url : data[0]?.profilePicture}])
            console.log(data, 'Data')
        });
        console.log('Mess')
    }, [dispatch]);
    const handleClose = () => setOpen(false);
    const ViewUser = (() => {
        setDisableItem(false);
        setDisableButton(true);
        setDisableText(true);
    })
    const EditUser = (() => {
        setDisableItem(true);
        setDisableButton(false);
        setDisableText(false);
    })
    const CancelUser = (() => {
        dispatch(getUserUsing()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setUserInfo(data);
            setFirstName(data[0]?.firstName);
            setLastName(data[0]?.lastName);
            setHash_password(data[0]?.hash_password);
            setEmail(data[0]?.email);
            setContactNumber(data[0]?.contactNumber)
            setFileList([{url : data[0]?.profilePicture}])
            console.log(data, 'Data')
        });
        setDisableItem(false);
        setDisableButton(true);
        setDisableText(true);
    })
    // console.log(userInfo)
    console.log(fileList.length)
    console.log(fileList)
    // eslint-disable-next-line
    const gridStyle = {
        width: '50%',
        height: '80px'
    };
    const style = {
        position: 'relative',
        top: '30%',
        left: '56%',
        transform: 'translate(-70%, -50%)',
        width: '60%',
        // boxShadow: 10,
        zIndex: 50,
        p: 4
    };
    const styleRight = {
        position: 'relative',
        top: '30%',
        left: '50%',
        transform: 'translate(-80%, -50%)',
        width: 800,
        paddingRight: '100px',
        // borderRight: '1px solid rgba(0, 0, 0, 0.09)',
        // boxShadow: 10,
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
    const handleClickShowPassword = () => {
        SetShowPassword(true);
    };
    const handleMouseDownPassword = () => {
        SetShowPassword(false);
    };
    
    const uploadButton = (
        <div >
            <PlusOutlined/>
            <div
                style={{
                    marginTop: 8
                }}
            >
                Upload
            </div>
        </div>
    );
    const handleUpdateUser = async (e) => {
        const list = [];
        if(fileList&&fileList[0]&&fileList[0].type!=null) {
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
                            _id: userInfo[0]?._id,
                            firstName,
                            lastName,
                            hash_password,
                            role: userInfo[0]?.role,
                            contactNumber,
                            status: userInfo[0]?.status,
                            profilePicture: responseJson.result[0]
                        };
                        console.log(data);
                        dispatch(updateUser(data)).then((data) => {
                            dispatch(getUserUsing()).then((data) => {
                                data.map((item, index) => (item.id = index + 1));
                                setUserInfo(data);
                                setLoading(false);
                                setFirstName(data[0]?.firstName);
                                setLastName(data[0]?.lastName);
                                setHash_password(data[0]?.hash_password);
                                setEmail(data[0]?.email);
                                setContactNumber(data[0]?.contactNumber)
                                setFileList([{url : data[0]?.profilePicture}])
                            });
                            setDisableItem(false);
                            setDisableButton(true);
                            setDisableText(true);
                            if (data === 'success') {
                                notification['success']({
                                    message: 'Chỉnh sửa User',
                                    description: 'Chỉnh sửa User thành công.'
                                });
                            } else {
                                notification['error'] ({
                                    message: 'Chỉnh sửa User',
                                    description: 'Chỉnh sửa User thất bại.',
                                });
                                
                            }
                        });
                    });
            } catch (err) {
                throw new Error('Something went wrong');
            }   
        } else {
            const data = {
                _id: userInfo[0]?._id,
                firstName,
                lastName,
                hash_password,
                role: userInfo[0]?.role,
                contactNumber,
                status: userInfo[0]?.status,
                profilePicture: fileList.length!=0?fileList[0].url:null
            };
            console.log(data);
            dispatch(updateUser(data)).then((data) => {
                dispatch(getUserUsing()).then((data) => {
                    data.map((item, index) => (item.id = index + 1));
                    setUserInfo(data);
                    setLoading(false);
                    setFirstName(data[0]?.firstName);
                    setLastName(data[0]?.lastName);
                    setHash_password(data[0]?.hash_password);
                    setEmail(data[0]?.email);
                    setContactNumber(data[0]?.contactNumber)
                    setFileList([{url : data[0]?.profilePicture}])
                });
                setDisableItem(false);
                setDisableButton(true);
                setDisableText(true);
                if (data === 'success') {
                    notification['success']({
                        message: 'Chỉnh sửa User',
                        description: 'Chỉnh sửa User thành công.'
                    });
                } else {
                    notification['error'] ({
                        message: 'Chỉnh sửa User',
                        description: 'Chỉnh sửa User thất bại.',
                    });
                    
                }
            });
        }
          
    };
    return (
        <Grid item style = {{marginTop: '-55px', marginLeft: '30px'}}>
            <div style = {{display: 'flex', width: '75%'}}>
                <div style={{ color: 'black', fontSize: '18px', marginTop: '50px', paddingRight: '60px', borderRight: '1px solid rgba(0, 0, 0, 0.09)'}}>
                    <div
                        className="container_infoUser"
                        style={{
                            display: 'flex',
                            paddingTop: '20px',
                            color: 'black',
                            fontSize: '17px'
                        }}
                    >
                        <div
                            className="container_form_infoUser"
                            style={{
                                paddingBottom: '20px',
                                width: '100%',
                                paddingRight: '30px'
                            }}
                        >
                            <TextField
                                // required
                                style={{ width: '100%', marginBottom: '15px'}}
                                id="outlined-required"
                                label="Họ"
                                disabled = {disableText}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            
                            <TextField
                                id="outlined-required"
                                label="Tên"
                                style={{ width: '100%', marginBottom: '15px'}}
                                value={lastName}
                                disabled = {disableText}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password" disabled = {disableText}>Mật khẩu</InputLabel>
                                <OutlinedInput
                                    id="outlined-required"
                                    type={showPassword ? 'text' : 'password'}
                                    value={hash_password}
                                    disabled = {disableText}
                                    onChange={(e) => setHash_password(e.target.value)}
                                    endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    }
                                    label="hash_password"
                                />
                            </FormControl>
                            <TextField margin = "normal"
                                label="Email"
                                id="outlined-required"
                                disabled = "true"
                                style={{ width: '100%', marginBottom: '15px'}}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="outlined-required"
                                label="Số điện thoại"
                                style={{ width: '100%', marginBottom: '15px' }}
                                value={contactNumber}
                                disabled = {disableText}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div style={{position: 'relative', paddingLeft: '50px' ,color: 'black', fontSize: '18px', marginTop: '60px', width: '44%', marginLeft: 40}}>
                    <div
                        className="container_infoUser2"
                    >
                        <ul></ul>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            // defaultFileList={fileList ? fileList : []}
                            onPreview={handlePreview}
                            beforeUpload={() => {
                                /* update state here */
                                return false;
                            }}
                            disabled={disableText}
                            onChange={handleChange}
                        >
                            {fileList.length > 0 ? null : uploadButton}
                        </Upload>
                    </div>
                </div>
            </div>
            <CardActions sx={{marginLeft: '-5px'}}>
                {/* <Button size="small" variant="outlined" onClick = '' sx={{marginRight: '10px'}} disabled = {disableItem}>
                    Xem
                </Button> */}
                <Button size="small" variant="outlined" onClick = {EditUser} sx={{marginRight: '10px'}} disabled = {disableItem}>
                    Chỉnh sửa
                </Button>
                <Button size="small" variant="outlined" color="success" onClick = {handleUpdateUser}  sx={{marginRight: '10px'}} disabled = {disableButton}>
                    Lưu
                </Button>
                <Button size="small" variant="outlined" color="error" onClick = {CancelUser} sx={{marginRight: '10px'}} disabled = {disableButton}>
                    Hủy
                </Button> 
            </CardActions>
        </Grid>
        
        
    );

    
};

export default UserInfo;
