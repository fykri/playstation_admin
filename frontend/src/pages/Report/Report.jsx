import NavbarLayout from '@/layout/NavbarLayout';
import { Grid, Box, GridItem, Text, HStack, Button } from '@chakra-ui/react';
import RevenueReport from './revenueReport';
import DailyIncomeReport from './DailyIncome';
import { useState, useEffect } from 'react';
import DatePickerUi from '@/components/DatePicker';
import { useReportStore } from '@/stores/useReportStore';
import { useShallow } from 'zustand/react/shallow';
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

const ReportPages = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { handleRevenueItems, handleRevenueStation } = useReportStore(
        useShallow(state => ({
            handleRevenueItems: state.handleRevenueItems,
            handleRevenueStation: state.handleRevenueStation,
        })),
    );
    //const handleRevenueItems = useReportStore(state => state.handleRevenueItems);

    useEffect(() => {
        if (selectedPeriod === 'costum') return;
        handleRevenueItems(selectedPeriod, startDate, endDate);
        handleRevenueStation(selectedPeriod, startDate, endDate);
    }, [selectedPeriod]);

    return (
        <NavbarLayout header={'REPORT'}>
            <HStack wrap={'wrap'} gap={3} mt={5}>
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

                    <Button
                        colorPalette={'cyan'}
                        variant={'surface'}
                        onClick={() => handleRevenueItems(selectedPeriod, startDate, endDate)}
                    >
                        Terapkan
                    </Button>
                </HStack>
            )}

            <Grid templateColumns={{ xl: '52% 1fr' }} gap="4" mt={5}>
                <Box
                    shadow={'xs'}
                    bg={'var(--color-container)'}
                    order={{ base: '0' }}
                    borderWidth={'1px'}
                    borderColor={'gray.800'}
                    borderRadius={'md'}
                    py={3}
                    px={3}
                >
                    <RevenueReport />
                </Box>
                <GridItem rowSpan={'2'} order={{ base: '2', lg: '1' }}>
                    <Box
                        minH={'60'}
                        shadow={'xs'}
                        h={'full'}
                        bg={'var(--color-container)'}
                        borderWidth={'1px'}
                        borderColor={'gray.800'}
                        borderRadius={'md'}
                        py={2}
                        px={3}
                    />
                </GridItem>
                <Box
                    maxH={'285px'}
                    order={{ base: '1', lg: '2' }}
                    bg={'var(--color-container)'}
                    borderWidth={'1px'}
                    borderColor={'gray.800'}
                    borderRadius={'md'}
                    py={2}
                    px={3}
                    shadow={'xs'}
                >
                    <DailyIncomeReport />
                </Box>
            </Grid>
        </NavbarLayout>
    );
};

export default ReportPages;
