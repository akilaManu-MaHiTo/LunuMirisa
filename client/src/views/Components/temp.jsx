import React from 'react';
import AdminNaviBar from './Components/AdminNavigationBar';
import ToggleSlideBar from './Components/ToggleSlideBar';
import useSidebar from './Components/useSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const ShowInventory = () => {
  const { isSidebarVisible, toggleSidebar, sidebarRef } = useSidebar();

  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get("http://localhost:3001/ShowInventory")
      .then(response => {
        setInventory(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the inventory items!", error);
        setError('There was an error fetching the inventory items!');
      });
  }, []);

  // SidebarWithOverlay component
  const SidebarWithOverlay = () => (
    <div className="flex">
      <ToggleSlideBar ref={sidebarRef} isVisible={isSidebarVisible} />
      {isSidebarVisible && (
        <div
          className="fixed inset-0 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );

  // MainContent component
  const MainContent = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Link to="/Inventory"><button>Add Items</button></Link>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Inventory List</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          inventory.length === 0 ? (
            <p>No inventory items found.</p>
          ) : (
            <ul>
              {inventory.map((item) => (
                <li key={item._id} className="mb-4 p-4 border rounded">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover" />
                  <p>Quantity: {item.quantity}</p>
                  <p>Max Quantity: {item.maxQuantity}</p>
                  {item.quantity < 5 && (
                    <p className="text-red-500">Low inventory item</p>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNaviBar selectedPage="Admin Panel" />
      <div className="p-4">
        <button
          className="text-gray-800 text-2xl focus:outline-none"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <SidebarWithOverlay />

      <MainContent />
    </div>
  );
};

export default ShowInventory;
