import DialogLayout from '@/layout/DialogLayout';
import {
    HStack,
    VStack,
    Box,
    Status,
    List,
    Heading,
    Text,
    Input,
    Select,
    Stack,
    Span,
    NumberInput,
    createListCollection,
    Icon,
    parseDate,
} from '@chakra-ui/react';
import InputContainer from '@/components/input/InputContainer';
import FieldRootLabel from '@/components/FieldRoot';
import SelectContainer from '@/components/select/SelectContainer';
import DatePickerUi from '@/components/DatePicker';
import { useState, useEffect } from 'react';
import { toaster } from '@/components/ui/toaster';
import { postBooking, updateDataBooking, getBookingActive } from '@/api/booking';
import { getAllStation } from '@/api/station';
import { setDate } from '@/utils/formatDate';
import { validateData } from '@/utils/validate';
import Scroll from '@/components/Scroll';
import { getSessionActive } from '@/api/session';
import { LuUser, LuCalendarDays } from 'react-icons/lu';
import { useBookingStore } from '@/stores/useBookingStore';

const checkDateIsInvalid = date => {
    if (!date || date.length === 0) return false;
    const selected = new Date(date);
    const today = new Date();
    selected.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return selected < today;
};

const checkTimeIsInvalid = (date, time) => {
    if (!date || !time) return false;
    const bookingDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();
    return bookingDateTime <= now;
};

const BookingDialog = ({ openDialog, setOpenDialog, editData = null }) => {
    const isEditMode = !!editData;

    const [formInput, setFormInput] = useState({
        costumer_name: '',
        number_phone: '',
        station: [],
        booking_date: [],
        booking_start: '',
        duration: 1,
    });
    const [loading, setLoading] = useState(false);
    const [stationItems, setStationItems] = useState([]);
    const fetchDataBooking = useBookingStore(state => state.fetchDataBooking);
    const inputSelectStationValue = createListCollection({
        items: stationItems,
        itemToString: e => e?.name_station,
        itemToValue: e => e?.id_station,
    });

    const [alertTime, setAlertTime] = useState('');
    const [bookingItemsActive, setBookingItemsActive] = useState([]);
    const [sessionItemsActive, setSessionItemsActive] = useState([]);
    const [bookingEmpty, setBookingEmpty] = useState('');
    const [sessionEmpty, setSessionEmpty] = useState('');

    const fetchStation = async () => {
        setLoading(true);
        try {
            const result = await getAllStation();
            setStationItems(result);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBooking = async () => {
        toaster.dismiss();
        setLoading(true);
        try {
            validateData({
                costumer_name: formInput.costumer_name,
                number_phone: formInput.number_phone,
                station: formInput.station,
                booking_date: formInput.booking_date,
                booking_start: formInput.booking_start,
                duration: formInput.duration,
            });

            const payload = {
                id_station: formInput.station[0],
                customer_name: formInput.costumer_name,
                number_phone: formInput.number_phone,
                booking_date: setDate(formInput.booking_date[0]),
                booking_start: formInput.booking_start,
                duration: formInput.duration,
            };

            const result = isEditMode
                ? await updateDataBooking(editData.id_booking, payload)
                : await postBooking(payload);

            toaster.create({
                type: 'success',
                title: result.message || (isEditMode ? 'Booking berhasil diperbarui' : 'Booking berhasil ditambahkan'),
            });

            await fetchDataBooking();
            handleClose();
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const bookingActive = async () => {
        setBookingEmpty('');
        try {
            const result = await getBookingActive();
            const filteredData = isEditMode
                ? result.data.filter(val => val.id_booking !== editData.id_booking)
                : result.data;

            setBookingItemsActive(filteredData);
        } catch (error) {
            setBookingEmpty(error.message);
        }
    };

    const sessionActive = async () => {
        setSessionEmpty('');
        try {
            const result = await getSessionActive();
            setSessionItemsActive(result.data);
        } catch (error) {
            setSessionEmpty(error.message);
        }
    };

    useEffect(() => {
        if (bookingItemsActive.length === 0) {
            setBookingEmpty('tidak ada booking yang bentrok');
            return;
        }
    }, [bookingItemsActive]);

    useEffect(() => {
        if (openDialog) {
            fetchStation();
            bookingActive();
            sessionActive();

            if (isEditMode) {
                setFormInput({
                    costumer_name: editData.customer_name,
                    number_phone: editData.number_phone,
                    station: [editData.station],
                    booking_date: [parseDate(editData.booking_date)],
                    booking_start: editData.booking_start,
                    duration: editData.duration || 1,
                });
            } else {
                resetField();
            }
        }
    }, [openDialog, editData]);

    useEffect(() => {
        if (formInput.booking_date?.length > 0) {
            const originalDateStr = editData ? editData.booking_date.split('T')[0] : null;
            const currentFieldDateStr = setDate(formInput.booking_date[0]);

            const isDateChanged = originalDateStr !== currentFieldDateStr;

            const isTimeChanged = editData ? editData.booking_start !== formInput.booking_start : true;

            if ((!editData || isDateChanged) && checkDateIsInvalid(formInput.booking_date[0])) {
                setAlertTime('Tanggal sudah lewat, silakan pilih tanggal yang valid.');
                return;
            }

            if (
                formInput.booking_start &&
                (!editData || isDateChanged || isTimeChanged) &&
                checkTimeIsInvalid(currentFieldDateStr, formInput.booking_start)
            ) {
                setAlertTime('Jam sudah lewat, silakan pilih jam yang valid.');
                return;
            }
        }

        setAlertTime('');
    }, [formInput.booking_date, formInput.booking_start, editData]);

    const resetField = () => {
        setFormInput({
            costumer_name: '',
            number_phone: '',
            station: [],
            booking_date: [],
            booking_start: '',
            duration: 1,
        });
    };

    const handleClose = () => {
        resetField();
        setOpenDialog(false);
    };

    return (
        <DialogLayout
            size={'xl'}
            cancelTitle={'Batal'}
            saveTitle={isEditMode ? 'Simpan Perubahan' : 'Tambah Booking'}
            onClick={handleSaveBooking}
            titleHeader={isEditMode ? 'Edit Booking' : 'Tambah Booking'}
            loading={loading}
            open={openDialog}
            setOpen={e => {
                if (!e.open) handleClose();
            }}
            alert={alertTime}
        >
            <HStack w={'full'} gap={4} align={'stretch'}>
                {/* Bagian Kiri: Informasi Sidebar */}
                <HStack w="1/2" h={'470px'} align="start">
                    <VStack
                        w="full"
                        h={'full'}
                        align="stretch"
                        gap={6}
                        p={5}
                        borderWidth="1px"
                        rounded="lg"
                        bg="bg.panel"
                    >
                        {/* Station Aktif */}
                        <Box>
                            <HStack mb={3}>
                                <Status.Root colorPalette="green">
                                    <Status.Indicator />
                                </Status.Root>
                                <Heading size="sm">Station Sedang Aktif</Heading>
                            </HStack>
                            {sessionEmpty ? (
                                <Text color={'red.200'} pl={4}>
                                    {sessionEmpty}
                                </Text>
                            ) : (
                                <List.Root mt={2} gap={2} ps={7}>
                                    {sessionItemsActive.map(val => (
                                        <List.Item key={val?.id_session}>
                                            <b>
                                                {val?.start_time} - {val?.end_time}
                                            </b>{' '}
                                            • {val?.name_station}
                                        </List.Item>
                                    ))}
                                </List.Root>
                            )}
                        </Box>

                        {/* Informasi Booking Aktif */}
                        <VStack h={'full'} align={'stretch'} overflow={'hidden'}>
                            <HStack mb={1}>
                                <Status.Root colorPalette="orange">
                                    <Status.Indicator />
                                </Status.Root>
                                <Heading size="sm">Informasi Booking</Heading>
                            </HStack>
                            {bookingEmpty ? (
                                <Text color={'red.200'} pl={4}>
                                    {bookingEmpty}
                                </Text>
                            ) : (
                                <Scroll>
                                    {bookingItemsActive.map((val, idx) => (
                                        <VStack align="stretch" gap={3} key={val?.id_booking}>
                                            <Box pl={3}>
                                                <HStack gap={2}>
                                                    <Icon as={LuCalendarDays} color="orange.500" boxSize={4} />
                                                    <Text fontWeight="bold" color="orange.500">
                                                        {val?.booking_date}
                                                    </Text>
                                                </HStack>
                                                <List.Root mt={2} gap={2} ps={7}>
                                                    {val?.booking.map((items, idx) => (
                                                        <List.Item key={idx}>
                                                            <VStack align="start" gap={0}>
                                                                <HStack gap={2}>
                                                                    <Text fontWeight="bold">
                                                                        {items.booking_start} - {items.booking_end} ||{' '}
                                                                        {items.name_station}
                                                                    </Text>
                                                                    <Icon
                                                                        ml={4}
                                                                        as={LuUser}
                                                                        boxSize={4}
                                                                        color="gray.400"
                                                                    />
                                                                    <Text fontSize="sm" color="gray.500">
                                                                        {items.customer_name}
                                                                    </Text>
                                                                </HStack>
                                                            </VStack>
                                                        </List.Item>
                                                    ))}
                                                </List.Root>
                                            </Box>
                                        </VStack>
                                    ))}
                                </Scroll>
                            )}
                        </VStack>
                    </VStack>
                </HStack>

                {/* Bagian Kanan: Form Input */}
                <VStack gap={4} w={'1/2'} h={'full'}>
                    <InputContainer
                        label={'Nama Pelanggan'}
                        placeholder={'masukkan nama pelanggan'}
                        value={formInput.costumer_name}
                        onChange={e => setFormInput(items => ({ ...items, costumer_name: e.target.value }))}
                    />

                    <FieldRootLabel label={'Nomor Hp'}>
                        <Input
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            value={formInput.number_phone}
                            onChange={e => {
                                const hanyaAngka = e.target.value.replace(/\D/g, '');
                                setFormInput(items => ({ ...items, number_phone: hanyaAngka }));
                            }}
                        />
                    </FieldRootLabel>

                    <SelectContainer
                        label={'Station'}
                        placeholder={'pilih station'}
                        collection={inputSelectStationValue}
                        value={formInput.station}
                        onValueChange={e => setFormInput(items => ({ ...items, station: e.value ?? [] }))}
                    >
                        {stationItems.map(items => (
                            <Select.Item item={items} key={items.id_station}>
                                <Stack gap={1}>
                                    <Select.ItemText>{items.name_station}</Select.ItemText>
                                    <Span color={'fg.muted'} textStyle={'xs'}>
                                        {`${items?.console_type} - ${items?.package}`}
                                    </Span>
                                </Stack>
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </SelectContainer>

                    <DatePickerUi
                        label={'Tanggal Booking'}
                        value={formInput.booking_date}
                        onChange={e => setFormInput(items => ({ ...items, booking_date: e.value }))}
                    />

                    <FieldRootLabel label={'Jam Mulai'}>
                        <Input
                            type="time"
                            value={formInput.booking_start}
                            onChange={e => setFormInput(items => ({ ...items, booking_start: e.target.value }))}
                        />
                    </FieldRootLabel>

                    <FieldRootLabel label={'Durasi Main (Jam)'}>
                        <NumberInput.Root
                            min={1}
                            max={24}
                            value={formInput.duration.toString()}
                            w={'full'}
                            onValueChange={e => setFormInput(items => ({ ...items, duration: e.value }))}
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </FieldRootLabel>
                </VStack>
            </HStack>
        </DialogLayout>
    );
};

export default BookingDialog;
