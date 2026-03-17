import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "../components/navbar/SideBar";

const NavbarLayout = ({ children }) => {
    return (
        <Flex>
            <Sidebar></Sidebar>
            {children}
        </Flex>
    );
};

export default NavbarLayout;
