import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "../components/navbar/SideBar";

const NavbarLayout = ({ children }) => {
    return (
        <Flex>
            <Sidebar></Sidebar>
            <Box flex={1} pt={"11"} px={"8"}>
                {children}
            </Box>
        </Flex>
    );
};

export default NavbarLayout;
