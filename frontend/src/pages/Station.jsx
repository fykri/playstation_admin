import NavbarLayout from '@/layout/NavbarLayout';
import CardStation from '@/components/card/CardStation';
const Station = () => {
    return (
        <NavbarLayout header={'Station'}>
            {/* Card */}
            <CardStation status="kosong" />
            {/* End Card */}
        </NavbarLayout>
    );
};

export default Station;
