import { Select, Portal } from '@chakra-ui/react';

const SelectContainer = ({ collection, label, children, value, placeholder, onValueChange }) => {
    return (
        <Select.Root collection={collection} size="sm" value={value} onValueChange={onValueChange}>
            <Select.HiddenSelect />
            <Select.Label>{label}</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder={placeholder} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>{children}</Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default SelectContainer;
