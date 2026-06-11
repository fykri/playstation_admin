import { Grid } from '@chakra-ui/react';
import CardStation from './CardStation';
import { formatRupiah } from '@/utils/formatNumber';
import { useBillingStore } from '@/stores/useStationStore';
import { useShallow } from 'zustand/react/shallow';
const RenderStationCards = ({ items, onDelete, onEdit }) => {
    const { setBilling } = useBillingStore(
        useShallow(state => ({
            setBilling: state.setBilling,
        })),
    );
    return (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={7} mt={2} mb={6}>
            {items.map(val => (
                <CardStation
                    key={val?.id_station}
                    onClickDelete={() => {
                        onDelete(val);
                    }}
                    onClickEdit={() => {
                        onEdit(val);
                    }}
                    status={val.status}
                    onChangeBilling={valueItems => {
                        setBilling(val.id_station, valueItems.valueAsNumber);
                    }}
                    nameConsole={val.console_type?.toUpperCase()}
                    namePackage={val.package?.toUpperCase()}
                    nameStation={val.name_station?.toUpperCase()}
                    price={`Rp. ${formatRupiah(val.new_price)}`}
                    id_station={val.id_station}
                    time={val?.billing}
                />
            ))}
        </Grid>
    );
};

export default RenderStationCards;
