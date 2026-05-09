import { Grid } from '@chakra-ui/react';
import CardStation from './CardStation';
import { formatRupiah } from '@/utils/formatNumber';
const RenderStationCards = ({ items, onDelete, onEdit }) => (
    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={7} mt={2} mb={6}>
        {items.map((val, index) => (
            <CardStation
                key={index}
                onClickDelete={() => {
                    onDelete(val);
                    //setAlertDelete(true);
                    //setDeleteField({
                    //    id_station: val.id_station,
                    //    name_console: val.console_type,
                    //    name_station: val.name_station,
                    //});
                }}
                onClickEdit={() => {
                    //setIdStationEdit(val.id_station);
                    //setCurrentConsoleId(val.id_console);
                    //setSelectedConsole([String(val.id_console)]);
                    //setNameConsole(val.name_station);
                    //setOpenEditDialog(true);
                    onEdit(val);
                }}
                nameConsole={val.console_type?.toUpperCase()}
                namePackage={val.package?.toUpperCase()}
                nameStation={val.name_station?.toUpperCase()}
                price={`Rp. ${formatRupiah(val.hourly_price)}`}
            />
        ))}
    </Grid>
);

export default RenderStationCards;
