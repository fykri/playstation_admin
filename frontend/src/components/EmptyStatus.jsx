import { VStack, Text } from '@chakra-ui/react';
import { LuPackageOpen } from 'react-icons/lu';

const EmptyStatus = ({
    icon: Icon = LuPackageOpen,
    title = 'Data tidak ditemukan',
    description = '',
}) => {
    return (
        <VStack
            py={10}
            minH="180px"
            px={6}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            gap={3}
            mt={2}
            w="full"
        >
            <Icon size={40} opacity={0.5} />

            <Text fontSize="lg" fontWeight="semibold">
                {title}
            </Text>

            {description && (
                <Text fontSize="sm" color="fg.muted" textAlign="center">
                    {description}
                </Text>
            )}
        </VStack>
    );
};

export default EmptyStatus;