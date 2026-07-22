import { useState, useEffect } from 'react';
import { Table, Link, HStack, IconButton, Box, Badge } from '@chakra-ui/react';
import usePagination from '@/hooks/usePaginations';
import Paginations from '@/components/Paginations';
import EditDeleteButton from '@/components/button/EditDeleteButton';
import { FaPlay } from 'react-icons/fa6';
import DialogLayout from '@/layout/DialogLayout';
import BookingDetail from './DetailBooking';
import { useBookingStore } from '@/stores/useBookingStore';
import { useShallow } from 'zustand/shallow';
import { updateBookingExpired, cancelBooking, playBooking } from '@/api/booking';
import BookingDialog from './BookingDialog';
import { toaster } from '@/components/ui/toaster';
import AlertDialog from '@/components/dialog/AlertDialog';
import EmptyState from '@/components/EmptyState';
import { FaInfo } from 'react-icons/fa';
import { getBookingStatus, formatStatusToId, statusColor } from '@/utils/bookingUtlis';
import HoverCardComponent from '@/components/HoverCard';

const valueTableHeader = [
    'Nama Station',
    'Nama Pelanggan',
    'Tanggal Booking',
    'Jam Booking',
    'Status',
    'Aksi',
    'Detail',
];

const TableBookingActive = () => {
    const [openDetail, setOpenDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [now, setNow] = useState(new Date());
    const [editData, setEditData] = useState({});
    const [selectedIdBooking, setSelectedIdBooking] = useState('');
    const { bookingItems, fetchDataBooking } = useBookingStore(
        useShallow(state => ({ bookingItems: state.bookingItems, fetchDataBooking: state.fetchDataBooking })),
    );
    const { page, setPage, currentData, pageSize } = usePagination(bookingItems, 15);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    useEffect(() => {
        fetchDataBooking();
    }, []);
    const handleStatusExpired = async id_booking => {
        try {
            await updateBookingExpired(id_booking);
            await fetchDataBooking();
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleCancelBooking = async () => {
        setLoading(true);
        try {
            if (!selectedIdBooking) {
                toaster.create({
                    title: 'booking not found',
                    type: 'error',
                });
            }
            await cancelBooking(selectedIdBooking);
            await fetchDataBooking();
            setOpenAlertDialog(false);
            toaster.create({
                title: 'berhasil cancel booking',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setSelectedIdBooking('');
            setLoading(false);
        }
    };

    const handlePlayBooking = async (id_station, billing) => {
        setLoading(true);
        try {
            await playBooking(id_station, billing);
            toaster.create({
                description: 'Berhasil memulai booking. untuk informasi lebih lanjut. lihat di station',
                type: 'success',
            });
            await fetchDataBooking();
        } catch (error) {
            toaster.create({
                description: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* EDIT DIALOG */}
            {openEditDialog && (
                <BookingDialog openDialog={openEditDialog} setOpenDialog={setOpenEditDialog} editData={editData} />
            )}
            {/* END EDIT DIALOG */}
            {/* DETAIL DIALOG */}
            <DialogLayout
                size={'lg'}
                titleHeader={'Detail Booking'}
                open={openDetail}
                setOpen={e => setOpenDetail(e.open)}
            >
                {selectedIdBooking && <BookingDetail id_booking={selectedIdBooking} />}
            </DialogLayout>
            {/* DETAIL DIALOG */}

            {/* HAPUS DIALOG */}
            <AlertDialog
                openAlert={openAlertDialog}
                onOpenChange={e => setOpenAlertDialog(e.open)}
                onClick={handleCancelBooking}
                loading={loading}
                headerTitle={'hapus booking'}
            >
                Yakin ingin menghapus booking? data akan tersimpan di riwayat booking dengan status cancel
            </AlertDialog>
            {/* END HAPUS DIALOG */}
            {bookingItems.length === 0 ? (
                <EmptyState description="Silakan tambahkan data booking terlebih dahulu" title="Data booking kosong" />
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems={'center'}
                    mt={2}
                    justifyContent="space-between"
                    minH="max-content"
                    mb={10}
                >
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
                                    handleStatusExpired(val.id_booking);
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
                                        <Table.Cell>
                                            <Badge colorPalette={statusColor[val?.status]} variant={'surface'}>
                                                {formatStatusToId(val?.status)}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <HStack gap={2}>
                                                {val?.status === 'booking' ? (
                                                    <>
                                                        <IconButton
                                                            size={'xs'}
                                                            aria-label="edit"
                                                            bg={'green.600'}
                                                            _hover={{
                                                                bg: 'green.700',
                                                            }}
                                                            color={'white'}
                                                            loading={loading}
                                                            rounded={'md'}
                                                            disabled={!booking?.canStart}
                                                            onClick={() =>
                                                                handlePlayBooking(val?.id_station, val?.billing)
                                                            }
                                                        >
                                                            <FaPlay />
                                                        </IconButton>
                                                        <EditDeleteButton
                                                            onClickEdit={() => {
                                                                setEditData({
                                                                    id_booking: val?.id_booking,
                                                                    customer_name: val?.customer_name,
                                                                    station: val?.id_station,
                                                                    booking_date: val?.booking_date,
                                                                    booking_start: String(val?.booking_start).slice(
                                                                        0,
                                                                        5,
                                                                    ),
                                                                    duration: Number(val?.billing),
                                                                    number_phone: val?.number_phone,
                                                                });
                                                                setOpenEditDialog(true);
                                                            }}
                                                            disabled={val?.status !== 'booking'}
                                                            loading={loading}
                                                            onCLickDelete={() => {
                                                                setOpenAlertDialog(true);
                                                                setSelectedIdBooking(val?.id_booking);
                                                            }}
                                                        />
                                                    </>
                                                ) : (
                                                    <HoverCardComponent>
                                                        <Box p={2} rounded={'md'} color={'orange'}>
                                                            <FaInfo />
                                                        </Box>
                                                    </HoverCardComponent>
                                                )}
                                            </HStack>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Link
                                                as={'button'}
                                                variant={'underline'}
                                                colorPalette="cyan"
                                                onClick={() => {
                                                    setSelectedIdBooking(val?.id_booking);
                                                    setOpenDetail(true);
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
                    {bookingItems.length > 15 && (
                        <Paginations pageSize={pageSize} page={page} setPage={setPage} items={bookingItems} />
                    )}
                </Box>
            )}
        </>
    );
};

export default TableBookingActive;
