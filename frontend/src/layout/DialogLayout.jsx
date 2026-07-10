import { Dialog, Stack, CloseButton } from '@chakra-ui/react';
import DialogHeader from '@/components/dialog/DialogHeader';
import DialogFooter from '@/components/dialog/DialogFooter';

const DialogLayout = ({
    titleHeader,
    children,
    cancelTitle,
    saveTitle,
    open,
    onClick,
    setOpen,
    loading,
    size,
    alert,
}) => {
    return (
        <Dialog.Root open={open} onOpenChange={setOpen} size={size}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <DialogHeader title={titleHeader} />
                    <Dialog.Body>
                        <Stack gap={4}>{children}</Stack>
                    </Dialog.Body>
                    {saveTitle && (
                        <DialogFooter
                            cancelTitle={cancelTitle}
                            saveTitle={saveTitle}
                            onClick={onClick}
                            loading={loading}
                            alert={alert}
                        />
                    )}
                    <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default DialogLayout;
