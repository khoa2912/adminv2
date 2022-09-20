// material-ui
import { styled } from '@mui/material/styles';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import MainCard from 'components/MainCard';
import { DataGrid } from '@mui/x-data-grid';
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
    Select,
    MenuItem,
    CardActions
} from '../../../node_modules/@mui/material/index';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { notification, Space, Popconfirm } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from 'actions/auth';
import { getInitialData } from 'actions/initialData';
import { Tabs } from 'antd';
import { addRole, getAllRole } from 'actions/role';
const { TabPane } = Tabs;
// styles
const IFrameWrapper = styled('iframe')(() => ({
    height: 'calc(100vh - 210px)',
    border: 'none'
}));

// ============================|| ANT ICONS ||============================ //

const RolePage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllRole());
    }, []);
    const text = 'Bạn có chắc chắn muốn xoá?';
    const auth = useSelector((state) => state.auth);
    const role = useSelector((state) => state.role);
    const [type, setType] = useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [codeRole, setCodeRole] = useState('');
    const [nameRole, setNameRole] = useState('');
    const [descriptionRole, setDescriptionRole] = useState('');
    const [status, setStatus] = useState('enable');
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (role.roles) {
            role.roles.map((item, index) => (item.id = index + 1));
        }
    }, [role.roles]);
    useEffect(() => {
        if (role.message === 'successcreate') {
            notification['success']({
                message: 'Thêm mới vai trò',
                description: 'Thêm mới vai trò thành công.'
            });
        }
    }, [role.message]);
    const columns = [
        { field: 'id', headerName: 'STT', width: 100 },
        { field: 'codeRole', headerName: 'Mã vai trò', width: 150 },
        { field: 'nameRole', headerName: 'Tên vai trò', width: 150 },
        { field: 'descriptionRole', headerName: 'Mô tả', width: 130 },

        {
            field: 'status',
            headerName: 'Trạng thái',
            type: 'number',
            width: 90,
            renderCell: (params) => {
                return (
                    <div className="rowitem" style={{ textAlign: 'center' }}>
                        {params.row.status === 'enable' ? 'Sử dụng' : 'Ngừng sử dụng'}
                    </div>
                );
            }
        }
    ];
    // eslint-disable-next-line
    const [selectedRows, setSelectedRows] = useState([]);
    const handleView = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chọn vai trò bạn muốn xem.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chỉ chọn một vai trò.'
            });
        } else {
            setType('view');
            handleOpen();
        }
    };
    const handleCreate = () => {
        setType('create');
        setCodeRole('');
        setDescriptionRole('');
        setNameRole('');
        handleOpen();
    };
    const confirm = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Xoá vai trò',
                description: 'Vui lòng chọn vai trò bạn muốn xoá.'
            });
        } else {
            notification['success']({
                message: 'Xoá vai trò',
                description: 'Xoá vai trò thành công.'
            });
        }
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
    const handleEditUser = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Chỉnh sửa vai trò',
                description: 'Vui lòng chọn vai trò bạn muốn chỉnh sửa.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chỉ chọn một vai trò.'
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
    const hanlePermistion = () => {
        if (selectedRows.length === 0) {
            notification['warning']({
                message: 'Phân quyền vai trò',
                description: 'Vui lòng chọn vai trò bạn muốn phân quyền.'
            });
        } else if (selectedRows.length >= 2) {
            notification['warning']({
                message: 'Xem vai trò',
                description: 'Vui lòng chỉ chọn một vai trò.'
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
    const handleAddRole = async (e) => {
        if (codeRole.trim() === '' || nameRole.trim() === '') {
            notification['warning']({
                message: 'Thêm mới vai trò',
                description: 'Vui lòng nhập dữ liệu.'
            });
        } else {
            await dispatch(addRole({ codeRole, nameRole, descriptionRole, status }));
            handleClose();

            if (role.error) {
                notification['error']({
                    message: 'Thêm mới vai trò',
                    description: 'Thêm mới vai trò thất bại.'
                });
            }
        }
    };
    const modalUser = (type) => {
        let title;
        let disable;
        if (type === 'edit') {
            title = 'Chỉnh sửa vai trò';
            disable = false;
        } else if (type === 'view') {
            title = 'Xem chi tiết vai trò';
            disable = true;
        } else {
            title = 'Tạo mới vai trò';
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
                                        paddingBottom: '20px',
                                        width: '100%',
                                        paddingRight: '30px'
                                    }}
                                >
                                    <TextField
                                        required
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        id="outlined-error"
                                        label="Mã vai trò"
                                        value={codeRole}
                                        disabled={disable}
                                        onChange={(e) => setCodeRole(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Tên vai trò"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={nameRole}
                                        disabled={disable}
                                        onChange={(e) => setNameRole(e.target.value)}
                                    />
                                    <TextField
                                        required
                                        id="outlined-number"
                                        label="Mô tả"
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        value={descriptionRole}
                                        disabled={disable}
                                        onChange={(e) => setDescriptionRole(e.target.value)}
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Trạng thái</InputLabel>
                                        <Select
                                            disabled={disable}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            defaultValue={status}
                                            label="Thương hiệu"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <MenuItem value="enable">Sử dụng</MenuItem>
                                            <MenuItem value="disable">Ngừng sử dụng</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                    <CardActions sx={{ padding: '0' }}>
                        <Button size="small" variant="outlined" color="success" onClick={handleAddRole}>
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
            <MainCard>
                <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                    <Button variant="outlined" onClick={handleCreate} color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                        Thêm mới
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleView}>
                        Xem
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={handleEditUser}>
                        Chỉnh sửa
                    </Button>
                    <Button variant="outlined" style={{ cursor: 'pointer' }} onClick={hanlePermistion}>
                        Phân quyền
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
                {modalUser(type)}
                <Grid container spacing={3}>
                    <div style={{ height: 600, width: '100%', marginLeft: '10px' }}>
                        <DataGrid
                            rows={role.roles.length !== 0 ? role.roles : []}
                            columns={role.roles.length !== 0 ? columns : []}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            checkboxSelection
                            getRowId={(row) => row._id}
                            onSelectionModelChange={(ids) => {
                                const selectedIDs = new Set(ids);
                                const selectedRows = role.roles.filter((row) => selectedIDs.has(row._id));
                                console.log(selectedRows);
                                if (selectedRows.length === 1) {
                                    setCodeRole(selectedRows[0].codeRole);
                                    setNameRole(selectedRows[0].nameRole);
                                    setDescriptionRole(selectedRows[0].descriptionRole);
                                    setStatus(selectedRows[0].status);
                                }
                                setSelectedRows(selectedRows);
                            }}
                            loading={auth.loading}
                        />
                    </div>
                </Grid>
            </MainCard>
        </ComponentSkeleton>
    );
};

export default RolePage;
