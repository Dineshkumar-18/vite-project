import React from 'react';

const FlightContent = () => {
    return (
        

        <>

<section className="bg-[#00163d] max-w-7xl mx-auto py-20 px-4">
  <p className="text-fuchsia-400 text-lg font-semibold mb-4 text-center tracking-wide">TRAVEL SUPPORT</p>
  <h2 className="text-white text-5xl font-semibold leading-tight mb-4 text-center">Plan your travel with confidence</h2>
  <p className="text-white text-center mb-8">Find help with your bookings, and see what to expect along your journey.</p>
  <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-8">
      <div className="flex items-center">
        <span className="inline-block px-4 py-1 mr-2 text-white font-semibold bg-blue-600 rounded-full">01</span>
        <h4 className="text-fuchsia-400 text-lg font-semibold">Travel Requirements</h4>
      </div>
      <p className="text-gray-300">Stay informed and prepared for your trip with essential travel requirements, ensuring a smooth and hassle-free experience.</p>
      <div className="flex items-center">
        <span className="inline-block px-4 py-1 mr-2 text-white font-semibold bg-orange-500 rounded-full">02</span>
        <h4 className="text-fuchsia-400 text-lg font-semibold">Multi-risk travel insurance</h4>
      </div>
      <p className="text-gray-300">Comprehensive protection for your peace of mind, covering a range of potential travel risks and unexpected situations.</p>
      <div className="flex items-center">
        <span className="inline-block px-4 py-1 mr-2 text-white font-semibold bg-yellow-200 rounded-full">03</span>
        <h4 className="text-fuchsia-400 text-lg font-semibold">Travel Requirements by destinations</h4>
      </div>
      <p className="text-gray-300">Stay informed and plan your flight trip with ease, as we provide up-to-date information on flight travel specific to your desired destinations.</p>
    </div>
    <div className="relative flex justify-center">
    <img className="absolute max-w-[240px] -translate-x-32 translate-y-5 rounded-full shadow-lg" src="/plan-1.jpg" alt="plan" />
    <img className="absolute max-w-[250px] translate-y-5 translate-x-10 left-1/2 transform  rounded-full shadow-lg" src="/plan-2.jpg" alt="plan" />
    <img className="absolute max-w-[220px] translate-x-22 translate-y-48 rounded-full shadow-lg" src="/plan-3.jpg" alt="plan" />


</div>

  </div>
</section>

<section className="bg-[#00163d] py-20">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex items-center justify-between gap-8 mb-10">
        <h2 className="text-white text-5xl font-semibold">Travel to make memories all around the world</h2>
        <button className="py-3 px-8 text-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-600 transition">View All</button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
            <span className="inline-block p-5 mb-4 text-white bg-blue-600 rounded-full text-4xl"><i class="ri-calendar-2-line"></i></span>
            <h4 className="text-gray-800 text-lg font-semibold mb-2">Book & relax</h4>
            <p className="text-gray-500">With "Book and Relax," you can sit back, unwind, and enjoy the journey while we take care of everything else.</p>
      </div>
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
        <span className="inline-block p-5 mb-4 text-white bg-orange-500 rounded-full text-4xl"><i class="ri-shield-check-line"></i></span>
        <h4 className="text-gray-800 text-lg font-semibold mb-2">Smart Checklist</h4>
        <p className="text-gray-500">Introducing Smart Checklist with us, the innovative solution revolutionizing the way you travel with our airline.</p>
      </div>
      <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
        <span className="inline-block p-5 mb-4 text-white bg-yellow-200 rounded-full text-4xl"><i class="ri-bookmark-2-line"></i></span>
        <h4 className="text-gray-800 text-lg font-semibold mb-2">Save More</h4>
        <p className="text-gray-500">From discounted ticket prices to exclusive promotions and deals, we prioritize affordability without compromising on quality.</p>
      </div>
    </div>
  </div>
</section>

<section className="bg-[#00163d] py-20">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
  <div className="relative">
  <img className="absolute left-1/2 transform -translate-x-1/2 rounded-full shadow-lg max-w-[350px] max-h-[450px]" src="lounge-2.jpg" alt="lounge" />
</div>
    <div>
      <h2 className="text-white text-5xl font-semibold">Unaccompanied Minor Lounge</h2>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-white text-lg font-semibold">Experience Tranquility</h4>
          <p className="text-gray-300">Serenity Haven offers a tranquil escape, featuring comfortable seating, calming ambiance, and attentive service.</p>
        </div>
        <div>
          <h4 className="text-white text-lg font-semibold">Elevate Your Experience</h4>
          <p className="text-gray-300">Designed for discerning travelers, this exclusive lounge offers premium amenities and assistance.</p>
        </div>
        <div>
          <h4 className="text-white text-lg font-semibold">A Welcoming Space</h4>
          <p className="text-gray-300">Creating a family-friendly atmosphere, The Family Zone is the perfect haven for parents and children.</p>
        </div>
        <div>
          <h4 className="text-white text-lg font-semibold">Exceptional User Experience</h4>
          <p className="text-gray-300">Engage with an intuitive and seamless interface designed to enhance your journey; every detail is crafted to ensure satisfaction at every step.</p>
        </div>
      </div>
    </div>
  </div>
</section>


        </>

    );

};

export default FlightContent;