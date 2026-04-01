import { CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import DialogHeader from "./DialogHeader";
import DialogFooter from "./DialogFooter";
const AlertDialog = ({
    openAlert,
    headerTitle,
    children,
    loading,
    onClick,
    onOpenChange,
}) => {
    return (
        <Dialog.Root
            open={openAlert}
            onOpenChange={onOpenChange}
            placement={"center"}
            motionPreset={"slide-in-top"}
            size={"sm"}
        >
            <Portal>
                <Dialog.Backdrop
                    bg="blackAlpha.500"
                    backdropFilter="blur(10px)"
                />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <DialogHeader title={headerTitle} />
                        <Dialog.Body>
                            {children}
                            <Text mt={2} fontSize="sm" color="red.300">
                                Data yang dihapus tidak dapat dikembalikan.
                            </Text>
                        </Dialog.Body>
                        <DialogFooter
                            colorPalette="red"
                            cancelTitle={"Cancel"}
                            loading={loading}
                            onClick={onClick}
                            saveTitle={"Delete"}
                        />
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default AlertDialog;
