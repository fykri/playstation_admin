import { Box, Text, HStack, Button } from '@chakra-ui/react';
import RevenueReportComponent from './components/RevenueCard';
import { useReportStore } from '@/stores/useReportStore';

//    {
//        periode: 'today',
//        title: 'Hari ini',
//    },
//    {
//        periode: 'week',
//        title: 'Minggu Ini',
//    },
//    {
//        periode: 'month',
//        title: 'Bulan Ini',
//    },
//    {
//        periode: 'year',
//        title: 'Tahun Ini',
//    },
//    {
//        periode: 'costum',
//        title: 'Rentang Tanggal',
//    },
//];
const RevenueReport = () => {
    const itemsRevenue = useReportStore(state => state.itemsRevenue);

    return (
        <Box
            fontSize={'sm'}
            py={2}
            base={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            md={{ alignItems: 'start' }}
        >
            <RevenueReportComponent data={itemsRevenue} />
        </Box>
    );
};

export default RevenueReport;
