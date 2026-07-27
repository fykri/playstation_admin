import NavbarLayout from '@/layout/NavbarLayout';
import { Grid, Box, GridItem } from '@chakra-ui/react';
import RevenueReport from './revenueReport';
import DailyIncomeReport from './DailyIncome';
const ReportPages = () => {
    return (
        <NavbarLayout header={'REPORT'}>
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
                    h="60"
                    order={{ base: '1', lg: '2' }}
                    bg={'var(--color-container)'}
                    borderWidth={'1px'}
                    borderColor={'gray.800'}
                    borderRadius={'md'}
                    py={2}
                    px={3}
                    shadow={'xs'}
                >
                    <DailyIncomeReport/>
                </Box>
            </Grid>
        </NavbarLayout>
    );
};

export default ReportPages;
