import { Select, Portal, Span, Stack } from '@chakra-ui/react';
import { formatRupiah } from '@/utils/formatNumber';
const SelectInput = ({ collection, value, onValueChange, data }) => {
    return (
        <Select.Root
            collection={collection}
            size="sm"
            value={value}
            onValueChange={onValueChange}
        >
            <Select.HiddenSelect />
            <Select.Label>console</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Pilih Console" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {data?.items.map(val => (
                            <Select.Item item={val} key={val?.id_console} disabled={val?.qty == 0}>
                                <Stack gap={0}>
                                    <Select.ItemText>{val?.console_type}</Select.ItemText>
                                    <Span color="fg.muted" textStyle="xs">
                                        {`${val?.package} - Rp.${formatRupiah(val?.hourly_price)} (${val?.qty})`}
                                    </Span>
                                </Stack>
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
};

export default SelectInput;
