// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

import SimpleCard from 'components/CardMUI/index';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider, Stack, Box } from '../../../node_modules/@mui/material/index';
import ComponentSkeleton from './ComponentSkeleton';
import AddIcon from '@mui/icons-material/Add';
import { notification, Space, Popconfirm, Form, Collapse, Select, Row, Col } from 'antd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card as CardANTD, Spin } from 'antd';
import LinearProgress from '@mui/material/LinearProgress';
import { deleteCategories, getAllCategory, getDataFilter } from 'actions/category';
import SearchIcon from '@mui/icons-material/Search';

const ComponentTypography = () => {
    const gridStyle = {
        width: '50%',
        height: '80px'
    };
    const { Option } = Select;
    const dispatch = useDispatch();
    const text = 'Bạn có chắc chắn muốn xoá?';
    const category = useSelector((state) => state.category);
    const [categoryInPage, setCategoryInPage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [type, setType]=useState('')
    
    const [searchModel, setSearchModel] = useState({
        CategoryName: ''
    });
    useEffect(() => {
        setLoading(true);
        dispatch(getDataFilter()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setCategoryInPage(data);
            setLoading(false);
        });
    }, [dispatch, category]);
    const handleChangeCategory = (value) => {
        searchModel.CategoryId = value;
        setSearchModel(searchModel);
    };
    const handleChangeProduct = (value) => {
        searchModel.CategoryName = value;
        setSearchModel(searchModel);
    };
    const handleSearch = () => {
        setLoading(true);
        dispatch(getDataFilter(searchModel)).then((data) => {
            setCategoryInPage(data);
            setLoading(false);
        });
    };
    // const handleCreate = () => {
    //     setType('create');
    //     setNameCategory('');
    //     setSlug('');
    //     setCategoryImage('');
    //     handleOpen();
    // };
    return (
        <ComponentSkeleton>
            {category.loading === true ? (
                <Box sx={{ width: '100%', marginBottom: '20px' }}>
                    <LinearProgress />
                </Box>
            ) : null}
            <Form style={{ marginBottom: '10px' }}>
                <Collapse defaultActiveKey={['1']} expandIconPosition={'right'} className="mps-search-header-collapse">
                    <Collapse.Panel header={<span className="mps-search-header-panel-title"> Thông tin tìm kiếm</span>} key="1">
                        <CardANTD style={{ border: 'none' }}>
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
                                                onChange={handleChangeProduct}
                                            >
                                                {categoryInPage&&categoryInPage.map((item, index) => (
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
                        </CardANTD>
                    </Collapse.Panel>
                </Collapse>
            </Form>
            <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ marginBottom: '20px' }}>
                <Button variant="outlined" onClick={handleSearch} startIcon={<SearchIcon />} style={{ cursor: 'pointer' }}>
                    Tìm kiếm
                </Button>
                <Button variant="outlined" href="/createCategory" color="success" startIcon={<AddIcon />} style={{ cursor: 'pointer' }}>
                    Thêm mới
                </Button>
            </Stack>
            {/* <Grid container spacing={1}>
                <Grid item xs={12} lg={20}>
                    <Stack spacing={3}>
                        {category.categories && renderCategories(category.categories).map((item) => <SimpleCard item={item} />)}
                    </Stack>
                </Grid>
            </Grid> */}
            <div style={{ display: 'inline-block' }}>
                <Spin tip="Loading..." spinning={loading}>
                    {categoryInPage && categoryInPage.map((item, index) => <SimpleCard item={item} key={index} />)}
                </Spin>
            </div>
        </ComponentSkeleton>
    );
};

export default ComponentTypography;
