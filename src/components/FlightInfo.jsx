import React, { useState } from 'react'

const FlightInfo = ({flightDetails}) => {

 const [isOpen,setIsOpen]=useState(false)
  return (
    <div className='bg-secondary'>
    <div className=' rounded-lg'>
     <div className='p-1'>
     <div className='bg-blue-300 p-3 rounded-lg'>
      <div className="flex items-center gap-2 text-xl font-bold text-black">
              <h1 className="font-bold text-md">{flightDetails.departureAirportIataCode}</h1>
              <i class="fa-solid fa-arrow-right"></i>
              <h1 className="font-bold text-md">{flightDetails.arrivalAirportIataCode}:</h1>
              <h1>Standard fare</h1>
        </div>
      </div>
      <div className='flex flex-col gap-3 p-3 text-md font-semibold'>
        <div className='flex gap-24'>
            <div className='flex items-center gap-2'>
                <i class="fa-regular fa-calendar-xmark"></i>
                <h1>Cancellation fee starts from ₹4,018</h1>
            </div>
            <div className='flex items-center gap-2'>
                <i class="fa-regular fa-calendar-xmark"></i>
                <h1>Cabin/person: 7kg</h1>
             </div>
             <div className='flex items-center gap-2'>
                <i class="fa-solid fa-bag-shopping"></i>
                <h1>Check-in/person: 15kg(1 Piece)</h1>
             </div>

        </div>
        <div>
        <div className='flex gap-1'>
        <svg width="20" height="20" viewBox="0 0 16 16"><g fill="none" fill-rule="evenodd"><path d="M0 0h16v16H0z">
            </path><path d="M5.06 3.607a1.336 1.336 0 0 1 0-1.887c.52-.52 1.367-.52 1.887 0s.52 1.367 0 1.887a1.324 1.324 0 0 1-1.887 0zM4 10.667v-6H2.667v6A3.335 3.335 0 0 0 6 14h4v-1.333H6c-1.107 0-2-.894-2-2zm9.333 2.713L9.953 10H7.667V7.547c.933.766 2.4 1.44 3.666 1.44v-1.44c-1.106.013-2.406-.58-3.113-1.36l-.933-1.034a1.43 1.43 0 0 0-.46-.333 1.483 1.483 0 0 0-.64-.153h-.02c-.827 0-1.5.673-1.5 1.5V10c0 1.107.893 2 2 2h3.38l2.333 2.333.953-.953z" 
        fill="#000000" fill-rule="nonzero"></path></g></svg>
        <h1>Check-in/person: 15kg (1 Piece)</h1>
        </div> 
        </div>
      </div>

      <div className='p-2'>
      <div className="" onClick={()=>setIsOpen((prev)=>!prev)}>
        <div className='flex gap-3 items-center cursor-pointer border-t shadow-t-lg p-2'>
        <i
          className={`fas fa-chevron-${isOpen ? 'down' : 'right'}`}
          aria-hidden="true"
        />
        <span className='font-semibold'>Cancellation refund policy</span>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col w-full px-7 mt-3 border-b border-gray-200 rounded-lg shadow-lg gap-4">
          <div className='grid grid-cols-5 gap-4'>
             <div className='col-span-1'> <h2 className="text-md font-semibold">Cancel Between</h2></div>
             <div className='col-span-4 flex flex-col gap-1'>
                <div className='text-sm grid grid-cols-4 items-center gap-4'>
                    <div className='col-span-3 flex justify-between'>
                    <span>Now</span>
                    <span className='-translate-x-1/2'>23 Sep, 21:30</span>
                   </div>
                  <div className='cols-span-1 text-right'>
                    <span>23 Sep, 23:30</span>
                  </div>
                </div>
                <div className='flex w-full gap-2'>
                    <div className='w-4/5 h-3 bg-green-400 rounded-full'></div>
                    <div className='w-2/5 h-3 bg-red-400 rounded-full'></div>
                </div>
             </div>
          </div>
          {/* arrange this like above  */}
          <div className="grid grid-cols-5 gap-4 border-b border-gray-200 pb-2">
          <div className="col-span-1">
            <h2 className="text-md font-semibold">Amount Refundable</h2>
          </div>
          <div className="col-span-4 flex flex-col gap-1">
            <div className="flex w-full">
              <div className="flex items-center gap-2 col-span-3 text-center w-4/5 justify-center">
                <h1 className="text-lg font-bold">₹666</h1>
                <i className="fa-solid fa-circle-info text-gray-500"></i>
              </div>
              <div className="flex items-center gap-2 w-2/5 justify-center">
                <h1 className="text-lg font-bold">₹0</h1>
                <i className="fa-solid fa-circle-info text-gray-500"></i>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      </div>
      </div>
      </div>
     
    </div>
  )
}

export default FlightInfo
