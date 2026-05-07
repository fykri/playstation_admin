import { Box, HStack, Badge, VStack, Heading, Text } from "@chakra-ui/react";

const CardHeadStation = ({status, namePackage, nameStation, nameConsole}) => {
    return (
        <Box flex={1} w={'95%'} color={'var(--color-secondary)'} borderTop={'2px solid gray'}>
            <HStack justifyContent={'space-between'} mt={1}>
                <Badge variant={'surface'}>{namePackage}</Badge>
                <Badge>
                    {status}
                </Badge>
            </HStack>
            <VStack gap={0.5} mt={2} color={'var(--color-secondary)'} position={'relative'}>
                <Heading letterSpacing={0.5} size={'2xl'}>
                    {' '}
                    {nameStation}
                </Heading>
                <Text letterSpacing={0.5} fontSize={'sm'}>
                    {nameConsole}
                </Text>
            </VStack>
        </Box>
    );
};

export default CardHeadStation;
