import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import { getTotalViews } from 'actions/totalView';
import { useDispatch } from 'react-redux';
// chart options
const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot }) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;
    const [options, setOptions] = useState(areaChartOptions);
    const [dataViews, setDataViews] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTotalViews()).then((data) => {
            data.map((item, index) => (item.id = index + 1));
            setDataViews(data);
        });
    }, [dispatch]);

    function parseDate(input) {
        var parts = input.match(/(\d+)/g);
        // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
        return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }
    var ListDataView = [];
    var daySub = 8;
    var today = new Date();
    var last = new Date(today.getTime() - (daySub * 24 * 60 * 60 * 1000));
    last.setHours(0,0,0);
    today.setHours(0,0,0);
    dataViews.map((item) => {
        var date = parseDate(item.createdTime)
        date.setHours(0,0,1);
        if(date.getTime() >= last.getTime() && date.getTime() <= today.getTime()) {
            ListDataView.push(item);
        }
    })
    
    var total = []
    for(let i = 0; i<ListDataView.length-1; i++) {
        var valueView = 0;
        valueView = ListDataView[i+1].view - ListDataView[i].view;
        total.push(valueView)
    }
    // console.log(total)
    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.primary.main, theme.palette.primary[700]],
            xaxis: {
                categories: ['7 Ngày trước', '6 Ngày trước', '5 Ngày trước', '4 Ngày trước', '3 Ngày trước', '2 Ngày trước', 'Hôm qua'],
                labels: {
                    style: {
                        colors: [
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary,
                            secondary
                        ]
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: slot === 'month' ? 11 : 7
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light'
            }
        }));
    }, [primary, secondary, line, theme, slot]);

    const series = [
        // {
        //     name: 'Tuần trước',
        //     // data: total
        // },
        {
            name: 'Tuần này',
            data: total
        }
    ]

    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
    slot: PropTypes.string
};

export default IncomeAreaChart;
