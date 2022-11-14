import { useState } from 'react';
// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Button,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// project import
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import SalesColumnChart from './SalesColumnChart';
import formatThousand from 'util/formatThousans';
import MainCard from 'components/MainCard';

import moment from 'moment';
import { DatePicker, Space } from 'antd';

import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from 'actions/product';
import { getOrders, getDataOrdersSales } from 'actions/order';
import { getUsers } from 'actions/auth';
import { addTotalView } from 'actions/totalView';
import order from 'reducers/order';
import ProductTable from './OrdersTable';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Hôm nay'
    },
    {
        value: 'month',
        label: 'Tháng này'
    },
    {
        value: 'year',
        label: 'Năm này'
    }
];

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export const DashboardDefault = () => {
    const { RangePicker } = DatePicker;
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');
    const [filterProduct, setFilterProduct] = useState('view');
    const [productInPage, setProductInPage] = useState([]);
    const [orderInPage, setOrderInPage] = useState([]);
    const [userInPage, setUserInPage] = useState([]);
    const [dataSales, setDataSales] = useState([]);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [keyOpen, setKeyOpen] = useState('');
    var totalSales = 0;
    var totalValueProduct = 0;
    var quantityOrder = 0;
    var numberView = 0;
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts()).then(data => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
        });
        dispatch(getOrders()).then(data => {
            data.map((item, index) => (item.id = index + 1));
            setOrderInPage(data);
        });
        dispatch(getUsers()).then(data => {
            data.map((item, index) => (item.id = index + 1));
            setUserInPage(data);
        });
        dispatch(getDataOrdersSales()).then(data => {
            data.map((item, index) => (item.id = index + 1));
            setDataSales(data);
        });
    }, [dispatch, totalSales, quantityOrder]);
    const setDataProduct = () => {
        dispatch(getProducts()).then(data => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
        });
    }
    setInterval(setDataProduct, 86399000)
    var quantityUser = [];
    userInPage.map((item) => {
        if(item.role === '63604156b949802220aa04c9')
            quantityUser.push(item)
    })
    //Tong so view
    
    for(const e of productInPage) {
        numberView += e.view;
    }
    //List order
    var tempOrderInPage = [];
    orderInPage?.map((item) => {
        if(item.orderStatus[3].isCompleted === true)
            tempOrderInPage.push(item);
    })
    
    //Dinh dang lai ngay thang nam
    function parseDate(input) {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }
    const onChange = (dates) => {
        if(dates) {
            dates[0]._d.setHours(0,0,0)
            dates[1]._d.setHours(0,0,0)
            setStartTime(dates[0]._d);
            setEndTime(dates[1]._d);
            setKeyOpen('Open');
        }
        else {
            setKeyOpen('');
        }
        
    };
    //Tong so don hang
    var tempListOrder = [];
    // console.log(startTime)
    if(keyOpen === '') {
        quantityOrder = tempOrderInPage.length;
        for(const e of tempOrderInPage) {
            totalSales += e.totalAmount;
            totalValueProduct +=(e.totalAmount - e.shipAmount);
        }
    } else {
        if(startTime.getTime() !== endTime.getTime()) {
            tempOrderInPage?.map((item) => {
                var date = parseDate(item.orderStatus[3].date);
                date.setHours(0, 0, 1);
                var dateStart = startTime;
                dateStart.setHours(0, 0, 0);
                if(date.getTime() >= dateStart.getTime() && date.getTime() <= endTime.getTime()) {
                    tempListOrder.push(item);
                }
            })
            
            quantityOrder = tempListOrder.length;
            for(const e of tempListOrder) {
                totalSales += e.totalAmount;
                totalValueProduct +=(e.totalAmount - e.shipAmount);
            }
        } else {
            tempOrderInPage?.map((item) => {
                var date = parseDate(item.orderStatus[3].date);
                date.setHours(0, 0, 1);
                var dateStart = startTime;
                dateStart.setHours(0, 0, 0);
                if(date.getTime() <= endTime.getTime() && date.getTime() >= dateStart.getTime()) {
                    tempListOrder.push(item);
                }
            })
            quantityOrder = tempListOrder.length;
            for(const e of tempListOrder) {
                totalSales += e.totalAmount;
                totalValueProduct +=(e.totalAmount - e.shipAmount);
            }
        }
    }
    //Bieu do view
    const data = {
        totalView: numberView
    }
    console.log(numberView)
    setInterval(addTotalView(data),  86400000);
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Trang chủ</Typography>
                    </Grid>
                    {/* date */}
                    <Space direction="vertical" size={12}>
                        <RangePicker
                        ranges={{
                            'Hôm nay': [moment(), moment()],
                            'Tháng này': [moment().startOf('month'), moment().endOf('month')],
                        }}
                        onChange={onChange}
                        />
                    </Space>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Tổng số lượt xem" count={numberView} percentage='' extra='' />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Tổng số người dùng" count={quantityUser.length} percentage='' extra='' />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Tổng số đơn hàng" count={quantityOrder} percentage='' isLoss color="success" extra='' />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Tổng số doanh thu" count={formatThousand(totalSales) + ' Vnđ'} percentage='' isLoss color="success" extra='' />
            </Grid>

            <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
            
            {/* row 2 temp*/}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Biểu đồ lượt xem</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button
                                size="small"
                                onClick={() => setSlot('week')}
                                color={slot === 'week' ? 'primary' : 'secondary'}
                                variant={slot === 'week' ? 'outlined' : 'text'}
                            >
                                Tuần
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setSlot('month')}
                                color={slot === 'month' ? 'primary' : 'secondary'}
                                variant={slot === 'month' ? 'outlined' : 'text'}
                            >
                                Tháng
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
                <MainCard content={false} sx={{ mt: 1.5 }}>
                    <Box sx={{ pt: 1, pr: 2 }}>
                        <IncomeAreaChart slot={slot} />
                    </Box>
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Tổng quan doanh thu</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <Stack spacing={2}>
                            <Typography variant="h6" color="textSecondary">
                                Doanh số
                            </Typography>
                            <Typography variant="h3">{formatThousand(totalValueProduct)} Vnđ</Typography>
                        </Stack>
                    </Box>
                    <MonthlyBarChart startTime={startTime.getTime()} endTime={endTime.getTime()} keyOpen={keyOpen}/>
                </MainCard>
            </Grid>

            {/* row 3 */}
            <Grid item xs={12} md={12} lg={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Sản phẩm nổi bật</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" alignItems="center" spacing={0}>
                            <Button
                                size="small"
                                onClick={() => setFilterProduct('quantity')}
                                color={filterProduct === 'quantity' ? 'primary' : 'secondary'}
                                variant={filterProduct === 'quantity' ? 'outlined' : 'text'}
                            >
                                Số lượng bán
                            </Button>
                            <Button
                                size="small"
                                onClick={() => setFilterProduct('view')}
                                color={filterProduct === 'view' ? 'primary' : 'secondary'}
                                variant={filterProduct === 'view' ? 'outlined' : 'text'}
                            >
                                Lượt xem
                            </Button>
                        </Stack>
                    </Grid>
                    {/* <Grid item /> */}
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <ProductTable item xs={12} md={7} lg={8} filterProduct={filterProduct}/>
                </MainCard>
            </Grid>
            {/* {console.log(filterProduct)} */}
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Phân tích dữ liệu</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
                        <ListItemButton divider>
                            <ListItemText primary="Company Finance Growth" />
                            <Typography variant="h5">+45.14%</Typography>
                        </ListItemButton>
                        <ListItemButton divider>
                            <ListItemText primary="Company Expenses Ratio" />
                            <Typography variant="h5">0.58%</Typography>
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemText primary="Business Risk Cases" />
                            <Typography variant="h5">Low</Typography>
                        </ListItemButton>
                    </List>
                    <ReportAreaChart />
                </MainCard>
            </Grid>

            {/* row 4 */}
            <Grid item xs={12} md={7} lg={8}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Báo cáo doanh thu</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            id="standard-select-currency"
                            size="small"
                            select
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.875rem' } }}
                        >
                            {status.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 1.75 }}>
                    <Stack spacing={1.5} sx={{ mb: -12 }}>
                        <Typography variant="h6" color="secondary">
                            lãi ròng
                        </Typography>
                        <Typography variant="h4">$1560</Typography>
                    </Stack>
                    <SalesColumnChart />
                </MainCard>
            </Grid>
            <Grid item xs={12} md={5} lg={4}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h5">Lịch sử giao dịch</Typography>
                    </Grid>
                    <Grid item />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <List
                        component="nav"
                        sx={{
                            px: 0,
                            py: 0,
                            '& .MuiListItemButton-root': {
                                py: 1.5,
                                '& .MuiAvatar-root': avatarSX,
                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                            }
                        }}
                    >
                        <ListItemButton divider>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        color: 'success.main',
                                        bgcolor: 'success.lighter'
                                    }}
                                >
                                    <GiftOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="subtitle1">Order #002434</Typography>} secondary="Today, 2:00 AM" />
                            <ListItemSecondaryAction>
                                <Stack alignItems="flex-end">
                                    <Typography variant="subtitle1" noWrap>
                                        + $1,430
                                    </Typography>
                                    <Typography variant="h6" color="secondary" noWrap>
                                        78%
                                    </Typography>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <ListItemButton divider>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        color: 'primary.main',
                                        bgcolor: 'primary.lighter'
                                    }}
                                >
                                    <MessageOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography variant="subtitle1">Order #984947</Typography>}
                                secondary="5 August, 1:45 PM"
                            />
                            <ListItemSecondaryAction>
                                <Stack alignItems="flex-end">
                                    <Typography variant="subtitle1" noWrap>
                                        + $302
                                    </Typography>
                                    <Typography variant="h6" color="secondary" noWrap>
                                        8%
                                    </Typography>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        color: 'error.main',
                                        bgcolor: 'error.lighter'
                                    }}
                                >
                                    <SettingOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="subtitle1">Order #988784</Typography>} secondary="7 hours ago" />
                            <ListItemSecondaryAction>
                                <Stack alignItems="flex-end">
                                    <Typography variant="subtitle1" noWrap>
                                        + $682
                                    </Typography>
                                    <Typography variant="h6" color="secondary" noWrap>
                                        16%
                                    </Typography>
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    </List>
                </MainCard>
                <MainCard sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Stack>
                                    <Typography variant="h5" noWrap>
                                        Help & Support Chat
                                    </Typography>
                                    <Typography variant="caption" color="secondary" noWrap>
                                        Typical replay within 5 min
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid item>
                                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                                    <Avatar alt="Remy Sharp" src={avatar1} />
                                    <Avatar alt="Travis Howard" src={avatar2} />
                                    <Avatar alt="Cindy Baker" src={avatar3} />
                                    <Avatar alt="Agnes Walker" src={avatar4} />
                                </AvatarGroup>
                            </Grid>
                        </Grid>
                        <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
                            Need Help?
                        </Button>
                    </Stack>
                </MainCard>
            </Grid>
        </Grid>
    );
};

export default DashboardDefault;
