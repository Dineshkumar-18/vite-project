import { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import ETicket from './ETicket'; // Your ticket component

const TicketGenerator = ({ paymentId }) => {
  const [ticketData, setTicketData] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();

  // Fetch ticket data
  useEffect(() => {
    setCurrentMessage('Fetching ticket details...');
    fetch(`https://localhost:7055/api/Payment/paymentsuccess/${paymentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        setTicketData(data.data); // Populate ticket data
        setCurrentMessage('Ticket details fetched successfully...');
      })
      .catch(error => console.error('Error fetching ticket data:', error));
  }, [paymentId]);

  // Process tickets and send to backend
  useEffect(() => {
    if (ticketData.length > 0 && !isProcessing) {
      setIsProcessing(true);
      setCurrentMessage('Generating tickets...');
      generateAndSendTickets();
    }
  }, [ticketData, isProcessing]);

  const generateAndSendTickets = () => {
    const hiddenContainer = document.querySelector('#hidden-tickets-container');
    const ticketElements = hiddenContainer.querySelectorAll('.ticket');
    const generatedImages = [];

    Promise.all(
      Array.from(ticketElements).map((element, index) =>
        html2canvas(element, { scale: 2 }).then(canvas => {
          return new Promise(resolve => {
            canvas.toBlob(blob => {
               
            const ticketDto = ticketData[index]; // Match DTO to element
            const filename = `${ticketDto.bookingId}_${ticketDto.passengerId}_${ticketDto.ticketId}_${ticketDto.passengerName}.jpeg`;

              generatedImages.push({
                blob,
                filename: filename,
              });
              resolve();
            }, 'image/jpeg', 0.95);
          });
        })
      )
    )
      .then(() => {
        setCurrentMessage('Sending tickets via email...');
        sendImagesToBackend(generatedImages);
      })
      .catch(error => console.error('Error generating tickets:', error));
  };

  const sendImagesToBackend = images => {
    const formData = new FormData();
    formData.append('ticketInfo', JSON.stringify(ticketData));
    images.forEach(image => {
      formData.append('tickets', image.blob, image.filename);
    });

    fetch('https://localhost:7055/api/Ticket/send-ticket-email', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send tickets');
        }
        return response.json();
      })
      .then(data => {
        console.log('Tickets sent successfully:', data);
        setCurrentMessage('Tickets successfully sent! Redirecting...');
        setTimeout(() => {
          navigate('/'); // Redirect to the main page
        }, 2000);
      })
      .catch(error => console.error('Error sending tickets:', error));
  };

  return (
    <div>
      {/* Spinner and status messages */}
      <div style={{ textAlign: 'center'}}>
        <div className="spinner" style={{ margin: '20px auto' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ margin: 'auto', background: 'none', display: 'block' }}
            width="100px"
            height="100px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="#007bff"
              strokeWidth="8"
              r="40"
              strokeDasharray="188.49555921538757 64.83185307179586"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              ></animateTransform>
            </circle>
          </svg>
        </div>
        <p className='text-white font-semibold'>{currentMessage}</p>
      </div>

      {/* Hidden ticket container */}
      <div
        id="hidden-tickets-container"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {ticketData.map((ticket, index) => (
          <ETicket key={index} ticketInfo={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TicketGenerator;
