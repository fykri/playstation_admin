import { IconButton } from "@chakra-ui/react";
import { MdClose, MdCheck } from "react-icons/md";

const EditSaveButton = ({ onClickSave, onClickCancel }) => {
    return (
        <>
            <IconButton
                size={"xs"}
                aria-label="edit"
                bg={"green.600"}
                _hover={{
                    bg: "green.700",
                }}
                color={"white"}
                rounded={"md"}
                onClick={onClickSave}
            >
                <MdCheck />
            </IconButton>
            <IconButton
                size={"xs"}
                aria-label="edit"
                bg={"red.600"}
                _hover={{
                    bg: "red.700",
                }}
                color={"white"}
                rounded={"md"}
                onClick={onClickCancel}
            >
                <MdClose />
            </IconButton>
        </>
    );
};

export default EditSaveButton;
