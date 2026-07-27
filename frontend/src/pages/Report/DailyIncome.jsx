import { Text, Table, Box } from '@chakra-ui/react';

const DailyIncomeReport = () => {
    return (
        <>
            <Table.Root size={'md'} tableLayout={'fixed'} mb={5} variant="outline" rounded={'md'}>
                <Table.Caption captionSide="top" mb={2}>Station Revenue</Table.Caption>
                <Table.Header bg={'blackAlpha.300'}>
                    <Table.Row bg={'none'}>
                        {['No', 'nama station', 'total session', 'total penghasilan'].map((val, index) => (
                            <Table.ColumnHeader key={index}>{val}</Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
            </Table.Root>
        </>
    );
};

export default DailyIncomeReport;
