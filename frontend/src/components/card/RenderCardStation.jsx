import { Grid } from '@chakra-ui/react';
import CardStation from './CardStation';
import { formatRupiah } from '@/utils/formatNumber';
import { useBillingStore } from '@/stores/useStationStore';
const RenderStationCards = ({ items, onDelete, onEdit }) => {
    const setBilling = useBillingStore((state)=> state.setBilling)
    return (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={7} mt={2} mb={6}>
            {items.map((val, index) => (
                <CardStation
                    key={index}
                    onClickDelete={() => {
                        onDelete(val);
                    }}
                    onClickEdit={() => {
                        onEdit(val);
                    }}
                    onChangeBilling={(valueItems)=> {
                        setBilling(val.id_station, valueItems.valueAsNumber)
                    }}
                    nameConsole={val.console_type?.toUpperCase()}
                    namePackage={val.package?.toUpperCase()}
                    nameStation={val.name_station?.toUpperCase()}
                    price={`Rp. ${formatRupiah(val.new_price)}`}
                />
            ))}
        </Grid>
    );
};

export default RenderStationCards;
