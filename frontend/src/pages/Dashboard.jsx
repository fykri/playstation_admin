import NavbarLayout from '@/layout/navbarLayout';
import { Box } from '@chakra-ui/react';
const Dashboard = () => {
    return (
        <NavbarLayout header={'Dashboard'}>
            <div className="h-56 grid grid-cols-[200px_max-content_100px]">
                <div className="bg-blue-400">item 1</div>
                <div className="bg-red-400">item 2</div>
                <div className="bg-green-400">item 3</div>
                <div className="bg-yellow-400">item 4</div>
                <div className="bg-orange-400">item 5</div>
                <div className="bg-cyan-400">item 6</div>
                <div className="bg-emerald-400">item 7</div>
                <div className="bg-fuchsia-400">item 8</div>
                <div className='bg-rose-400'>item 9</div>
            </div>
        </NavbarLayout>
    );
};

export default Dashboard;
