import NavbarLayout from '@/layout/NavbarLayout';
import CardStation from '@/components/card/CardStation';
import { Text, Box, Button, Grid, HStack, createListCollection } from '@chakra-ui/react';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import DialogLayout from '@/layout/DialogLayout';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import InputContainer from '@/components/input/InputContainer';
import {
    getAllConsoleByQty,
    getAllStation,
    postDataStation,
    deleteDataStation,
    getConsolesWithAvailability,
    updateStation,
} from '@/api/station';
import { formatRupiah } from '@/utils/formatNumber';
import { validateData } from '@/utils/validate';
import AlertDialog from '@/components/dialog/AlertDialog';
import SelectInput from '@/components/SelectInput';

const Station = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [itemsSelect, setItemsSelect] = useState([]);
    const consoles = createListCollection({
        items: itemsSelect,
        itemToString: e => e.console_type,
        itemToValue: item => String(item.id_console),
    });
    const [loading, setLoading] = useState(false);
    const [selectedConsole, setSelectedConsole] = useState([]);
    const [nameConsole, setNameConsole] = useState('');
    const [stationItems, setStationItems] = useState([]);
    const [deleteField, setDeleteField] = useState({
        id_station: '',
        name_station: '',
        name_console: '',
    });

    const [idStationEdit, setIdStationEdit] = useState('');
    const [alertDelete, setAlertDelete] = useState(false);
    const fetchConsole = async () => {
        setLoading(true);
        try {
            const result = await getAllConsoleByQty();
            setItemsSelect(result);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchConsoleWithAvailability = async () => {
        setLoading(true);
        try {
            const result = await getConsolesWithAvailability(idStationEdit);
            setItemsSelect(result);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addStation = async () => {
        setLoading(true);
        try {
            validateData({ console: selectedConsole[0], name_station: nameConsole });
            await postDataStation({ id_console: selectedConsole[0], name_station: nameConsole });
            setOpenAddDialog(false);
            toaster.create({
                title: 'Berhasil Tambah Data',
                type: 'success',
            });
            setNameConsole('');
            setSelectedConsole([]);
            await fetchStation();
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchStation = async () => {
        setLoading(true);
        try {
            const result = await getAllStation();
            setStationItems(result);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteStation = async () => {
        setLoading(true);
        try {
            await deleteDataStation(deleteField.id_station);
            toaster.create({
                type: 'success',
                title: 'berhasil menghapus data',
            });
            await fetchStation();
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            setLoading(false);
            setAlertDelete(false);
        }
    };
    const editStation = async () => {
        setLoading(true);
        try {
            await updateStation(idStationEdit, { id_console: selectedConsole[0], name_station: nameConsole });
            toaster.create({
                title: 'berhasil update data',
                type: 'success',
            });
            await fetchStation();
            setOpenEditDialog(false);
            setIdStationEdit('');
        } catch (error) {
            console.log(error);
            toaster.create({
                title: 'console dan nama station harus ada',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStation();
    }, []);
    console.log({
        id_console: selectedConsole[0],
        name_station: nameConsole,
        id_station: idStationEdit,
    });
    useEffect(() => {
        if (openEditDialog === true) {
            fetchConsoleWithAvailability();
        }
    }, [openEditDialog]);

    useEffect(() => {
        if (openAddDialog == true) {
            fetchConsole();
        }
    }, [openAddDialog]);
    return (
        <NavbarLayout header={'STATION'}>
            {/* FORM TAMBAH DATA */}
            <DialogLayout
                cancelTitle="cancel"
                saveTitle={'submit'}
                onClick={addStation}
                titleHeader={'Tambah Station'}
                titleTrigger={'Tambah Station'}
                loading={loading}
                open={openAddDialog}
                setOpen={val => {
                    if (val.open === false) {
                        setNameConsole('');
                        setSelectedConsole([]);
                        setItemsSelect([]);
                    }
                    setOpenAddDialog(val.open);
                }}
            >
                <SelectInput
                    collection={consoles}
                    data={consoles}
                    value={selectedConsole}
                    onValueChange={e => setSelectedConsole(e.value ?? [])}
                />
                <InputContainer
                    value={nameConsole}
                    label={'nama station'}
                    placeholder="misal: Meja 1"
                    onChange={e => {
                        setNameConsole(e.target.value);
                    }}
                />
            </DialogLayout>
            {/* END FORM TAMBAH DATA */}
            {/* FORM EDIT DIALOG */}
            <DialogLayout
                cancelTitle={'cancel'}
                saveTitle={'submit'}
                open={openEditDialog}
                onClick={editStation}
                titleHeader={'Edit Station'}
                titleTrigger={'Edit Station'}
                loading={loading}
                setOpen={val => {
                    if (val.open === false) {
                        setNameConsole('');
                        setSelectedConsole([]);
                        setItemsSelect([]);
                    }
                    setOpenEditDialog(val.open);
                }}
            >
                <SelectInput
                    collection={consoles}
                    data={consoles}
                    value={selectedConsole}
                    onValueChange={e => setSelectedConsole(e.value ?? [])}
                />
                <InputContainer
                    value={nameConsole}
                    label={'nama station'}
                    placeholder="misal: Meja 1"
                    onChange={e => {
                        setNameConsole(e.target.value);
                    }}
                />
            </DialogLayout>
            {/* END FORM EDIT DIALOG */}
            {/* ALERT DELETE DATA */}
            <AlertDialog
                openAlert={alertDelete}
                onOpenChange={e => {
                    setAlertDelete(e.open);
                    if (e.open == false) {
                        setDeleteField({
                            id_station: '',
                            name_console: '',
                            name_station: '',
                        });
                    }
                }}
                onClick={deleteStation}
                headerTitle={'Hapus Station'}
                loading={loading}
            >
                Yakin ingin menghapus konsol <strong>{deleteField.name_console}</strong> dengan{' '}
                <strong>{deleteField.name_station}</strong>?
            </AlertDialog>
            {/* END ALERT DELETE DATA */}
            {/* Card  Station*/}
            <Button mt={8} onClick={() => setOpenAddDialog(true)}>
                Tambah Meja
            </Button>
            <Box>
                <HStack alignItems={'center'} mt={5} color={'green.200'}>
                    <FiCheckCircle />
                    <Text fontSize="md" fontWeight="bold">
                        Kosong (5)
                    </Text>
                </HStack>
                <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={7} mt={4} mb={6}>
                    {stationItems.map((val, index) => (
                        <CardStation
                            onClickDelete={() => {
                                setAlertDelete(true);
                                setDeleteField({
                                    id_station: val.id_station,
                                    name_console: val.console_type,
                                    name_station: val.name_station,
                                });
                            }}
                            key={index}
                            onClickEdit={() => {
                                setIdStationEdit(val.id_station);
                                setSelectedConsole([String(val.id_console)]);
                                setNameConsole(val.name_station);
                                setOpenEditDialog(true);
                            }}
                            nameConsole={val.console_type?.toUpperCase()}
                            namePackage={val.package?.toUpperCase()}
                            nameStation={val.name_station?.toUpperCase()}
                            price={`Rp. ${formatRupiah(val.hourly_price)}`}
                        ></CardStation>
                    ))}
                </Grid>
            </Box>

            <HStack alignItems={'center'} mt={5} color={'red.200'}>
                <FiClock />
                <Text fontSize="md" fontWeight="bold">
                    Dipakai (5)
                </Text>
            </HStack>
            {/* End Card */}
        </NavbarLayout>
    );
};

export default Station;
