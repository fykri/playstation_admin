import NavbarLayout from '@/layout/navbarLayout';
import { Box, Card, HStack, Text, Heading, Circle, Status } from '@chakra-ui/react';
import { LuMonitorCheck, LuGamepad2, LuCalendarCheck, LuHistory, LuHandCoins, LuLayoutGrid } from 'react-icons/lu';
import { getDashboardStat, getMonthlyIncome, getEndTimeStation, getActiveBooking } from '@/api/dashboard';
import { toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';
import { formatRupiah } from '@/utils/formatNumber';
import { Chart, useChart } from '@chakra-ui/charts';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import EmptyDataDashboard from './components/EmptyDataDashboard';
import { useCountdown } from '@/hooks/useCountdown';

const StationCountdown = ({ station }) => {
    const time = useCountdown({
        id_station: station.id_station,
        endTime: station.end_time,
        status: station.status,
    });

    return (
        <Text fontFamily="mono" fontWeight="bold" id={`timer-display-${station?.id_station}`}>
            {time}
        </Text>
    );
};

const Dashboard = () => {
    const [statItems, setStatItems] = useState({});
    const [monthlyIncome, setMonthLyIncome] = useState([]);
    const [station, setStation] = useState([]);
    const [booking, setBooking] = useState([]);
    const [emptyData, setEmptyData] = useState('');
    const [emptyBooking, setEmptyBooking] = useState('');
    const [loading, setLoading] = useState(false);
    const handleDashboardStat = async () => {
        setLoading(true);
        try {
            const result = await getDashboardStat();
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
    const handleGetEndTime = async () => {
        try {
            const result = await getEndTimeStation();
            setStation(result.data);
        } catch (error) {
            setEmptyData(error.message);
        }
    };

    //console.log('booking: ', booking)
    const handleGetActiveBooking = async () => {
        try {
            const result = await getActiveBooking();
            console.log('result: ', result)
            setBooking(result.data);
        } catch (error) {
            console.log(error)
            setEmptyBooking(error.message);
        }
    };

    const chart = useChart({
        data: [...monthlyIncome] || [],
        series: [{ name: 'revenue', color: 'teal.solid' }],
    });

    useEffect(() => {
        handleDashboardStat();
        handleMonthlyIncome();
        handleGetEndTime();
        handleGetActiveBooking();
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
            {/* CARD */}
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
            {/* END CARD */}

            <Box display={'flex'} gap={5} mt={5} flexDirection={'column'} lg={{ flexDirection: 'row' }} mb={5}>
                {/* CARTS */}
                <Box bg={'var(--color-card)'} rounded={'md'} shadow={'md'} lg={{ w: '70%' }} flex={3}>
                    <Chart.Root maxH="md" chart={chart} px={12} py={5}>
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
                            <Tooltip
                                animationDuration={100}
                                cursor={false}
                                content={<Chart.Tooltip />}
                                formatter={(value, name) => [`Rp.${formatRupiah(value)}`, name]}
                            />
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
                {/* END CARTS */}

                <Box
                    flex={1}
                    bg={'var(--color-card)'}
                    rounded={'md'}
                    shadow={'md'}
                    p={5}
                    display={'flex'}
                    justifyContent={'space-between'}
                    lg={{ flexDirection: 'column' }}
                >
                    <Box display={'flex'} flexDirection={'column'} gap={1} flex={1} alignItems={'start'}>
                        <HStack>
                            <Text fontWeight={'semibold'} letterSpacing={2} fontSize={'md'} h={'max-content'}>
                                STATION AKTIF
                            </Text>
                            <LuGamepad2 size={19} />
                        </HStack>
                        <Box
                            h={'160px'}
                            w={'full'}
                            overflow={'hidden'}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={2}
                        >
                            {station.length === 0 ? (
                                <EmptyDataDashboard
                                    icon={<LuLayoutGrid />}
                                    title={'Tidak Ada Station Tersedia'}
                                    desc={emptyData}
                                />
                            ) : (
                                station.map(val => (
                                    <Status.Root
                                        key={val?.id_station}
                                        colorPalette="green"
                                        bg="green.500/10"
                                        px={3}
                                        py={2}
                                        rounded="md"
                                        display="inline-flex"
                                        alignItems="center"
                                        gap={2}
                                    >
                                        <Status.Indicator />

                                        <Text fontWeight="medium">{val?.name_station}</Text>
                                        <Text fontWeight="medium" fontSize={'xs'}>
                                            {val?.package}
                                        </Text>
                                        <Text color="gray.400">•</Text>
                                        <StationCountdown station={val} />
                                    </Status.Root>
                                ))
                            )}
                        </Box>
                    </Box>

                    <Box display={'flex'} flexDirection={'column'} gap={1} flex={1} alignItems={'start'}>
                        <HStack flex={1} alignItems={'start'}>
                            <Text fontWeight={'semibold'} letterSpacing={2} fontSize={'md'}>
                                BOOKING HARI INI
                            </Text>
                            <LuCalendarCheck size={19} />
                        </HStack>
                        <Box
                            h={'160px'}
                            w={'full'}
                            overflow={'hidden'}
                            display={'flex'}
                            flexDirection={'column'}
                            gap={2}
                        >
                            {booking.length === 0 ? (
                                <EmptyDataDashboard
                                    icon={<LuLayoutGrid />}
                                    title={'Tidak Ada Booking Tersedia'}
                                    desc={emptyData}
                                />
                            ) : (
                                booking.map(val => (
                                    <Status.Root
                                        key={val?.id_booking}
                                        colorPalette="orange"
                                        bg="orange.500/10"
                                        px={3}
                                        py={2}
                                        rounded="md"
                                        display="inline-flex"
                                        alignItems="center"
                                        gap={2}
                                    >
                                        <Status.Indicator />
                                        <Text fontWeight="medium">{val?.customer_name}</Text>
                                        <Text color="gray.400">•</Text>
                                        <Text fontWeight="medium">{`${String(val?.booking_start).slice(0, 5)} -- ${String(val?.booking_end).slice(0, 5)}`}</Text>
                                    </Status.Root>
                                ))
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </NavbarLayout>
    );
};

export default Dashboard;
