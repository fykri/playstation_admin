import { Dialog, Button } from "@chakra-ui/react";
const DialogTrigger = ({ titleButton }) => {
    return (
        <Dialog.Trigger asChild>
            <Button>{titleButton}</Button>
        </Dialog.Trigger>
    );
};

export default DialogTrigger;
