import { Flex, Box, Heading, HStack, Text } from '@chakra-ui/react';
import Sidebar from '../components/navbar/SideBar';

const NavbarLayout = ({ children, header }) => {
    return (
        <Flex h="100vh" overflow="hidden">
            <Sidebar></Sidebar>
            <Box flex={1} pt={'11'} px={'8'} overflow={'auto'}>
                <HStack borderBottom={'1px solid white'} justifyContent={'space-between'}>
                    <Heading size={'2xl'} letterSpacing={3} color={'var(--color-secondary)'}>
                        {header}
                    </Heading>
                    <Text textStyle={'sm'} bg={'white'} color={'var(--color-primary)'} p={2} fontWeight={'semibold'} roundedTop={'md'}>
                        {' '}
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                </HStack>
                {children}
            </Box>
        </Flex>
    );
};

export default NavbarLayout;
