import NavbarLayout from "@/layout/NavbarLayout";
import {
    Box,
    Heading,
    Dialog,
    Button,
    Table,
    Stack,
    CloseButton,
} from "@chakra-ui/react";
import DialogLayout from "@/layout/DialogLayout";
import InputContainer from "@/components/InputContainer";

const data = [
    {
        label: "Tipe konsol",
        placeholder: "misal: nitendo switch",
        type: true,
    },
    {
        label: "Kuantitas",
        placeholder: "misal: 1, 2 atau 5",
        type: true,
    },
    {
        label: "Paket",
        placeholder: "misal: vip atau reguler",
        type: true,
    },
    {
        label: "Harga perjam",
        placeholder: "20.000",
        type: false,
    },
];
const Console = () => {
    return (
        <NavbarLayout>
            <header>
                <Heading
                    borderBottom={"1px solid white"}
                    size={"2xl"}
                    letterSpacing={2}
                >
                    CONSOLE
                </Heading>
            </header>
            <Box mt={8}>
                <DialogLayout
                    cancelTitle={"cancel"}
                    saveTitle={"submit"}
                    titleHeader={"Tambah Konsol"}
                    titleTrigger={"Tambah Konsol"}
                >
                    {data.map((value, index) => (
                        <InputContainer
                            key={index}
                            label={value.label}
                            placeholder={value.placeholder}
                            type={value.type}
                        />
                    ))}
                </DialogLayout>
                <Table.Root size={"sm"} interactive mt={3}>
                    <Table.Header>
                        <Table.Row bg="none">
                            <Table.ColumnHeader>Tipe konsol</Table.ColumnHeader>
                            <Table.ColumnHeader>Kautitas</Table.ColumnHeader>
                            <Table.ColumnHeader>Paket</Table.ColumnHeader>
                            <Table.ColumnHeader>
                                Harga Perjam
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row bg={"none"}>
                            <Table.Cell>Komputer</Table.Cell>
                            <Table.Cell>2</Table.Cell>
                            <Table.Cell>Vip</Table.Cell>
                            <Table.Cell>20.000</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            </Box>
        </NavbarLayout>
    );
};

export default Console;
