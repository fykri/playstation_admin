import NavbarLayout from '@/layout/NavbarLayout';
import CardStation from '@/components/card/CardStation';
import { Text, Box, Button, Status, Grid, HStack } from '@chakra-ui/react';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

const Station = () => {
    return (
        <NavbarLayout header={'STATION'}>
            {/* Card */}
            <Button mt={8}>Tambah Meja</Button>
            <Box>
                <HStack alignItems={'center'} mt={5} color={'green.200'}>
                    <FiCheckCircle />
                    <Text fontSize="md" fontWeight="bold">
                        Kosong (5)
                    </Text>
                </HStack>
                <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={7} mt={4} mb={6}>
                    <CardStation></CardStation>
                    <CardStation></CardStation>
                    <CardStation status='dipakai'></CardStation>
                    <CardStation></CardStation>
                    <CardStation></CardStation>
                    <CardStation></CardStation>
                </Grid>
            </Box>

            <HStack alignItems={'center'} mt={5} color={'red.200'}>
                <FiClock />
                <Text fontSize="md" fontWeight="bold">
                    Dipakai (5)
                </Text>
            </HStack>
            {/* End Card */}
        </NavbarLayout>
    );
};

export default Station;
