import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink } from 'react-router-dom'
import Dialog from './Dialog';
import useLogout from '../hooks/useLogout';

const SideBar = ({ name, role }) => {
    
    const {state, logoutMutation} = useLogout();

    function openLogout() {
        state.setLogout(prev => true);
    }
    function closeLogout() {
        state.setLogout(prev => false);
    }
    return (
        <>
            {state.logout && <Dialog open={state.logout} action={logoutMutation.mutate} close={closeLogout}>
                <h1>Logout</h1>
                <p>Are you shore, You want logout</p>
            </Dialog>}

            <div className='w-[350px] h-[100vh] sticky top-0 bg-gray shadow-md p-[1rem] flex align-center justify-between flex-col'>
                <div>


                    {/* header */}
                    <div className="text-center">
                        <h1 className='text-[2rem] capitalize m-[2rem]'>{name}</h1>
                    </div>

                    {/*  */}
                    <div className='grid gap-[1rem]'>
                        {/* {role === 'admin' && <> */}
                        <div>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => {
                                    const base =
                                        "flex items-center justify-center  p-[.6rem] rounded-md transition-all";

                                    return isActive
                                        ? `${base} bg-primary text-black text-white shadow-xl`
                                        : `${base} bg-white text-black hover:bg-primary hover:shadow-md`;
                                }}
                            >
                                Dashboard
                            </NavLink>


                        </div>

                        <div>
                            <NavLink className={({ isActive }) => {
                                const base =
                                    "flex items-center justify-center  p-[.6rem] rounded-md transition-all";

                                return isActive
                                    ? `${base} bg-primary text-black text-white shadow-xl`
                                    : `${base} bg-white text-black hover:bg-primary hover:shadow-md`;
                            }} to={'/categories'}>Categories</NavLink>
                        </div>
                        {/* </>} */}

                        <div>
                            <NavLink className={({ isActive }) => {
                                const base =
                                    "flex items-center justify-center  p-[.6rem] rounded-md transition-all";

                                return isActive
                                    ? `${base} bg-primary text-black text-white shadow-xl`
                                    : `${base} bg-white text-black hover:bg-primary hover:shadow-md`;
                            }} to={'/products'}>Products</NavLink>
                        </div>

                        <div>
                            <NavLink className={({ isActive }) => {
                                const base =
                                    "flex items-center justify-center  p-[.6rem] rounded-md transition-all";

                                return isActive
                                    ? `${base} bg-primary text-black text-white shadow-xl`
                                    : `${base} bg-white text-black hover:bg-primary hover:shadow-md`;
                            }} to={'/orders'}>Orders</NavLink>
                        </div>

                        <div>
                            <NavLink className={({ isActive }) => {
                                const base =
                                    "flex items-center justify-center  p-[.6rem] rounded-md transition-all";

                                return isActive
                                    ? `${base} bg-primary text-black text-white shadow-xl`
                                    : `${base} bg-white text-black hover:bg-primary hover:shadow-md`;
                            }} to={'/employee'}>employee</NavLink>
                        </div>
                    </div>
                </div>

                {/* footer */}
                <div className='grid gap-[1rem] mb-[1.6rem]'>
                    <button onClick={openLogout} className='text-red-500 text-start p-2 cursor-pointer hover:text-red-800 hover:scale-[1.1] transition'>
                        <FontAwesomeIcon icon={faSignOut} />
                        <span>Logout</span>
                    </button>
                    <Link to={'/account'}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>account</span>
                    </Link>
                </div>
            </div></>
    )
}

export default SideBar