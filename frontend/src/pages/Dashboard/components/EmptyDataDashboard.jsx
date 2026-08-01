import { EmptyState, VStack, Box } from '@chakra-ui/react';
const EmptyDataDashboard = ({ icon, title, desc }) => {
    return (
        <Box
            h={'full'}
            display={'flex'}
            alignSelf={{ lg: 'center' }}
            w={'90%'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <EmptyState.Root size={'sm'}>
                <EmptyState.Content>
                    <EmptyState.Indicator>{icon}</EmptyState.Indicator>
                    <VStack textAlign="center">
                        <EmptyState.Title>{title}</EmptyState.Title>
                        <EmptyState.Description>{desc}</EmptyState.Description>
                    </VStack>
                </EmptyState.Content>
            </EmptyState.Root>
        </Box>
    );
};

export default EmptyDataDashboard;
