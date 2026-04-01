import { Dialog, Stack, CloseButton } from "@chakra-ui/react";
import DialogHeader from "@/components/dialog/DialogHeader";
import DialogFooter from "@/components/dialog/DialogFooter";

const DialogLayout = ({
    titleHeader,
    children,
    cancelTitle,
    saveTitle,
    open,
    onClick,
    setOpen,
    loading,
}) => {
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <DialogHeader title={titleHeader} />
                    <Dialog.Body>
                        <Stack gap={4}>{children}</Stack>
                    </Dialog.Body>
                    <DialogFooter
                        cancelTitle={cancelTitle}
                        saveTitle={saveTitle}
                        onClick={onClick}
                        loading={loading}
                    />
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default DialogLayout;
