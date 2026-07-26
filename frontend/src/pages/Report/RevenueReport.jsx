import { Box, Text, HStack, Button } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getRevenue } from '@/api/report';
import { toaster } from '@/components/ui/toaster';
import RevenueReportComponent from './components/RevenueCard';
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

    console.log('selected period: ', selectedPeriod);
    console.log('revenueItems: ', revenueItems);

    const handleRevenueItems = async () => {
        try {
            const result = await getRevenue(selectedPeriod);
            setRevenueItems(result?.data);
        } catch (error) {
            toaster.create({
                title: error.message,
                type: error,
            });
        }
    };

    useEffect(() => {
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
            <RevenueReportComponent data={revenueItems} />
        </Box>
    );
};

export default RevenueReport;
