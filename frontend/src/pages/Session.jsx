import NavbarLayout from '@/layout/NavbarLayout';
import { useEffect, useState } from 'react';
import { HStack, Button, VStack, Text, Table, Box, Tag, Badge } from '@chakra-ui/react';
import { filterSession, filterSessionByRentang } from '@/api/session';
import DatePickerUi from '@/components/DatePicker';
import usePagination from '@/hooks/usePaginations';
import { formatDateTime } from '@/utils/formatDateTime';
import Paginations from '@/components/Paginations';
import { formatRupiah } from '@/utils/formatNumber';
import { toaster } from '@/components/ui/toaster';
import EmptyState from '@/components/EmptyState';
import SearchInput from '@/components/input/InputSearch';
import { setDate } from '@/utils/formatDate';
import SpinnerJsx from '@/components/Spinner';

const statusColor = {
    playing: 'green',
    booking: 'orange',
    finished: 'white',
    cancel: 'red',
};

const periodeFilterData = [
    {
        periode: 'today',
        title: 'Hari ini',
    },
    {
        periode: 'week',
        title: 'Minggu Ini',
    },
    {
        periode: 'month',
        title: 'Bulan Ini',
    },
    {
        periode: 'year',
        title: 'Tahun Ini',
    },
    {
        periode: 'costum',
        title: 'Rentang Tanggal',
    },
];

const statusFilterData = [
    {
        status: 'all',
        title: 'Semua',
    },
    {
        status: 'playing',
        title: 'Bermain',
    },
    {
        status: 'booking',
        title: 'Booking',
    },
    {
        status: 'finished',
        title: 'Selesai',
    },
    {
        status: 'cancel',
        title: 'Batal',
    },
];

const setBadgePeriode = title => {
    const result = periodeFilterData.find(val => {
        return val.periode === title;
    });
    return result.title;
};

const formatStatusToId = title => {
    const result = statusFilterData.find(val => {
        return val.status === title;
    });
    return result.title;
};

const SessionPage = () => {
    const [period, setPeriod] = useState('today');
    const [status, setStatus] = useState('all');
    const [items, setItems] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const { page, setPage, currentData, pageSize, count, resetPage } = usePagination(items, 15);
    const fetchSession = async () => {
        setLoading(true);
        try {
            const result = await filterSession(period, status);
            setItems(result.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterByRentang = async () => {
        setLoading(true);
        try {
            if (!startDate || !endDate) {
                toaster.create({
                    title: 'harap isi form Date yang tersedia !',
                    type: 'error',
                });
            }
            const result = await filterSessionByRentang(setDate(startDate[0]), setDate(endDate[0]), status);
            setItems(result?.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (period === 'costum') return;
        fetchSession();
    }, [period, status]);
    return (
        <NavbarLayout header={'SESSION'}>
            <VStack align="stretch" gap={2.5} mt={5}>
                <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                    Filter Periode
                </Text>
                {/* BUTTON PERIODE */}
                <HStack wrap={'wrap'} gap={3}>
                    {periodeFilterData.map(val => (
                        <Button
                            key={val.periode}
                            variant={period === val.periode ? 'solid' : 'outline'}
                            onClick={() => setPeriod(val.periode)}
                            size={'sm'}
                        >
                            {val.title}
                        </Button>
                    ))}
                </HStack>
                {/* END BUTTON PERIODE*/}
                {/* BUTTON PERIODE CUSTOM*/}
                {period === 'costum' && (
                    <HStack>
                        <DatePickerUi value={startDate} onChange={e => setStartDate(e.value)} />

                        <Text color="fg.muted">→</Text>
                        <DatePickerUi value={endDate} onChange={e => setEndDate(e.value)} />

                        <Button colorPalette={'cyan'} variant={'surface'} onClick={handleFilterByRentang}>
                            Terapkan
                        </Button>
                    </HStack>
                )}
                {/* END BUTTON PERIODE CUSTOM*/}
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mt={2}>
                    Filter Status
                </Text>

                <HStack wrap={'wrap'} gap={3}>
                    {statusFilterData.map(val => (
                        <Button
                            key={val.status}
                            variant={status === val.status ? 'solid' : 'outline'}
                            onClick={() => setStatus(val.status)}
                            size={'sm'}
                        >
                            {val.title}
                        </Button>
                    ))}
                </HStack>
            </VStack>
            <HStack gap={2} mt={5} justifyContent={'space-between'}>
                <HStack>
                    <Tag.Root colorPalette={'green'}>
                        <Tag.Label>{setBadgePeriode(period)}</Tag.Label>
                    </Tag.Root>
                    <Tag.Root colorPalette={'green'}>
                        <Tag.Label>{formatStatusToId(status)}</Tag.Label>
                    </Tag.Root>
                </HStack>
                <Box>{items.length > 0 ? <SearchInput /> : null}</Box>
            </HStack>
            <Box
                display="flex"
                flexDirection="column"
                alignItems={'center'}
                mt={2}
                justifyContent="space-between"
                minH="max-content"
                mb={10}
            >
                {loading ? (
                    <SpinnerJsx />
                ) : items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <Box minH={'350px'}>
                            <Table.Root size={'md'} tableLayout={'fixed'} mb={5} variant="outline" rounded={'md'}>
                                <Table.Header bg={'blackAlpha.300'}>
                                    <Table.Row bg={'none'}>
                                        {['Nama Station', 'Mulai', 'Selesai', 'Durasi', 'Total Harga', 'Status'].map(
                                            (val, index) => (
                                                <Table.ColumnHeader key={index}>{val}</Table.ColumnHeader>
                                            ),
                                        )}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {currentData.map(val => (
                                        <Table.Row
                                            bg={'none'}
                                            _hover={{ bg: 'gray.700' }}
                                            key={val.id_session}
                                            variant="outline"
                                            striped
                                        >
                                            <Table.Cell>{val.name_station}</Table.Cell>
                                            <Table.Cell>{formatDateTime(val.start_time)}</Table.Cell>
                                            <Table.Cell>{formatDateTime(val.end_time)}</Table.Cell>
                                            <Table.Cell>{val.total_billing} Jam</Table.Cell>
                                            <Table.Cell>Rp. {formatRupiah(val.total_price)}</Table.Cell>
                                            <Table.Cell>
                                                <Badge colorPalette={statusColor[val.status]} variant={'surface'}>
                                                    {formatStatusToId(val.status)}
                                                </Badge>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        </Box>
                        {items.length > 15 && (
                            <Paginations pageSize={pageSize} page={page} setPage={setPage} items={items} />
                        )}
                    </>
                )}
            </Box>
        </NavbarLayout>
    );
};

export default SessionPage;
