import React from 'react';



const SliderComponent = () => {
  return (
    <div className="relative flex items-center bg-white border border-neutral-100 rounded-b-lg">
      <div className="relative flex items-center">
        <svg
          viewBox="0 0 40 40"
          height="40"
          width="40"
          className="absolute left-[-22px] top-1/2 transform -translate-y-1/2 text-secondary-500 cursor-pointer"
        >
          <g transform="rotate(-180 20 20.0091465)" fill="none" fillRule="evenodd">
            <rect fill="#FFF" transform="matrix(-1 0 0 1 40 0)" width="40" height="40" rx="20"></rect>
            <rect stroke="currentColor" transform="matrix(-1 0 0 1 40 0)" x="0.5" y="0.5" width="39" height="39" rx="19.5"></rect>
            <path d="M20 26.2928932L19.4821068 25.775l5.4-5.4H13.5v-.75h11.3821068l-5.4-5.4L20 13.7071068 26.2928932 20 20 26.2928932z" stroke="currentColor"></path>
          </g>
        </svg>

        <svg
          viewBox="0 0 40 40"
          height="40"
          width="40"
          className="absolute right-[-22px] top-1/2 transform -translate-y-1/2 text-secondary-500 cursor-pointer"
        >
          <g transform="translate(0 .018293)" fill="none" fillRule="evenodd">
            <rect fill="#FFF" transform="matrix(-1 0 0 1 40 0)" width="40" height="40" rx="20"></rect>
            <rect stroke="currentColor" transform="matrix(-1 0 0 1 40 0)" x="0.5" y="0.5" width="39" height="39" rx="19.5"></rect>
            <path d="M20 26.2928932L19.4821068 25.775l5.4-5.4H13.5v-.75h11.3821068l-5.4-5.4L20 13.7071068 26.2928932 20 20 26.2928932z" stroke="currentColor"></path>
          </g>
        </svg>
      </div>

      <div className="relative flex items-center overflow-x-auto overflow-y-hidden hide-scrollbar min-h-[260px] h-[328px]">
        <div className="flex items-center min-h-[260px] h-[440px]">
          <div className="flex-inline">
            <svg
              viewBox="0 0 240 236"
              className="h-full"
              height="264"
              style={{ transform: 'rotate(0deg)', width: 'calc(268.475px)' }}
            >
              <g fill="none" fillRule="evenodd">
                <path fill="#F7F7F7" fillOpacity="0.01" d="M0 0h240v236H0z"></path>
                <path fill="#FFF" d="M210.760609 234.096774S220.507073 234.731183 240 236V0c-19.492927 1.2688172-29.239391 1.90322581-29.239391 1.90322581C157.418708 1.90322581 40 62.1659084 40 118c0 55.834092 117.418708 116.096774 170.760609 116.096774z"></path>
                <g fill="#E6E6E6">
                  <path d="M135.161 66.612L158 70.419l-15.226 43.774h-22.839zM171.322 45.677h3.807l-15.226 20.935-22.839-3.806zM119.935 121.806h22.839L158 165.58l-22.839 3.807zM137.064 173.193l22.839-3.806 15.226 20.935h-3.807z"></path>
                </g>
              </g>
            </svg>
          </div>

          <div className="flex-inline">
            <div className="relative bg-white w-full flex-inline flex-nowrap py-5 px-4">
              <svg
                viewBox="0 0 40 44"
                width="40"
                height="44"
                className="absolute left-[-40px] top-1/2 transform -translate-y-1/2"
              >
                <path fill="#E6E6E6" fillRule="evenodd" d="M40 31.429V12.571H21.538V0L0 22l21.538 22V31.429z"></path>
              </svg>

              <div className="flex flex-col items-start justify-between space-y-5 flex-nowrap">
                <div className="rounded-b-lg bg-neutral-0 px-1">
                  <svg width="20" height="8">
                    <path d="M4.44141856 7.5v-.7910156H.95509044V4.28710937H4.2607545v-.78125H.95509044V1.24511719h3.48632812V.45410156H.07618419V7.5h4.36523437zm1.88772974 0l1.8798829-2.77832031h.078125L10.1328593 7.5h1.0546875L8.7998515 3.99414062 11.2412577.45410156h-1.0009765L8.3555155 3.25683594h-.078125L6.4219218.45410156H5.36235147L7.745164 3.95507812 5.33305459 7.5h.99609371zm6.8877298 0V.45410156h-.8789062V7.5h.8789062zm4.2656595 0V1.24511719h2.2705078V.45410156h-5.4199219v.79101563h2.2705078V7.5h.8789063z" fill="#999" fillRule="nonzero"></path>
                  </svg>
                </div>
                <div className="rounded-t-lg bg-neutral-0 px-1">
                  <svg width="20" height="8">
                    <path d="M4.44141856 7.5v-.7910156H.95509044V4.28710937H4.2607545v-.78125H.95509044V1.24511719h3.48632812V.45410156H.07618419V7.5h4.36523437zm1.88772974 0l1.8798829-2.77832031h.078125L10.1328593 7.5h1.0546875L8.7998515 3.99414062 11.2412577.45410156h-1.0009765L8.3555155 3.25683594h-.078125L6.4219218.45410156H5.36235147L7.745164 3.95507812 5.33305459 7.5h.99609371zm6.8877298 0V.45410156h-.8789062V7.5h.8789062zm4.2656595 0V1.24511719h2.2705078V.45410156h-5.4199219v.79101563h2.2705078V7.5h.8789063z" fill="#999" fillRule="nonzero"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start justify-between space-y-5 sticky bg-white z-20 py-5 pl-2 left-0">
              <div className="text-neutral-400 flex items-center justify-center text-2xl" style={{ margin: '2px 6px', height: '24px', width: '24px' }}>F</div>
              <div className="text-neutral-400 flex items-center justify-center text-2xl" style={{ margin: '2px 6px', height: '24px', width: '24px' }}>E</div>
              <div className="text-neutral-400 flex items-center justify-center text-2xl" style={{ margin: '2px 6px', height: '24px', width: '24px' }}>D</div>
              <div className="text-neutral-400 flex items-center justify-center text-2xl" style={{ margin: '2px 6px', height: '24px', width: '24px' }}>X</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default SliderComponent;
