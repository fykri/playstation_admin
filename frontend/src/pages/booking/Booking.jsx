import NavbarLayout from '@/layout/NavbarLayout';
import { Tabs, Button, VStack, Box } from '@chakra-ui/react';
import { LuCalendarCheck, LuHistory } from 'react-icons/lu';
import { useState} from 'react';
import BookingDialog from './BookingDialog';
import TableBookingActive from './TableBookingActive';
import HistoryBooking from './HistoryBooking';

const Booking = () => {
    const [openDialog, setOpenDialog] = useState(false);
    return (
        <NavbarLayout header={'BOOKING'}>
            {openDialog && <BookingDialog openDialog={openDialog} setOpenDialog={setOpenDialog} editData={null} />}
            <Tabs.Root defaultValue={'bookingAktif'} mt={6} lazyMount unmountOnExit>
                <Tabs.List>
                    <Tabs.Trigger value="bookingAktif">
                        <LuCalendarCheck />
                        Booking Aktif
                    </Tabs.Trigger>
                    <Tabs.Trigger value="riwayatBooking">
                        <LuHistory />
                        Riwayat Booking
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="bookingAktif">
                    <VStack gap={5} mt={2} alignItems={'start'}>
                        <Button onClick={() => setOpenDialog(true)} colorPalette={'cyan'} variant={'surface'}>
                            Tambah Data Booking{' '}
                        </Button>
                        <Box w={'full'}>
                            <TableBookingActive />
                        </Box>
                    </VStack>
                </Tabs.Content>
                <Tabs.Content value="riwayatBooking">
                    <HistoryBooking/>
                </Tabs.Content>
            </Tabs.Root>
        </NavbarLayout>
    );
};

export default Booking;
