import { VStack, Badge, HStack, NumberInput, IconButton, Text, Button, Box, Icon } from '@chakra-ui/react';
import { LuSquare, LuX, LuPause } from 'react-icons/lu';
import { Tooltip } from './../ui/tooltip';
const CardBodyStationUsed = () => {
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
            <Badge variant={'surface'}>Aksi coy</Badge>
            <HStack w={'full'} mt={1} gap={6} justifyContent={'space-evenly'}>
                <Box>
                    <Text fontSize={'xs'} color={'gray.300'}>
                        sisa waktu
                    </Text>
                    <Text fontSize={'xs'} fontWeight="bold" letterSpacing="2px" transform="translateY(2px)">
                        00:00:00
                    </Text>
                </Box>
                <Box>
                    <Text fontSize={'xs'} color={'gray.300'}>
                        3 jam
                    </Text>
                    <Text fontSize={'xs'} fontWeight={'bold'} transform="translateY(2px)">
                        RP. 20.000
                    </Text>
                </Box>
            </HStack>
            <HStack gap={'4'}>
                <Tooltip content={'pause'}>
                    <IconButton size={'xs'} colorPalette={'yellow'}>
                        <LuPause />
                    </IconButton>
                </Tooltip>
                <Tooltip content={'cancel'}>
                    <IconButton size={'xs'} colorPalette={'red'} variant={'outline'}>
                        <LuX />
                    </IconButton>
                </Tooltip>
                <Tooltip content="finish">
                    <IconButton size={'xs'} colorPalette={'blue'}>
                        <LuSquare />
                    </IconButton>
                </Tooltip>
            </HStack>
        </VStack>
    );
};

export default CardBodyStationUsed;
