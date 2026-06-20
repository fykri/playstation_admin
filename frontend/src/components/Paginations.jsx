import { ButtonGroup, IconButton, Pagination } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
const Paginations = ({ items = [], page, setPage, pageSize }) => {
    return (
        <Pagination.Root
            count={items.length}
            pageSize={pageSize}
            page={page}
            onPageChange={(e) => setPage(e.page)}
            alignSelf={'center'}
        >
            <ButtonGroup variant="ghost" size="sm" wrap="wrap">
                <Pagination.PrevTrigger asChild>
                    <IconButton>
                        <HiChevronLeft />
                    </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                    render={(page) => (
                        <IconButton
                            variant={{ base: "ghost", _selected: "surface" }}
                        >
                            {page.value}
                        </IconButton>
                    )}
                />
                <Pagination.NextTrigger asChild>
                    <IconButton>
                        <HiChevronRight />
                    </IconButton>
                </Pagination.NextTrigger>
            </ButtonGroup>
        </Pagination.Root>
    );
};

export default Paginations;
