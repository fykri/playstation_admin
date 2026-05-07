import { VStack, Badge, HStack, NumberInput, IconButton, Text, Button } from '@chakra-ui/react';
import { LuMinus, LuPlus } from 'react-icons/lu';
const CardBodyStationEmpty = ({price}) => {
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
                <NumberInput.Root defaultValue="1" spinOnPress={false} unstyled min={1}>
                    <HStack gap={0}>
                        <NumberInput.DecrementTrigger asChild>
                            <IconButton variant="outline" size="xs">
                                <LuMinus />
                            </IconButton>
                        </NumberInput.DecrementTrigger>
                        <NumberInput.ValueText textAlign="center" fontSize="sm" minW="4ch" />
                        <NumberInput.IncrementTrigger asChild>
                            <IconButton variant="outline" size="xs">
                                <LuPlus />
                            </IconButton>
                        </NumberInput.IncrementTrigger>
                    </HStack>
                </NumberInput.Root>
                <Text fontSize={'xs'}>{price}</Text>
            </HStack>
            <Button size={'xs'} rounded={'xs'} w={'full'} colorPalette={'green'}>
                MULAI
            </Button>
        </VStack>
    );
};

export default CardBodyStationEmpty;
