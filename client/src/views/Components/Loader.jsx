import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faCoffee, faGlassCheers, faClipboardList, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';



const Loader = () => {


  return (
<div className="bg-white p-4  flex items-center justify-center min-h-screen">
  <div className=" text-black font-spartan  text-2xl box-border h-10 p-2 flex rounded-md">
    <p>Loading</p>
    <div className="overflow-hidden relative ml-2">
      <div className="absolute inset-0 bg-gradient-to-b  via-transparent to-transparent z-20" style={{ backgroundSize: '100% 50%' }}></div>
      <div className="relative">
        <span className="block h-full pl-1 text-[#bc4343] animate-spin_4991">
           Menu <FontAwesomeIcon icon={faUtensils} />
        </span>
        <span className="block h-full pl-1 text-[#bc4343] animate-spin_4991">
           Foods <FontAwesomeIcon icon={faCoffee} />
        </span>
        <span className="block h-full pl-1 text-[#bc4343] animate-spin_4991">
           Drinks <FontAwesomeIcon icon={faGlassCheers} />
        </span>
        <span className="block h-full pl-1 text-[#bc4343] animate-spin_4991">
           Orders <FontAwesomeIcon icon={faClipboardList} />
        </span>
        <span className="block h-full pl-1 text-[#bc4343] animate-spin_4991">
           Reservations <FontAwesomeIcon icon={faCalendarCheck} />
        </span>
      </div>
    </div>
  </div>
</div>

  );
};

export default Loader;
