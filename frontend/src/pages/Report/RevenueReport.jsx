import { Box, Text, HStack, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getRevenue } from '@/api/report';
import { toaster } from '@/components/ui/toaster';
import RevenueReportComponent from './components/RevenueCard';
import DatePickerUi from '@/components/DatePicker';
import { setDate } from '@/utils/formatDate';

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
const RevenueReport = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [revenueItems, setRevenueItems] = useState({});
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleRevenueItems = async () => {
        try {
            const result = await getRevenue(selectedPeriod, setDate(startDate[0]), setDate(endDate[0]));
            setRevenueItems(result?.data);
        } catch (error) {
            toaster.dismiss();
            toaster.create({
                title: error.message,
                type: error,
            });
        }
    };

    useEffect(() => {
        if (selectedPeriod === 'costum') return;
        handleRevenueItems();
    }, [selectedPeriod]);

    return (
        <Box
            fontSize={'sm'}
            base={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            md={{ alignItems: 'start' }}
        >
            <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={3}>
                Filter Periode
            </Text>
            <HStack wrap={'wrap'} gap={3} justifyContent={'center'} md={{ justifyContent: 'start' }}>
                {periodeFilterData.map(val => (
                    <Button
                        key={val.periode}
                        variant={selectedPeriod === val.periode ? 'solid' : 'outline'}
                        onClick={() => setSelectedPeriod(val.periode)}
                        size={'sm'}
                    >
                        {val.title}
                    </Button>
                ))}
            </HStack>
            {selectedPeriod === 'costum' && (
                <HStack mt={3}>
                    <DatePickerUi value={startDate} onChange={e => setStartDate(e.value)} />

                    <Text color="fg.muted">→</Text>
                    <DatePickerUi value={endDate} onChange={e => setEndDate(e.value)} />

                    <Button colorPalette={'cyan'} variant={'surface'} onClick={handleRevenueItems}>
                        Terapkan
                    </Button>
                </HStack>
            )}
            <RevenueReportComponent data={revenueItems} />
        </Box>
    );
};

export default RevenueReport;
