import React from 'react';
import logo from '../Images/Logo.png'; 

const Footer = () => {
  return (
    <footer className='bg-custom-dark w-full h-auto py-10'>

        <div className='flex'> 
            <div>
                <div className='text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40'>Contact Us</div>
                <address className="not-italic">
                    <div className="flex text-white pl-10 lg:pl-40 pt-4 font-spartan">
                        <div className="font-bold">Address - </div>
                        <div className="font-thin">&nbsp; No 76 Colombo Road, Raththanapitiya, Boralesgamuwa</div>
                    </div>
                    <div className="flex text-white pl-10 lg:pl-40 pt-4 font-spartan">
                        <div className="font-bold">Phone - </div>
                        <div className="font-thin">&nbsp; 0112 150 059</div>
                    </div>
                    <div className="flex text-white pl-10 lg:pl-40 pt-4 font-spartan">
                        <div className="font-bold">Email - </div>
                        <div className="font-thin">&nbsp; Lunumirisa@gmail.com</div>
                    </div>
                </address>

                <div className='text-white text-2xl pt-10 font-spartan font-thin pl-10 lg:pl-40'>Follow Us</div>

                <div className='flex text-white pl-12 lg:pl-52 pt-4 space-x-4'>
                    <a href="#" className="hover:underline">Facebook</a>
                    <a href="#" className="hover:underline">Instagram</a>
                    <a href="#" className="hover:underline">WhatsApp</a>
                </div>

                <div className='flex ml-[10rem] pt-10'>
                <img src={logo} alt="Logo" className='w-24 h-auto' />
                </div>
            </div>
            


            <div className='font-spartan'>
                <div className='text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40'>House of operations</div>

                <div className='ml-[10rem] mt-4 text-white '>
                    <div className="font-bold mt-4">Monday - Friday: 7:00 AM - 10:00 PM</div>
                    <div className="font-bold mt-4">Saturday - Sunday: 8:00 AM - 11:00 PM</div>
                </div>

                <div className='text-white text-2xl pt-2 font-spartan font-thin pl-10 lg:pl-40 mt-5'>Quick Link</div>
                <div className='text-white font-thin ml-[11rem] '>
                    <div className='flex mt-5'>
                        <div>
                            <div>Home</div>
                            <div>Menu</div>
                            <div>Resovation</div>
                        </div>
                        <div className='ml-20'>
                            <div>Catering</div>
                            <div>About US</div>
                            <div>Contact</div>
                        </div>
                    </div>
                </div>
                

            </div>
        
        </div>

    </footer>
  );
};

export default Footer;
