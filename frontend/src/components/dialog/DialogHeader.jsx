import { Dialog } from "@chakra-ui/react";
const DialogHeader = ({ title }) => {
    return (
        <Dialog.Header justifyContent={"center"}>
            <Dialog.Title>{title}</Dialog.Title>
        </Dialog.Header>
    );
};

export default DialogHeader;
