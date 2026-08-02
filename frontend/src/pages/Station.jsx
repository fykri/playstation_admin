import NavbarLayout from '@/layout/NavbarLayout';
import { Text, Box, Button, HStack, createListCollection } from '@chakra-ui/react';
import { LuGamepad2, LuMonitorPlay } from "react-icons/lu";
import DialogLayout from '@/layout/DialogLayout';
import { useEffect, useState } from 'react';
import { toaster } from '@/components/ui/toaster';
import InputContainer from '@/components/input/InputContainer';
import {
    getAllConsoleByQty,
    postDataStation,
    deleteDataStation,
    getConsolesWithAvailability,
    updateStation,
} from '@/api/station';
import { validateData } from '@/utils/validate';
import AlertDialog from '@/components/dialog/AlertDialog';
import SelectInputConsole from '@/components/select/SelectInputConsole';
import TabsStation from '@/components/TabsStation';
import { useBillingStore } from '@/stores/useStationStore';
import { useShallow } from 'zustand/react/shallow';
import EmptyStatus from '@/components/EmptyStatus';

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
    const { stationItems, fetchStation } = useBillingStore(
        useShallow(state => ({
            stationItems: state.stationItems,
            fetchStation: state.fetchStation,
        })),
    );
    //const [stationItems, setStationItems] = useState([]);
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
        toaster.dismiss()
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

    const deleteStation = async () => {
        setLoading(true);
        toaster.dismiss()
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
        toaster.dismiss()
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

    const sortStation = items =>
        [...items].sort((a, b) =>
            a.name_station.localeCompare(b.name_station, undefined, {
                numeric: true,
                sensitivity: 'base',
            }),
        );
    const availableStations = sortStation(stationItems.filter(item => item.status === 'available'));

    const occupiedStations = sortStation(stationItems.filter(item => item.status === 'used'));

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
                <SelectInputConsole
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
                <SelectInputConsole
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

            <Button mt={8} onClick={() => setOpenAddDialog(true)} colorPalette={'cyan'} variant={'surface'}>
                Tambah Meja
            </Button>

            <Box>
                <TitleStatusStation status={'kosong'} lengthStatus={availableStations.length} colorFont={'green.400'}>
                    <LuGamepad2/>
                </TitleStatusStation>
                {availableStations.length > 0 ? (
                    <TabsStation
                        statusStation={availableStations}
                        onEdit={val => {
                            setIdStationEdit(val.id_station);
                            setSelectedConsole([String(val.id_console)]);
                            setNameConsole(val.name_station);
                            setOpenEditDialog(true);
                        }}
                        onDelete={val => {
                            setAlertDelete(true);
                            setDeleteField({
                                id_station: val.id_station,
                                name_console: val.console_type,
                                name_station: val.name_station,
                            });
                        }}
                    />
                ) : (
                    <EmptyStatus
                        title="Tidak ada station kosong"
                        description="Belum ada station tersedia. Tambahkan station baru atau tunggu hingga station yang sedang digunakan selesai."
                    />
                )}
            </Box>
            <Box mb={'50px'}>
                <TitleStatusStation status={'Digunakan'} lengthStatus={occupiedStations.length} colorFont={'red.400'}>
                    <LuMonitorPlay />
                </TitleStatusStation>
                {occupiedStations.length > 0 ? (
                    <TabsStation
                        statusStation={occupiedStations}
                        onEdit={val => {
                            setIdStationEdit(val.id_station);
                            setSelectedConsole([String(val.id_console)]);
                            setNameConsole(val.name_station);
                            setOpenEditDialog(true);
                        }}
                        onDelete={val => {
                            setAlertDelete(true);
                            setDeleteField({
                                id_station: val.id_station,
                                name_console: val.console_type,
                                name_station: val.name_station,
                            });
                        }}
                    />
                ) : (
                    <EmptyStatus
                        title="Tidak ada station yang digunakan"
                        description="Belum ada pelanggan yang sedang bermain."
                    />
                )}
            </Box>
            {/* End Card */}
        </NavbarLayout>
    );
};

const TitleStatusStation = ({ status, lengthStatus, children, colorFont }) => {
    return (
        <HStack alignItems={'center'} mt={5} color={colorFont}>
            {children}
            <Text fontSize="md" fontWeight="bold">
                {`${status} (${lengthStatus})`}
            </Text>
        </HStack>
    );
};

export default Station;
