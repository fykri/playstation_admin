import { Field } from '@chakra-ui/react';
const FieldRootLabel = ({ label, children }) => {
    return (
        <Field.Root>
            <Field.Label>{label}</Field.Label>
            {children}
        </Field.Root>
    );
};

export default FieldRootLabel;
