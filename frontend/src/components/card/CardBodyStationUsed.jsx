import { VStack, Badge, HStack, IconButton, Text, Box } from '@chakra-ui/react';
import { LuSquare, LuX } from 'react-icons/lu';
import { Tooltip } from './../ui/tooltip';
import { getEndTime, cancelledStation, addBilling } from '@/api/session';
import { formatRupiah } from '@/utils/formatNumber';
import { useEffect, useState } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { toaster } from '../ui/toaster';
import { useBillingStore } from '@/stores/useStationStore';
import AddTimePopover from '../addTimerPopover';

const CardBodyStationUsed = ({ id_station = '', onExpiredChange }) => {
    const [sessionTime, setSessionTime] = useState({
        endTime: null,
        statusSession: 'idle',
        totalPrice: 0,
        total_billing: 0,
    });

    const [loading, setLoading] = useState(false);

    const fetchStation = useBillingStore(state => state.fetchStation);
    const getTimeSession = async () => {
        setLoading(true);
        try {
            if (!id_station) return;

            const { data } = await getEndTime(id_station);
            setSessionTime({
                endTime: data?.end_time || null,
                statusSession: data?.status || '',
                totalPrice: Number(data?.total_price || 0),
                total_billing: Number(data?.total_billing),
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (sessionTime.endTime) {
            onExpiredChange?.(false);
        }
    }, [sessionTime.endTime]);

    useEffect(() => {
        getTimeSession();
    }, [id_station]);

    useCountdown({
        id_station: id_station,
        endTime: sessionTime.endTime,
        status: sessionTime.statusSession,
        onTimeUp: () => {
            onExpiredChange?.(true);
        },
    });

    const handleCancel = async () => {
        setLoading(true);
        try {
            if (!id_station) return;
            await cancelledStation(id_station);
            await fetchStation();
            onExpiredChange?.(false);
            toaster.dismiss();
            toaster.create({
                title: 'station cancel',
                type: 'info',
            });
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };
    const handleAddBilling = async hours => {
        setLoading(true);
        try {
            if (!id_station || id_station === '') return;
            await addBilling(id_station, hours);
            onExpiredChange?.(false);
            await getTimeSession();
            toaster.create({
                title: `berhasil tambah waktu ${hours}`,
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack
            flex={2}
            mt={3}
            justifyContent={'space-around'}
            w={'100%'}
            borderBottom={'2px solid gray'}
            boxShadow={'md'}
            rounded={'sm'}
            p={2}
        >
            <Badge variant={'surface'}>Aksi coy</Badge>

            <HStack w={'full'} mt={1} gap={6} justifyContent={'space-evenly'}>
                <Box>
                    <Text fontSize={'xs'} color={'gray.300'}>
                        sisa waktu
                    </Text>

                    <Text
                        id={`timer-display-${id_station}`}
                        fontSize={'xs'}
                        fontWeight="bold"
                        letterSpacing="2px"
                        transform="translateY(2px)"
                    >
                        --:--:--
                    </Text>
                </Box>
                <Box>
                    <Text fontSize={'xs'} color={'gray.300'}>
                        {`${sessionTime.total_billing} jam`}
                    </Text>
                    <Text fontSize={'xs'} color={'gray.200'}>
                        Rp. {formatRupiah(sessionTime.totalPrice)}
                    </Text>
                </Box>
            </HStack>

            <HStack gap={'4'}>
                <AddTimePopover
                    onAddTime={hours => {
                        handleAddBilling(hours);
                    }}
                />
                <Tooltip content={'batal'} showArrow>
                    <IconButton
                        size={'xs'}
                        colorPalette={'red'}
                        variant={'outline'}
                        onClick={handleCancel}
                        loading={loading}
                    >
                        <LuX />
                    </IconButton>
                </Tooltip>

                <Tooltip content="selesai" showArrow>
                    <IconButton size={'xs'} colorPalette={'blue'} loading={loading}>
                        <LuSquare />
                    </IconButton>
                </Tooltip>
            </HStack>
        </VStack>
    );
};

export default CardBodyStationUsed;
