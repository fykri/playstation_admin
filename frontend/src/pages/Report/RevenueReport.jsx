import { Box, Text, HStack, Button } from '@chakra-ui/react';
import RevenueReportComponent from './components/RevenueCard';
import { useReportStore } from '@/stores/useReportStore';
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
