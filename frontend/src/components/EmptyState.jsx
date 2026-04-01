import { VStack, Text, Icon } from "@chakra-ui/react";
import { LuInbox } from "react-icons/lu";

const EmptyState = ({
  title = "Data Kosong",
  description = "Belum ada data yang tersedia",
}) => {
  return (
    <VStack py={10} gap={3} color="gray.500" h={'md'} justifyContent={'center'}>
      <Icon as={LuInbox} boxSize={10} />
      <Text fontWeight="bold">{title}</Text>
      <Text fontSize="sm">{description}</Text>
    </VStack>
  );
};

export default EmptyState;
