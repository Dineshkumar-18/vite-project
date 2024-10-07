const Carousel = ({ items, currentIndex, goToSlide }) => {
    return (
      <div className="overflow-hidden rounded-lg shadow-md bg-white">
        <div className="h-64 relative">
          {items.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundColor: item.bgColor }}
            >
              <div className="flex flex-col items-center justify-center h-full p-4 gap-3">
                <img src={item.imgSrc} alt={item.altText} className="rounded-md" />
                <p className="text-sm text-center font-bold text-white">{item.text}</p>
              </div>
            </div>
          ))}
  
          {/* Navigational dots */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2">
            {items.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  export default Carousel
  