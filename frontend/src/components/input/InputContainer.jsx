import { Field, Input, InputGroup } from '@chakra-ui/react';
import { forwardRef } from 'react';
const InputContainer = forwardRef(
    ({ label, placeholder, isRp = true, onKeyDown, onChange, value, type = 'text' }, ref) => {
        return (
            <Field.Root>
                <Field.Label>{label}</Field.Label>
                {isRp ? (
                    <Input
                        value={value}
                        placeholder={placeholder}
                        type={type}
                        size={'sm'}
                        ref={ref}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                    ></Input>
                ) : (
                    <InputGroup
                        startElement="Rp."
                        startElementProps={{
                            color: 'fg.muted',
                        }}
                    >
                        <Input
                            ref={ref}
                            value={value}
                            type={type}
                            placeholder={placeholder}
                            ps="5ch"
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            size={'sm'}
                        ></Input>
                    </InputGroup>
                )}
            </Field.Root>
        );
    },
);

export default InputContainer;
