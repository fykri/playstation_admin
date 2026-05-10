import { Select, Span, Stack } from '@chakra-ui/react';
import { formatRupiah } from '@/utils/formatNumber';
import SelectContainer from './SelectContainer';
const SelectInputConsole = ({ collection, value, onValueChange, data }) => {
    return (
        <SelectContainer
            collection={collection}
            label={'console'}
            placeholder={'pilih console'}
            value={value}
            onValueChange={onValueChange}
        >
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
        </SelectContainer>
    );
};

export default SelectInputConsole;
