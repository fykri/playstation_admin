import { Flex, Spacer, Avatar, Text } from "@chakra-ui/react";

const Topbar = () => {
    return (
        <Flex
            
            p={4}
            borderBottom="1px"
            borderColor="gray.200"
            align="center"
        >
            <Text fontWeight="bold">Dashboard</Text>

            <Spacer />

            <Avatar.Root>
                <Avatar.Fallback name="Admin" />
            </Avatar.Root>
        </Flex>
    );
};

export default Topbar;
