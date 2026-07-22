import { IconButton } from '@chakra-ui/react';
import { MdEditSquare, MdDelete } from 'react-icons/md';
const EditDeleteButton = ({ onClickEdit, onCLickDelete, disabled, loading }) => {
    return (
        <>
            <IconButton
                size={'xs'}
                aria-label="edit"
                bg={'blue.600'}
                loading={loading}
                _hover={{
                    bg: 'blue.700',
                }}
                color={'white'}
                rounded={'md'}
                onClick={onClickEdit}
            >
                <MdEditSquare />
            </IconButton>

            <IconButton
                size={'xs'}
                aria-label="delete"
                disabled={disabled}
                loading={loading}
                bg={'red.600'}
                _hover={{
                    bg: 'red.700',
                }}
                onClick={onCLickDelete}
                color={'white'}
            >
                <MdDelete />
            </IconButton>
        </>
    );
};

export default EditDeleteButton;
