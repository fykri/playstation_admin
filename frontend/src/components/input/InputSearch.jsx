import { Input, InputGroup } from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';

const SearchInput = ({
    value,
    onChange,
    placeholder = 'Cari station atau pelanggan...',
}) => {
    return (
        <InputGroup
            startElement={<LuSearch />}
            maxW="400px"
            w={'250px'}
        >
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                borderRadius="md"
                bg="var(--color-primary)"
            />
        </InputGroup>
    );
};

export default SearchInput;