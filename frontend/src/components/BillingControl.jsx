import { HStack, NumberInput, IconButton } from '@chakra-ui/react';
import { LuMinus, LuPlus } from 'react-icons/lu';
const BillingControl = ({ billing, onChange }) => {
    return (
        <NumberInput.Root
            defaultValue={1}
            value={billing}
            spinOnPress={false}
            unstyled
            min={1}
            onValueChange={onChange}
        >
            <HStack gap={0}>
                <NumberInput.DecrementTrigger asChild>
                    <IconButton variant="outline" size="xs">
                        <LuMinus />
                    </IconButton>
                </NumberInput.DecrementTrigger>
                <NumberInput.ValueText textAlign="center" fontSize="sm" minW="4ch" />
                <NumberInput.IncrementTrigger asChild>
                    <IconButton variant="outline" size="xs">
                        <LuPlus />
                    </IconButton>
                </NumberInput.IncrementTrigger>
            </HStack>
        </NumberInput.Root>
    );
};

export default BillingControl;
