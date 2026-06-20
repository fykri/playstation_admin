import NavbarLayout from '@/layout/NavbarLayout';
import { Box, Table, Button, HStack, createListCollection, Select } from '@chakra-ui/react';
import DialogLayout from '@/layout/DialogLayout';
import InputContainer from '@/components/input/InputContainer';
import { getAllConsole, postConsole, deleteConsole, updateConsole } from '@/api/console';
import { useEffect, useState } from 'react';
import useEnterNavigation from '@/hooks/useEnterNavigation';
import EmptyState from '../components/EmptyState';
import { toaster } from '@/components/ui/toaster';
import Paginations from '@/components/Paginations';
import usePagination from '@/hooks/usePaginations';
import { formatRupiah, filteringNumber } from '@/utils/formatNumber';
import AlertDialog from '@/components/dialog/AlertDialog';
import EditDeleteButton from '@/components/button/EditDeleteButton';
import EditSaveButton from '@/components/button/EditSaveButton';
import InputEdit from '@/components/input/InputEdit';
import filteringObject from '@/utils/filteringObjectUpdate';
import { validateData } from '@/utils/validate';
import SelectContainer from '@/components/select/SelectContainer';

const data = [
    {
        name: 'console_type',
        label: 'Tipe konsol',
        placeholder: 'misal: nitendo switch',
        type: 'text',
    },
    {
        name: 'package',
        label: 'Paket',
        placeholder: 'misal: vip atau reguler',
        type: 'select',
    },
    {
        name: 'quantity',
        label: 'Kuantitas',
        placeholder: 'misal: 1, 2 atau 5',
        type: 'text',
    },
    {
        name: 'hourly_price',
        label: 'Harga perjam',
        placeholder: '20.000',
        type: 'text',
    },
];

const Console = () => {
    const [dataConsole, setDataConsole] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataField, setDataField] = useState({
        console_type: '',
        quantity: '',
        package: '',
        hourly_price: '',
    });
    const [fieldDeleteConsole, setfieldDeleteConsole] = useState({
        id_console: '',
        type_console: '',
        package: '',
    });

    const [editId, setEditId] = useState(null);
    const [formEdit, setFormEdit] = useState({});

    //Paginations
    const { page, setPage, currentData, pageSize, count, resetPage } = usePagination(dataConsole, 8);

    // menampilkan data di tabel
    const fetchData = async () => {
        try {
            const result = await getAllConsole();
            setDataConsole(result);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetField = () => {
        setDataField({
            console_type: '',
            quantity: '',
            package: '',
            hourly_price: '',
        });
    };

    const triggerButtonEdit = (id, data) => {
        setEditId(id);
        setFormEdit(data);
    };

    const consolesListSelect = createListCollection({
        items: [
            { label: 'VIP', value: 'VIP' },
            { label: 'Reguler', value: 'Reguler' },
        ],
        itemToString: e => e.label,
        itemToValue: item => item.value,
    });

    // handle API POST console
    const handleSubmitAddConsole = async () => {
        setLoading(true);
        try {
            validateData(dataField);
            await postConsole(dataField);
            setOpenDialog(false);
            toaster.create({
                title: 'Berhasil Tambah Data',
                type: 'success',
            });
            resetField();
            await fetchData();
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            validateData(formEdit);
            const oldItem = dataConsole.find(item => item.id_console === editId);
            const data = filteringObject(oldItem, formEdit);
            if (Object.keys(data).length === 0) {
                toaster.create({
                    title: 'data tidak mengalami perubahan',
                    type: 'info',
                });
                return;
            }
            await updateConsole(editId, data);
            setEditId('');
            await fetchData();
            toaster.create({
                title: 'data berhasil di ubah',
                type: 'success',
            });
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteData = async () => {
        setLoading(true);
        try {
            await deleteConsole(fieldDeleteConsole.id_console);
            toaster.create({
                title: 'data berhasil dihapus',
                type: 'success',
            });
            await fetchData();
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
            setOpenAlertDialog(false);
        }
    };


    // Buat Dialog: ketika field di enter maka akan lanjut ke field berikutnya
    const { setRef, handleKeyDown } = useEnterNavigation(data.length, handleSubmitAddConsole, openDialog);
    return (
        <NavbarLayout header={'CONSOLE'}>
            {/* DIALOG */}
            <DialogLayout
                cancelTitle={'cancel'}
                saveTitle={'submit'}
                titleHeader={'Tambah Konsol'}
                titleTrigger={'Tambah Konsol'}
                open={openDialog}
                onClick={handleSubmitAddConsole}
                setOpen={e => {
                    resetField();
                    setOpenDialog(e.open);
                }}
                loading={loading}
            >
                {data.map((value, index) =>
                    value.type == 'select' ? (
                        <SelectContainer
                            key={index}
                            collection={consolesListSelect}
                            label={'paket'}
                            placeholder={'pilih paket'}
                            value={dataField?.package ? [dataField.package] : []}
                            onValueChange={items => {
                                setDataField({
                                    ...dataField,
                                    package: items.value[0],
                                });
                            }}
                        >
                            {consolesListSelect.items.map(items => (
                                <Select.Item item={items} key={items.value}>
                                    {items.value}
                                </Select.Item>
                            ))}
                        </SelectContainer>
                    ) : (
                        <InputContainer
                            key={index}
                            value={
                                value.name === 'hourly_price'
                                    ? formatRupiah(dataField.hourly_price)
                                    : dataField[value.name]
                            }
                            type={value.type}
                            label={value.label}
                            placeholder={value.placeholder}
                            isRp={value.name === 'hourly_price'}
                            onChange={e => {
                                if (value.name === 'hourly_price' || value.name === 'quantity') {
                                    const raw = filteringNumber(e.target.value);
                                    setDataField(prev => ({
                                        ...prev,
                                        [value.name]: raw,
                                    }));
                                } else {
                                    setDataField(prev => ({
                                        ...prev,
                                        [value.name]: e.target.value,
                                    }));
                                }
                            }}
                            ref={setRef(index)}
                            onKeyDown={handleKeyDown(index)}
                        />
                    ),
                )}
            </DialogLayout>
            {/* Dialog delete data */}
            <AlertDialog
                openAlert={openAlertDialog}
                onOpenChange={e => {
                    setOpenAlertDialog(e.open);
                    if (e.open == false) {
                        setfieldDeleteConsole({
                            id_console: '',
                            type_console: '',
                            package: '',
                        });
                    }
                }}
                onClick={handleDeleteData}
                headerTitle={'Hapus Data'}
                loading={loading}
            >
                Yakin ingin menghapus konsol <strong>{fieldDeleteConsole.type_console}</strong> dengan paket{' '}
                <strong>{fieldDeleteConsole.package}</strong>?
            </AlertDialog>
            {/* end dialog delete data */}
            {/* END DIALOG */}

            {/* Content Console */}
            <Box mt={8}>
                <Button onClick={() => setOpenDialog(true)} colorPalette={'cyan'} variant={'surface'}>
                    Tambah Data{' '}
                </Button>
                <Box mt={3}>
                    {dataConsole.length === 0 ? (
                        <EmptyState
                            description="Silakan tambahkan data console terlebih dahulu"
                            title="Data konsol kosong"
                        />
                    ) : (
                        // TABLE CONSOLE
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems={'center'}
                            justifyContent="space-between"
                            minH="500px"
                        >
                            <Table.Root size={'sm'} tableLayout="fixed"  rounded={'md'}>
                                <Table.Header>
                                    <Table.Row bg="none" >
                                        {['Tipe konsol', 'Paket', 'Kuantitas', 'Harga Perjam', 'Aksi'].map(
                                            (value, index) => (
                                                <Table.ColumnHeader key={index}>{value}</Table.ColumnHeader>
                                            ),
                                        )}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {currentData.map(val => {
                                        return (
                                            <Table.Row bg={'none'} _hover={{ bg: 'gray.700' }} key={val.id_console}>
                                                {['console_type', 'package', 'quantity'].map((v, index) => (
                                                    <Table.Cell key={index}>
                                                        {v === 'package' && editId === val.id_console ? (
                                                            <SelectContainer
                                                            classname={'border! border-blue-500! rounded-sm'}
                                                                collection={consolesListSelect}
                                                                onValueChange={items => {
                                                                    setFormEdit({
                                                                        ...formEdit,
                                                                        [v]: items.value[0],
                                                                    });
                                                                }}
                                                                placeholder={'pilih console'}
                                                                value={formEdit?.package ? [formEdit.package] : []}
                                                            >
                                                                {consolesListSelect.items.map(items => (
                                                                    <Select.Item item={items} key={items.value}>
                                                                        {items.value}
                                                                    </Select.Item>
                                                                ))}
                                                            </SelectContainer>
                                                        ) : (
                                                            <InputEdit
                                                                id_console={val.id_console}
                                                                valueEdit={formEdit[v]}
                                                                data={val[v]}
                                                                id_edit={editId}
                                                                placeholder={data[index].placeholder}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter') handleUpdate();
                                                                }}
                                                                onChange={e => {
                                                                    setFormEdit(value => ({
                                                                        ...value,
                                                                        [v]: e.target.value,
                                                                    }));
                                                                }}
                                                            />
                                                        )}
                                                    </Table.Cell>
                                                ))}
                                                <Table.Cell>
                                                    <InputEdit
                                                        id_console={val.id_console}
                                                        id_edit={editId}
                                                        placeholder={data[3].placeholder}
                                                        onChange={e => {
                                                            setFormEdit(value => ({
                                                                ...value,
                                                                hourly_price: filteringNumber(e.target.value),
                                                            }));
                                                        }}
                                                        valueEdit={formatRupiah(formEdit.hourly_price)}
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') handleUpdate();
                                                        }}
                                                        data={`Rp. ${formatRupiah(val.hourly_price)}`}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <HStack gap={3}>
                                                        {editId === val.id_console ? (
                                                            <EditSaveButton
                                                                onClickCancel={() => {
                                                                    setEditId(null);
                                                                    setFormEdit({});
                                                                }}
                                                                onClickSave={handleUpdate}
                                                            />
                                                        ) : (
                                                            <EditDeleteButton
                                                                onCLickDelete={() => {
                                                                    setfieldDeleteConsole({
                                                                        id_console: val.id_console,
                                                                        type_console: val.console_type,
                                                                        package: val.package,
                                                                    });
                                                                    setOpenAlertDialog(true);
                                                                }}
                                                                onClickEdit={() =>
                                                                    triggerButtonEdit(val.id_console, val)
                                                                }
                                                            />
                                                        )}
                                                    </HStack>
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Root>
                            {dataConsole.length >= 8 && (
                                <Paginations pageSize={pageSize} page={page} setPage={setPage} items={dataConsole} />
                            )}
                        </Box>
                        // END Table Console
                    )}
                </Box>
            </Box>
            {/* End Content Console */}
        </NavbarLayout>
    );
};

export default Console;
