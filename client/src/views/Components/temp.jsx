import React from 'react';
import AdminNaviBar from './Components/AdminNavigationBar';
import ToggleSlideBar from './Components/ToggleSlideBar';
import useSidebar from './Components/useSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const ShowInventory = () => {
  const { id } = useParams(); // Get the ID from the URL params
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(''); // Store the image URL
  const [quantity, setQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [category, setCategory] = useState('Vegetables');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch the inventory item by ID
      axios.get(`https://lunu-mirisa.vercel.app/GetInventory/${id}`)
        .then(response => {
          const item = response.data;
          setName(item.name);
          setQuantity(item.quantity);
          setMaxQuantity(item.maxQuantity);
          setCategory(item.category);
          setImageURL(`https://lunu-mirisa.vercel.app/Images/${item.image}`); // Set the image URL
        })
        .catch(err => console.log(err));
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', imageURL); // Send image file or URL
    formData.append('quantity', quantity);
    formData.append('maxQuantity', maxQuantity);
    formData.append('category', category);

    // Update the existing inventory item
    axios.post(`https://lunu-mirisa.vercel.app/PlaceOrder/${category}/${id}`, formData)
      .then(result => {
        console.log(category)
        console.log(result);
        
        navigate('/ShowInventory');
      })
      .catch(err => console.log(err));
  };
  
  const { isSidebarVisible, toggleSidebar, sidebarRef } = useSidebar();

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
    <div>
      <AdminNaviBar selectedPage={id ? "Edit Inventory Item" : "Add Inventory Items"} />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-4">{id ? "Edit" : "Add"} Place Order For Suppliers</h2>
          <div className="mb-4">

            <div className="mb-4 flex items-center justify-center">
              <img 
                src={imageURL} 
                alt={name} 
                className="w-32 h-32 object-cover rounded-md mb-2"
              />
              <input type="hidden" name="imageURL" value={imageURL} />
            </div>
          
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required readOnly
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxQuantity">
              Max Quantity
            </label>
            <input
              type="number"
              name="maxQuantity"
              id="maxQuantity"
              value={maxQuantity}
              onChange={(e) => setMaxQuantity(parseInt(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="orderQuantity">
              Order Quantity (Max - Available)
            </label>
            <input
              type="number"
              name="orderQuantity"
              id="orderQuantity"
              value={maxQuantity - quantity} 
              className="shadow text-blue-600 appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required readOnly
            >
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Spices">Spices</option>
              <option value="Meat">Meat</option>
              <option value="Fisheries">Fisheries</option>
            </select>
          </div>
          <div className=' flex justify-center items-center'>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Place Order
          </button></div>
        </form>

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
