import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Badge,
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Paper,
    Popper,
    Typography,
    useMediaQuery
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import {getProductWarning} from '../../../../actions/product'
import Transitions from 'components/@extended/Transitions';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
// assets
import { BellOutlined, CloseOutlined, GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

// sx styles
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

const actionSX = {
    mt: '6px',
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',

    transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Notification = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [productWarning,setProductWarning]=useState([])
    useEffect(() => {
        dispatch(getProductWarning()).then((data)=>{
            setProductWarning(data);
            console.log('Productwarning error', data);
        });
    },[])
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const iconBackColorOpen = 'grey.300';
    const iconBackColor = 'grey.100';

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            <IconButton
                disableRipple
                color="secondary"
                sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
                aria-label="open profile"
                ref={anchorRef}
                aria-controls={open ? 'profile-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Badge badgeContent={productWarning.length} color="primary">
                    <BellOutlined />
                </Badge>
            </IconButton>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? -5 : 0, 9]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions type="fade" in={open} {...TransitionProps}>
                        <Paper
                            sx={{
                                boxShadow: theme.customShadows.z1,
                                width: '100%',
                                minWidth: 285,
                                maxWidth: 420,
                                [theme.breakpoints.down('md')]: {
                                    maxWidth: 285
                                }
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard
                                    title="Thông báo"
                                    elevation={0}
                                    border={false}
                                    content={false}
                                    secondary={
                                        <IconButton size="small" onClick={handleToggle}>
                                            <CloseOutlined />
                                        </IconButton>
                                    }
                                >
                                    <List
                                        component="nav"
                                        sx={{
                                            p: 0,
                                            '& .MuiListItemButton-root': {
                                                py: 0.5,
                                                '& .MuiAvatar-root': avatarSX,
                                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                                            },
                                            overflow: 'auto',
                                            maxHeight: 400,
                                        }}
                                    >
                                       
                                        {productWarning.map(item=>(
                                            <>
                                            
                                                <ListItemButton component="a" href="/product" sx={{ maxHeight: 300, overflow: 'auto' }}>
                                                    <ListItemAvatar>
                                                        <PriorityHighRoundedIcon 
                                                            sx={{
                                                                color: 'warning.main',
                                                                bgcolor: 'warning.lighter',
                                                                fontSize: 26,
                                                            }}
                                                        />
                                                        {/* <Avatar
                                                            
                                                        >
                                                            <SettingOutlined />
                                                        </Avatar> */}
                                                    </ListItemAvatar>
                                                    <ListItemText sx={{ width:'90%' }}
                                                        primary={
                                                            <Typography variant="h6">
                                                                <Typography component="span" variant="subtitle1" align="left" sx={{fontSize: 15}}>
                                                                    Sản phẩm còn số lượng ít trong kho &nbsp;
                                                                </Typography>{' '}
                                                                {/* Sản phẩm còn số lượng ít trong kho &nbsp; */}
                                                                <Typography variant="h1"  align="left" noWrap="true" sx={{fontSize: 14, lineHeight:1.5, fontWeight: 'regular'}}>
                                                                    {item.name}
                                                                </Typography>
                                                                <Typography variant="h1" align="left" sx={{fontSize: 12, lineHeight:1.5, fontWeight: 'regular'}}>
                                                                     {'Số lượng còn lại:   '} {item.quantity - item.quantitySold}
                                                                </Typography>
                                                            </Typography>
                                                        }
                                                        secondary="7 hours ago"
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Typography variant="caption" noWrap>
                                                            2:45 PM
                                                        </Typography>
                                                    </ListItemSecondaryAction>
                                                </ListItemButton>
                                                <Divider/>
                                            </>
                                        ))}
                                       
                                        <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="h6" color="primary">
                                                        View All
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </List>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </Box>
    );
};

export default Notification;
