import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function Users() {

    const [users, setUsers] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:3001')
            .then(result => setUsers(result.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {

      axios.delete('http://localhost:3001/deleteUser/'+id)
      .then(res => {console.log(res)

        window.location.reload()

      })
      .catch(err => console.log(err))
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='text-2xl font-bold text-center text-green-400 mb-6'>
                Users List<br /><br />
            </div>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                        <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                        <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Age</th>
                        <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {users.map((akila) => (
                        <tr key={akila._id} className='hover:bg-gray-50'>
                            <td className='px-6 py-4 text-center whitespace-nowrap'>{akila.name}</td>
                            <td className='px-6 py-4 text-center whitespace-nowrap'>{akila.email}</td>
                            <td className='px-6 py-4 text-center whitespace-nowrap'>{akila.age}</td>
                            <td><Link to={`/update/${akila._id}`}><button>Edit</button></Link></td>
                            <td><button onClick={(e) => handleDelete(akila._id)}>Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/create">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Add User
                </button>
            </Link>
            <br /><br />
            <Link to="/createEmployee">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Add Employees
                </button>
            </Link>
            <br /><br />
            <Link to="/addImage">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Add Image
                </button>
            </Link>
            <br /><br />
            <Link to="/showImages">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Show Images
                </button>
            </Link>
            <br /><br />
            <Link to="/login">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Login
                </button>
            </Link>

            <Link to="/UserHome">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Home
                </button>
            </Link>

            <Link to="/AdminPage">
                <button className='bg-slate-500 hover:bg-black hover:text-white hover:cursor-pointer mt-4' style={{ width: '400px' }}>
                    Admin
                </button>
            </Link>
        </div>
    );
}

export default Users;
