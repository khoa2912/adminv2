import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getDataOrdersSales } from 'actions/order';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { template } from 'lodash';
// chart options
const barChartOptions = {
    chart: {
        type: 'bar',
        height: 365,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '45%',
            borderRadius: 4
        }
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: ['Sản phẩm bán chạy trong tuần'],
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: false
    },
    grid: {
        show: false
    }
};

// ==============================|| MONTHLY BAR CHART ||============================== //

const MonthlyBarChart = (props) => {
    const theme = useTheme();
    const [dataSales, setDataSales] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDataOrdersSales()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setDataSales(data);
        });
        
    }, [dispatch]);
    const { primary, secondary } = theme.palette.text;
    const info = theme.palette.info.light;
    console.log(props);
    function parseDate(input) {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }
    var startTime = new Date(props.startTime);
    var endTime = new Date(props.endTime);
    var resultDataSales = []
    if(props.keyOpen === '') {
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
        resultDataSales = ListSales
    } else {
        if(props.startTime !== props.endTime) {
            console.log(props.startTime)
            console.log(props.endTime)
            console.log('run else 1')
            var ListSalesTemp = [];
            var ListSales = [];
            dataSales?.map((item) => {
                var date = parseDate(item.orderStatus[3].date);
                date.setHours(0, 0, 1);
                console.log(date.getTime())
                console.log(props.startTime)
                if((date.getTime() >= startTime.getTime()) && (date.getTime() <= endTime.getTime())) {
                    item.items.map((data) => {
                        ListSalesTemp.push(data);
                    })
                }
            })
            console.log(ListSalesTemp)
            ListSalesTemp.reduce(function(res, value) {
                if (!res[value.productId._id]) {
                  res[value.productId._id] = { productId: value.productId, purchasedQty: 0 };
                  ListSales.push(res[value.productId._id])
                }
                res[value.productId._id].purchasedQty += value.purchasedQty;
                return res;
            }, {});
            console.log(ListSales)
            resultDataSales = ListSales
        } else {
            console.log('run else 2')
            console.log(props.startTime)
            console.log(props.endTime)
            var ListSalesTemp = [];
            var ListSales = [];
            dataSales?.map((item) => {
                var date = parseDate(item.orderStatus[3].date);
                date.setHours(0, 0, 1);
                var dateStart = startTime;
                if(date.getTime() <= endTime.getTime() && date.getTime() >= dateStart.getTime()) {
                    item.items.map((data) => {
                        ListSalesTemp.push(data);
                    })
                }
            })
            ListSalesTemp.reduce(function(res, value) {
                if (!res[value.productId._id]) {
                  res[value.productId._id] = { productId: value.productId, purchasedQty: 0 };
                  ListSales.push(res[value.productId._id])
                }
                res[value.productId._id].purchasedQty += value.purchasedQty;
                return res;
            }, {});
            console.log(ListSales)
            resultDataSales = ListSales
        }
    }
    var dataColumn = [];
    var dataValueColumn = [];
    resultDataSales.map(e => {
        dataColumn.push(e.purchasedQty)
        dataValueColumn.push(e.productId.name)
    })
    const series = [
        {
            name: dataValueColumn,
            data: dataColumn
        }
    ]
    const [options, setOptions] = useState(barChartOptions);
    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [info],
            xaxis: {
                labels: {
                    style: {
                        colors: [secondary, secondary, secondary]
                    }
                }
            },
            tooltip: {
                theme: 'light'
            }
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [primary, info, secondary]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="bar" height={365} />
        </div>
    );
};

export default MonthlyBarChart;
