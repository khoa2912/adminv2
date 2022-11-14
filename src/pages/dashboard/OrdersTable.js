import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from 'actions/product';
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
    const {filterProduct, endTime, startTime} =props
    const [productInPage, setProductInPage] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setProductInPage(data);
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
    const [productBy] = useState('view');
    const [selected] = useState([]);

    // if(filterProduct === 'view') {
    //     product = 'desc';
    //     productBy = 'view';
    // }
    // if(filterProduct === 'quantity') {
    //     product = 'desc';
    //     productBy = 'quantity';
    // }

    const isSelected = (productId) => selected.indexOf(productId) !== -1;
    const rows = [];
    const tempList = stableSort(productInPage, getComparator(product, productBy))
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
                                    <TableCell align="right">
                                        {row.view}
                                    </TableCell>
                                    <TableCell align="right">{row.quantitySold}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProductTable;

