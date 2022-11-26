import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from 'actions/product';
import { getDataOrdersSales } from 'actions/order';
// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'productId',
        align: 'left',
        disablePadding: false,
        label: 'Mã sản phẩm'
    },
    {
        id: 'productName',
        align: 'left',
        disablePadding: true,
        label: 'Tên sản phẩm'
    },
    {
        id: 'quantity',
        align: 'right',
        disablePadding: false,
        label: 'Số lượng đã bán'
    },
    {
        id: 'view',
        align: 'right',
        disablePadding: false,
        label: 'Số lượt xem'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function ProductTableHead({ product, productBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={productBy === headCell.id ? product : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

ProductTableHead.propTypes = {
    product: PropTypes.string,
    productBy: PropTypes.string
};

// ==============================|| PRODUCT TABLE ||============================== //

const ProductTable = (props) => {
    const {filterProduct} =props
    const [productInPage, setProductInPage] = useState([]);
    const [productBy, setProductBy] = useState('view');
    const [dataSales, setDataSales] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
        });
        dispatch(getDataOrdersSales()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setDataSales(data);
        });
        
    }, [dispatch, filterProduct]);
    function descendingComparator(a, b, productBy) {
        if (b[productBy] < a[productBy]) {
            return -1;
        }
        if (b[productBy] > a[productBy]) {
            return 1;
        }
        return 0;
    }
    function getComparator(product, productBy) {
        return product === 'desc' ? (a, b) => descendingComparator(a, b, productBy) : (a, b) => -descendingComparator(a, b, productBy);
    }
    
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const product = comparator(a[0], b[0]);
            if (product !== 0) {
                return product;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    const [product] = useState('desc');
    const [selected] = useState([]);
    const isSelected = (productId) => selected.indexOf(productId) !== -1;
    // var rows = [];
    var ListSalesTemp = [];
    var ListSales = [];
    dataSales.map((item) => {
        item.items.map((data) => {
            ListSalesTemp.push(data);
        })
    })
    ListSalesTemp.reduce(function(res, value) {
        if (!res[value.productId._id]) {
            res[value.productId._id] = { productId: value.productId, purchasedQty: 0 };
            ListSales.push(res[value.productId._id])
        }
        res[value.productId._id].purchasedQty += value.purchasedQty;
        return res;
    }, {});
    if(filterProduct === 'view') {
        var rows = [];
        const tempList = stableSort(productInPage, getComparator(product, 'view'))
        tempList.map((item) => {
            if(rows.length < 10)
                rows.push(item);
        })
        return (
            <Box>
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-child': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-child': {
                                pr: 3
                            }
                        }}
                    >
                        <ProductTableHead product={product} productBy={productBy} />
                        <TableBody>
                            {stableSort(rows, getComparator(product, productBy)).map((row, index) => {
                                const isItemSelected = isSelected(row._id);
                                const labelId = `enhanced-table-checkbox-${index}`;
    
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { bproduct: 0 } }}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row._id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" align="left">
                                            <Link color="secondary" component={RouterLink} to="/product">
                                                {row._id}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="left">{row.name}</TableCell>
                                        <TableCell align="center">{row.quantitySold}</TableCell>
                                        <TableCell align="center">
                                            {row.view}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    } else {
        var rows = [];
        const tempList = stableSort(ListSales, getComparator(product, 'purchasedQty'))
        tempList.map((item) => {
            if(rows.length < 10)
                rows.push(item);
        })
        return (
            <Box>
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-child': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-child': {
                                pr: 3
                            }
                        }}
                    >
                        <ProductTableHead product={product} productBy='purchasedQty' />
                        <TableBody>
                            {stableSort(rows, getComparator(product, 'purchasedQty')).map((row, index) => {
                                const isItemSelected = isSelected(row.productId._id);
                                const labelId = `enhanced-table-checkbox-${index}`;
    
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        sx={{ '&:last-child td, &:last-child th': { bproduct: 0 } }}
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.productId._id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell component="th" id={labelId} scope="row" align="left">
                                            <Link color="secondary" component={RouterLink} to="/product">
                                                {row.productId._id}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="left">{row.productId.name}</TableCell>
                                        <TableCell align="center">{row.purchasedQty}</TableCell>
                                        <TableCell align="center">
                                            {row.productId.view}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }
    

    
};

export default ProductTable;

