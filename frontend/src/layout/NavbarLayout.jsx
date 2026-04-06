import { Flex, Box, Heading } from '@chakra-ui/react';
import Sidebar from '../components/navbar/SideBar';

const NavbarLayout = ({ children, header }) => {
    return (
        <Flex>
            <Sidebar></Sidebar>
            <Box flex={1} pt={'11'} px={'8'}>
                <Heading borderBottom={'1px solid white'} size={'2xl'} letterSpacing={2} color={'var(--color-secondary)'}>
                    {header}
                </Heading>
                {children}
            </Box>
        </Flex>
    );
};

export default NavbarLayout;
