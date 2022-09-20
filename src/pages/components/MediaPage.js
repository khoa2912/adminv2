import PropTypes from 'prop-types';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ComponentSkeleton from './ComponentSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { notification } from 'antd';
import { getCustomerOrders } from 'actions/order';
// ===============================|| SHADOW BOX ||=============================== //

function ShadowBox({ shadow }) {
    return (
        <MainCard border={false} sx={{ boxShadow: shadow }}>
            <Stack spacing={1} justifyContent="center" alignItems="center">
                <Typography variant="h6">boxShadow</Typography>
                <Typography variant="subtitle1">{shadow}</Typography>
            </Stack>
        </MainCard>
    );
}

ShadowBox.propTypes = {
    shadow: PropTypes.string.isRequired
};

// ===============================|| CUSTOM - SHADOW BOX ||=============================== //

function CustomShadowBox({ shadow, label, color, bgcolor }) {
    return (
        <MainCard border={false} sx={{ bgcolor: bgcolor || 'inherit', boxShadow: shadow }}>
            <Stack spacing={1} justifyContent="center" alignItems="center">
                <Typography variant="subtitle1" color={color}>
                    {label}
                </Typography>
            </Stack>
        </MainCard>
    );
}

CustomShadowBox.propTypes = {
    shadow: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    bgcolor: PropTypes.string.isRequired
};

// ============================|| COMPONENT - SHADOW ||============================ //

const MediaPage = () => {
    const dispatch = useDispatch();
    const [selectedRows, setSelectedRows] = useState([]);
    const order = useSelector((state) => state.order);
    useEffect(() => {
        dispatch(getCustomerOrders());
    }, [dispatch]);
    useEffect(() => {
        if (order.error) {
            notification['error']({
                message: 'Đơn hàng',
                description: 'Vui lòng đăng nhập.'
            });
        }
    }, [order.error]);

    const columns = [
        { field: 'id', headerName: 'Mã sản phẩm', width: 100 },
        { field: 'name', headerName: 'Tên sản phẩm', width: 300 },
        { field: 'category.name', headerName: 'Hãng', width: 130 },
        { field: 'salePrice', headerName: 'Giá tiền', width: 130 },
        {
            field: 'quantity',
            headerName: 'Số lượng',
            type: 'number',
            width: 90
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
        }
    };
    return (
        <ComponentSkeleton>
            <Grid container spacing={3}>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <DataGrid
                        rows={[]}
                        columns={columns}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        checkboxSelection
                        // onSelectionModelChange={(ids) => {
                        //     const selectedIDs = new Set(ids);
                        //     const selectedRows = product.products.filter((row) => selectedIDs.has(row.id));

                        //     setSelectedRows(selectedRows);
                        // }}
                        loading={order.loading}
                    />
                </MainCard>
            </Grid>
        </ComponentSkeleton>
    );
};

export default MediaPage;
