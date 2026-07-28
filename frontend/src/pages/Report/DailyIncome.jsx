import { getDailyIncome } from '@/api/report';
import { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { toaster } from '@/components/ui/toaster';
import { Chart, useChart } from '@chakra-ui/charts';
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';

const DailyIncomeReport = () => {
    const [dailyIncomeItems, setDailyIncomeItems] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log('dailyIncomeItems: ', dailyIncomeItems);
    const chart = useChart({
        data: [...dailyIncomeItems],
        series: [{ label: 'pendapatan harian', name: 'total_revenue', color: 'teal.solid' }],
    });

    const handleDailyIncome = async () => {
        setLoading(true);
        try {
            const result = await getDailyIncome();
            setDailyIncomeItems(
                result.data.map(val => ({
                    ...val,
                    total_revenue: Number(val.total_revenue),
                })),
            );
        } catch (error) {
            toaster.create({
                type: 'error',
                title: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleDailyIncome();
    }, []);
    return (
        <Flex h={'full'} alignItems={'center'}>
            <Chart.Root maxH={'sm'} chart={chart}>
                <AreaChart data={chart.data} responsive>
                    <CartesianGrid stroke={chart.color('border')} vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey={chart.key('label')}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} animationDuration={100} content={<Chart.Tooltip />} />
                    <Legend content={<Chart.Legend />} />

                    {chart.series.map(item => (
                        <defs key={item.label}>
                            <Chart.Gradient
                                id={`${item.label}-gradient`}
                                stops={[
                                    { offset: '0%', color: item.color, opacity: 0.3 },
                                    { offset: '100%', color: item.color, opacity: 0.05 },
                                ]}
                            />
                        </defs>
                    ))}

                    {chart.series.map(item => (
                        <Area
                            key={item.name}
                            type="natural"
                            isAnimationActive={false}
                            dataKey={chart.key(item.name)}
                            fill={`url(#${item.name}-gradient)`}
                            stroke={chart.color(item.color)}
                            strokeWidth={2}
                            stackId="a"
                        />
                    ))}
                </AreaChart>
            </Chart.Root>
        </Flex>
    );
};

export default DailyIncomeReport;
