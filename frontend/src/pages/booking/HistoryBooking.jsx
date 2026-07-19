import { Button, HStack, Text, VStack, parseDate, Table, Box, Link } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import DatePickerUi from '@/components/DatePicker';
import { getWithDate } from '@/api/booking';
import usePagination from '@/hooks/usePaginations';
import { useBookingStore } from '@/stores/useBookingStore';
import { useShallow } from 'zustand/shallow';
import EmptyState from '@/components/EmptyState';
import SpinnerJsx from '@/components/Spinner';
import Paginations from '@/components/Paginations';
import DialogLayout from '@/layout/DialogLayout';
import BookingDetail from './DetailBooking';

const listFilterHistoryBooking = [
    { title: 'Januari', value: 'january' },
    { title: 'Februari', value: 'february' },
    { title: 'Maret', value: 'march' },
    { title: 'April', value: 'april' },
    { title: 'Mei', value: 'may' },
    { title: 'Juni', value: 'june' },
    { title: 'Juli', value: 'July' },
    { title: 'Agustus', value: 'august' },
    { title: 'September', value: 'september' },
    { title: 'Oktober', value: 'october' },
    { title: 'November', value: 'november' },
    { title: 'Desember', value: 'december' },
];

const getBookingStatus = (bookingDate, bookingStart, graceMinutes = 30) => {
    const bookingStartTime = new Date(`${bookingDate}T${bookingStart}`);

    const bookingExpiredTime = new Date(bookingStartTime.getTime() + graceMinutes * 60 * 1000);

    const now = new Date();

    return {
        canStart: now >= bookingStartTime && now <= bookingExpiredTime,

        expired: now > bookingExpiredTime,

        bookingStartTime,
        bookingExpiredTime,
    };
};

const formatYear = date => date.year.toString();
const parseYear = string => {
    if (string === '' || !string) return;
    const year = Number(string);
    if (year < 100) {
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100;
        return parseDate(new Date(currentCentury + year, 0));
    }
    return parseDate(new Date(Number(string), 0));
};

const valueTableHeader = ['Nama Station', 'Nama Pelanggan', 'Tanggal Booking', 'Jam Booking', 'Status', 'Detail'];

const HistoryBooking = () => {
    const [selectedMonth, setselectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(() => parseDate([`${new Date().getFullYear()}-01-01`]));
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { page, setPage, currentData, pageSize } = usePagination(items, 15);
    const { fetchDataBooking } = useBookingStore(useShallow(state => ({ fetchDataBooking: state.fetchDataBooking })));
    const [selectedId, setSelectedId] = useState('');
    const [openDialogDetail, setOpenDialogDetail] = useState(false);

    const handleHistoryBooking = async () => {
        setLoading(true);
        try {
            const result = await getWithDate(selectedYear, selectedMonth);
            setItems(result.data);
        } catch (error) {
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusExpired = async id_booking => {
        try {
            await updateBookingExpired(id_booking);
            await fetchDataBooking();
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (selectedMonth && selectedYear) {
            handleHistoryBooking();
        }
    }, [selectedYear, selectedMonth]);

    return (
        <>
            {/* Detail Dialog */}
            <DialogLayout
                size={'lg'}
                titleHeader={'Detail Booking'}
                open={openDialogDetail}
                setOpen={e => setOpenDialogDetail(e.open)}
            >
                {selectedId && <BookingDetail id_booking={selectedId} />}
            </DialogLayout>
            {/* End Detail Dialog */}
            <VStack alignItems={'start'} mb={3} w={'2xs'}>
                <Text fontSize="sm" fontWeight="medium" color="fg.muted">
                    Filter Tanggal
                </Text>
                <DatePickerUi
                    year={'year'}
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.value)}
                    parseYear={parseYear}
                    formatYear={formatYear}
                />
            </VStack>
            <HStack gap={5} wrap={'wrap'} mb={5}>
                {listFilterHistoryBooking.map((val, index) => (
                    <Button
                        key={index}
                        variant={selectedMonth === index ? 'solid' : 'outline'}
                        size={'sm'}
                        onClick={() => setselectedMonth(index)}
                    >
                        {val.title}
                    </Button>
                ))}
            </HStack>
            {loading ? (
                <SpinnerJsx />
            ) : items.length === 0 ? (
                <EmptyState description="belum ada pelanggan yang booking di bulan ini" title="Data booking kosong" />
            ) : (
                <Box>
                    <Table.Root size={'md'} tableLayout={'fixed'} mb={5} variant="outline" rounded={'md'}>
                        <Table.Header bg={'blackAlpha.300'}>
                            <Table.Row bg={'none'}>
                                {valueTableHeader.map((val, key) => (
                                    <Table.ColumnHeader key={key}>{val}</Table.ColumnHeader>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {currentData.map(val => {
                                const booking = getBookingStatus(val?.booking_date, val?.booking_start);
                                if (booking.expired) {
                                    handleStatusExpired(val?.id_booking);
                                }
                                return (
                                    <Table.Row
                                        bg={'none'}
                                        _hover={{ bg: 'gray.700' }}
                                        key={val.id_booking}
                                        variant="outline"
                                        striped
                                    >
                                        <Table.Cell>{val?.name_station}</Table.Cell>
                                        <Table.Cell>{val?.customer_name}</Table.Cell>
                                        <Table.Cell>{val?.booking_date}</Table.Cell>
                                        <Table.Cell>{`${String(val?.booking_start).slice(0, 5)} -- ${String(val?.booking_end).slice(0, 5)}`}</Table.Cell>
                                        <Table.Cell>{val?.status}</Table.Cell>
                                        <Table.Cell>
                                            <Link
                                                as={'button'}
                                                variant={'underline'}
                                                colorPalette="cyan"
                                                onClick={() => {
                                                    setSelectedId(val?.id_booking);
                                                    setOpenDialogDetail(true);
                                                }}
                                            >
                                                detail
                                            </Link>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Root>
                    {items.length > 15 && (
                        <Paginations pageSize={pageSize} page={page} setPage={setPage} items={items} />
                    )}
                </Box>
            )}
        </>
    );
};

export default HistoryBooking;
