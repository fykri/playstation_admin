import { Dialog, Button } from "@chakra-ui/react";
const DialogFooter = ({ cancelTitle, saveTitle }) => {
    return (
        <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
                <Button variant="outline">{cancelTitle}</Button>
            </Dialog.ActionTrigger>
            <Button colorPalette={"teal"}>{saveTitle}</Button>
        </Dialog.Footer>
    );
};

export default DialogFooter;
