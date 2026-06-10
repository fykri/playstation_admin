import { VStack, Badge, HStack, Text, Button } from '@chakra-ui/react';
import { useBillingStore } from '@/stores/useStationStore';
import BillingControl from '../BillingControl';
const CardBodyStationEmpty = ({ price, onChange, onClickStart, billing }) => {
    const loading = useBillingStore(state => state.loadingStoreStation);
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
                onClick={onClickStart}
            >
                MULAI
            </Button>
        </VStack>
    );
};

export default CardBodyStationEmpty;
