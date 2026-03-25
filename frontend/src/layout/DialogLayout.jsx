import { Dialog, Stack, CloseButton , Button} from "@chakra-ui/react";
import DialogTrigger from "@/components/dialog/DialogTrigger";
import DialogHeader from "@/components/dialog/DialogHeader";
import DialogFooter from "@/components/dialog/DialogFooter";

const DialogLayout = ({
    titleTrigger,
    titleHeader,
    children,
    cancelTitle,
    saveTitle,
}) => {
    return (
        <Dialog.Root>
            <DialogTrigger titleButton={titleTrigger} />
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
