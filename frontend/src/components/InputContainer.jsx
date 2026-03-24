import { Field, Input, InputGroup } from "@chakra-ui/react";
const InputContainer = ({ label, placeholder, type = true }) => {
    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            {type ? (
                <Input placeholder={placeholder} size={"sm"}></Input>
            ) : (
                <InputGroup
                    startElement="Rp."
                    startElementProps={{
                        color: "fg.muted",
                    }}
                >
                    <Input
                        placeholder={placeholder}
                        ps="5ch"
                        size={"sm"}
                    ></Input>
                </InputGroup>
            )}
        </Field.Root>
    );
};

export default InputContainer;
