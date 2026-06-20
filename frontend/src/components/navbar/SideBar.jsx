import {
    Box,
    Heading,
    Text,
    Icon,
    HStack,
    Avatar,
    Flex,
} from "@chakra-ui/react";
import {
    MdDashboard,
    MdSportsEsports,
    MdAccessTime,
    MdEventAvailable,
    MdGamepad,
    MdBarChart,
    MdOutlineArrowBackIos,
    MdOutlineArrowForwardIos,
} from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaPlaystation } from "react-icons/fa";

const BarMenu = [
    { name: "Dashboard", icon: MdDashboard },
    { name: "Station", icon: MdSportsEsports },
    { name: "Session", icon: MdAccessTime },
    { name: "Booking", icon: MdEventAvailable },
    { name: "Consoles", icon: MdGamepad },
    { name: "Report", icon: MdBarChart },
];

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div
            className={` flex flex-col ${isOpen ? "w-65" : "w-22"} transition-all relative duration-150 min-h-screen! bg-(--color-container) border-r-2!`}
        >
            <HStack mt={8} pr={5} pl={4} mb={4} >
                <Box flex={2} display="flex" gap={4} h="62px">
                    <Avatar.Root display="flex" alignSelf={"center"} size="xl">
                        <FaPlaystation/>
                    </Avatar.Root>
                    {isOpen && (
                        <Flex direction="column" gap={1}>
                            <Heading
                                size="xl"
                                color="var(--color-secondary)"
                                fontWeight={"bold"}
                            >
                                PS ADMIN
                            </Heading>
                            <Text color="var(--color-secondary)" fontSize='sm'>
                                14/03/2006
                            </Text>
                        </Flex>
                    )}
                </Box>

                <Icon
                    boxSize={isOpen ? 10 : 9}
                    p={2}
                    alignContent="center"
                    position="absolute"
                    right={-5}
                    bg="var(--color-secondary)"
                    rounded="sm"
                    color="var(--color-primary)"
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    {isOpen ? (
                        <MdOutlineArrowBackIos />
                    ) : (
                        <MdOutlineArrowForwardIos />
                    )}
                </Icon>
            </HStack>
            <Flex p={3} mt={3} h="svh" direction="column">
                <Box as="ul" listStylePosition="inside">
                    {BarMenu.map((item, index) => {
                        return (
                            <li key={index}>
                                <NavLink
                                    to={`/${item.name.toLowerCase()}`}
                                    className={({ isActive }) =>
                                        `flex items-center gap-5 p-4! rounded-sm ${
                                            isActive
                                                ? "bg-(--color-secondary) text-(--color-primary)!"
                                                : "text-(--color-secondary) hover:bg-[#dadbdb] hover:text-(--color-primary)!"
                                        }`
                                    }
                                >
                                    <Icon size="xl" as={item.icon} />
                                    {isOpen && (
                                        <Text fontSize={16} fontWeight={"semibold"}>{item.name}</Text>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </Box>
            </Flex>
        </div>
    );
};

export default SideBar;
