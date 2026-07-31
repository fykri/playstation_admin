import NavbarLayout from '@/layout/navbarLayout';
import { Box, Card, HStack, Text, Heading, Circle } from '@chakra-ui/react';
import { LuMonitorCheck, LuGamepad2, LuCalendarCheck, LuHistory, LuHandCoins } from 'react-icons/lu';
import { getDashboardStat, getMonthlyIncome } from '@/api/dashboard';
import { toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { formatRupiah } from '@/utils/formatNumber';

import { Chart, useChart } from '@chakra-ui/charts';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
const Dashboard = () => {
    const [statItems, setStatItems] = useState({});
    const [monthlyIncome, setMonthLyIncome] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleDashboardStat = async () => {
        setLoading(true);
        try {
            const result = await getDashboardStat();
            console.log(result);
            setStatItems(result.data);
        } catch (error) {
            toaster.create({
                type: 'error',
                title: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleMonthlyIncome = async () => {
        setLoading(true);
        try {
            const result = await getMonthlyIncome();
            setMonthLyIncome(result.data);
        } catch (error) {
            toaster.create({
                type: 'error',
                title: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const chart = useChart({
        data: [...monthlyIncome] || [],
        series: [{ name: 'revenue', color: 'teal.solid' }],
    });

    useEffect(() => {
        handleDashboardStat();
        handleMonthlyIncome();
    }, []);
    const cardItems = [
        {
            header: 'JUMLAH STATION',
            icon: <LuMonitorCheck size={24} />,
            bg: 'purple.600',
            value: `${statItems?.total_station} Station`,
        },
        {
            header: 'STATION AKTIF',
            icon: <LuGamepad2 size={24} />,
            bg: 'cyan.600',
            value: `${statItems?.station_aktif} Station`,
        },
        {
            header: 'BOOKING AKTIF',
            icon: <LuCalendarCheck size={24} />,
            bg: 'orange.600',
            value: `${statItems?.booking_aktif} Booking`,
        },
        {
            header: 'SESSION HARI INI',
            icon: <LuHistory size={24} />,
            bg: 'yellow.600',
            value: `${statItems?.session_hari_ini} Session`,
        },
        {
            header: 'PENDAPATAN HARI INI',
            icon: <LuHandCoins size={24} />,
            bg: 'green.600',
            value: `Rp. ${formatRupiah(statItems?.pendapatan_hari_ini || '0')}`,
        },
    ];

    return (
        <NavbarLayout header={'Dashboard'}>
            <HStack md={{ flexWrap: 'wrap', justifyContent: 'center' }} lg={{ flexWrap: 'nowrap', gap: 3 }}>
                {cardItems.map(val => (
                    <Card.Root
                        key={val.header}
                        maxW={'250px'}
                        lg={{ w: '250px' }}
                        h={'140px'}
                        mt={5}
                        variant={'outline'}
                        bg={'var(--color-card)'}
                        shadow={'sm'}
                        rounded={'lg'}
                    >
                        <Card.Body p={4} display={'flex'} gap={3} justifyContent={'space-between'}>
                            <Box display={'flex'} gap={3} alignItems={'center'} justifyContent={'space-between'}>
                                <Text fontSize={'xs'} fontWeight={'semibold'} color={'gray.400'}>
                                    {val.header}
                                </Text>
                                <Circle size="11" bg={val.bg} color="var(--color-container)">
                                    {val.icon}
                                </Circle>
                            </Box>
                            <Box>
                                <Heading size={'xl'}>{val.value}</Heading>
                            </Box>
                        </Card.Body>
                    </Card.Root>
                ))}
            </HStack>
            <Box bg={'var(--color-card)'} mt={5} rounded={'md'} shadow={'md'}>
                <Chart.Root maxH="sm" chart={chart} px={12} py={5}>
                    <LineChart data={chart.data} responsive>
                        <CartesianGrid stroke={chart.color('gray.700')} strokeDasharray="3 3" />
                        <XAxis
                            axisLine={false}
                            dataKey={chart.key('label')}
                            tickFormatter={value => value.slice(0, 3)}
                            stroke={chart.color('border')}
                            label={{ value: 'Bulan', position: 'bottom' }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            stroke={chart.color('border')}
                            tickFormatter={value => `Rp.${formatRupiah(value) || 0}`}
                        />
                        <Tooltip animationDuration={100} cursor={false} content={<Chart.Tooltip />} />
                        {chart.series.map(item => (
                            <Line
                                key={item.name}
                                isAnimationActive={false}
                                dataKey={chart.key(item.name)}
                                stroke={chart.color(item.color)}
                                strokeWidth={2}
                                dot={{ strokeDasharray: '0' }}
                            />
                        ))}
                    </LineChart>
                </Chart.Root>
            </Box>
        </NavbarLayout>
    );
};

export default Dashboard;
