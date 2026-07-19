import { VStack, Spinner, Text } from "@chakra-ui/react";
const SpinnerJsx = () => {
    return (
        <VStack colorPalette="teal" mt={10} display={'flex'} alignItems={'center'}>
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Loading...</Text>
        </VStack>
    );
};

export default SpinnerJsx;
