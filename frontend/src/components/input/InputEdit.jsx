import { Input } from '@chakra-ui/react';
const InputEdit = ({ id_console, id_edit, valueEdit, data, onChange, placeholder, onKeyDown }) => {
    return (
        <>
            {id_console == id_edit ? (
                <Input
                    size={'sm'}
                    value={valueEdit}
                    minW={'50px'}
                    onChange={onChange}
                    placeholder={placeholder}
                    border="1px solid"
                    borderColor="blue.500"
                    css={{ '--focus-color': 'blue' }}
                    onKeyDown={onKeyDown}
                ></Input>
            ) : (
                data
            )}
        </>
    );
};

export default InputEdit;
