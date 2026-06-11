import { VStack, Badge, HStack, Text, Button } from '@chakra-ui/react';
import { useBillingStore } from '@/stores/useStationStore';
import BillingControl from '../BillingControl';
import { useShallow } from 'zustand/react/shallow';
const CardBodyStationEmpty = ({ price, onChange, billing, id_station }) => {
    const { startStation, loading } = useBillingStore(
        useShallow(state => ({
            startStation: state.startStation,
            loading: state.loadingStoreStation
        })),
    );
    return (
        <VStack
            flex={2}
            mt={3}
            justifyContent={'space-around'}
            w={'100%'}
            borderBottom={'2px solid gray'}
            boxShadow={'md'}
            rounded={'sm'}
        >
            <Badge variant={'surface'}>Action</Badge>
            <HStack w={'full'} mt={1} gap={6} justifyContent={'center'}>
                <BillingControl billing={billing} onChange={onChange} />
                <Text fontSize={'xs'}>{price}</Text>
            </HStack>
            <Button
                size={'xs'}
                rounded={'xs'}
                w={'full'}
                colorPalette={'teal'}
                loading={loading}
                loadingText="Loading"
                spinnerPlacement="start"
                onClick={() => {
                    if(!id_station || id_station === '') return
                    startStation(id_station, billing)
                }}
            >
                MULAI
            </Button>
        </VStack>
    );
};

export default CardBodyStationEmpty;
