import { Text, Table, Box } from '@chakra-ui/react';
import { useReportStore } from '@/stores/useReportStore';
import { formatRupiah } from '@/utils/formatNumber';
const StationRevenue = () => {
    const itemsStationRevenue = useReportStore(state => state.itemsStationRevenue);
    return (
        <>
            <Table.ScrollArea height={'250px'} mt={2}>
                <Table.Root size={'md'} tableLayout={'fixed'} mb={5} variant="outline" rounded={'md'} stickyHeader>
                    <Table.Caption captionSide="top" mb={2}>
                        Station Revenue
                    </Table.Caption>
                    <Table.Header>
                        <Table.Row bg={'bg.subtle'}>
                            {['No', 'nama station', 'total session', 'total penghasilan'].map((val, index) => (
                                <Table.ColumnHeader key={index}>{val}</Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {itemsStationRevenue.map((value, index) => (
                            <Table.Row
                                bg={'none'}
                                _hover={{ bg: 'gray.700' }}
                                key={value?.id_station}
                                variant="outline"
                                striped
                            >
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell>{value?.name_station}</Table.Cell>
                                <Table.Cell>{value?.total_session}</Table.Cell>
                                <Table.Cell>Rp. {formatRupiah(value?.revenue)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
        </>
    );
};

export default StationRevenue;
