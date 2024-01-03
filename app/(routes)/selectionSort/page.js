"use client"

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SelectionSortVisualizer = () => {
    const [data, setData] = useState([]);
    const [chart, setChart] = useState(null);
    const chartContainer = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [order, setOrder] = useState(false);
    const [sorting, setSorting] = useState(false);

    const generateRandomData = () => {
        const newData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
        setData(newData);
        setInputValue('');
    };

    useEffect(() => {
        generateRandomData();
    }, []);

    useEffect(() => {
        const ctx = chartContainer.current.getContext('2d');

        if (chart) {
            chart.destroy();
        }

        const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map((_, index) => index.toString()),
                datasets: [{
                    label: 'Value',
                    data: data,
                    backgroundColor: data.map((_) => '#3182CE'),
                    borderColor: '#fffff',
                    borderWidth: 0,
                    padding: 5,
                }],
            },
            options: {
                layout: {
                    padding: {
                        top: 30,
                    },
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        display: true,
                        color: 'black',
                        anchor: 'end',
                        align: 'top',
                        formatter: (value) => value,
                    },
                },
            },
            plugins: [ChartDataLabels],
        });

        setChart(newChart);

        return () => {
            if (newChart) {
                newChart.destroy();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleInputChange = (event) => {
        const input = event.target.value.trim();
        const values = input.split(',').map(Number).filter(Boolean).slice(0, 10);
        setData(values);
        setInputValue(input);
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const selectionSort = async () => {
        setSorting(true);
        const newData = [...data];
        const len = newData.length;

        for (let i = 0; i < len - 1; i++) {
            let target = i;

            let colors;

            for (let j = i + 1; j < len; j++) {
                if ((order && newData[j] < newData[target]) || (!order && newData[j] > newData[target])) {
                    target = j;
        
                    // Set the color for the minimum index here
                    colors = newData.map((_, index) => {
                        if (index === target) return '#FF0000'; // Minimum index
                        else if (index === i) return '#00FF00'; // Reset the previous checked index color
                        else if (index <= i) return '#FFA500'; // Compared bars
                        else return '#3182CE'; // Unsorted bars
                    });
                }
            }

            [newData[i], newData[target]] = [newData[target], newData[i]];

            if (chart) {
                chart.data.datasets[0].data = newData.slice();
                chart.data.datasets[0].backgroundColor = colors;
                chart.update();
            }

            await delay(1000);
        }

        const remainingColors = newData.map((_, index) => {
            if (index <= len - 1) return '#FFA500'; // Orange for remaining unsorted elements
            else return '#3182CE'; // Set default color for the rest
        });

        if (chart) {
            chart.data.datasets[0].backgroundColor = remainingColors;
            chart.update();
        }
        setSorting(false);
    };

    return (
        <div className="flex flex-col h-full items-center justify-center">
            <div className='flex flex-col gap-y-2'>
                <h1 className='flex items-center justify-start py-2 w-full text-3xl font-medium text-orange-500'>Selection Sort</h1>
                <div className='flex flex-row gap-x-2 items-center'>
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter up to 10 comma-separated numbers"
                        className="border border-zinc-400"
                        disabled={sorting}
                    />
                    <Button
                        className={cn("transition-all duration-300",
                        order ? "bg-orange-700/90 hover:bg-orange-700" : "bg-teal-700/90 hover:bg-teal-700")}
                        onClick={() => setOrder(!order)}
                        disabled={sorting}
                    >
                        {order ? "Ascending" : "Descending"}
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={ generateRandomData }
                        disabled={sorting}
                    >
                        Random
                    </Button>
                </div>
                <Button
                    onClick={ selectionSort }
                    disabled={sorting}
                    className=" px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
                >
                    {sorting ? "Sorting..." : "Sort"}
                </Button>
                <div className='flex flex-row gap-x-3 pt-4'>
                    <div className='flex flex-row gap-x-2 items-center'>
                        <div className='w-14 h-8 bg-[#3182CE] px-2 py-2'/> 
                        <p>Unsorted Bar</p>
                    </div>
                    <div className='flex flex-row gap-x-2 items-center'>
                        <div className='w-14 h-8 bg-[#FFA500] px-2 py-2'/> 
                        <p>Sorted Bar</p>
                    </div>
                    <div className='flex flex-row gap-x-2 items-center'>
                        <div className='w-14 h-8 bg-[#FF0000] px-2 py-2'/> 
                        <p>Target bar</p>
                    </div>
                    <div className='flex flex-row gap-x-2 items-center'>
                        <div className='w-14 h-8 bg-[#00FF00] px-2 py-2'/> 
                        <p>Current index</p>
                    </div>
                </div>
            </div>
            <div className='w-full max-w-xl'>
                <canvas ref={chartContainer}  style={{ height: '200px' }}></canvas>
            </div>
        </div>
    );
};

export default SelectionSortVisualizer;
