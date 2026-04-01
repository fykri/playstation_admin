import { Dialog, Button } from "@chakra-ui/react";
const DialogFooter = ({ cancelTitle, saveTitle, onClick, loading, colorPalette = 'teal' }) => {
    return (
        <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
                <Button variant="outline">{cancelTitle}</Button>
            </Dialog.ActionTrigger>
            <Button colorPalette={colorPalette} onClick={onClick} loading={loading}>{saveTitle}</Button>
        </Dialog.Footer>
    );
};

export default DialogFooter;
