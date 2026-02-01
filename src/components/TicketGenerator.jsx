import { useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import ETicket from './ETicket';

const TicketGenerator = ({ ticket, status, onComplete }) => {
  const navigate = useNavigate();

  let url;
  switch (status) {
    case 'CANCELLED':
      url = 'https://localhost:7055/api/Ticket/send-cancel-ticket-email';
      break;
    case 'CONFIRMED':
      url = 'https://localhost:7055/api/Ticket/send-ticket-email';
      break;
    default:
      url = '';
  }

  useEffect(() => {
    if (ticket?.length > 0) {
      // Small delay ensures hidden DOM is rendered
      const timer = setTimeout(() => {
        generateAndSendTickets();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [ticket]);

  const generateAndSendTickets = async () => {
    const hiddenContainer = document.querySelector('#hidden-tickets-container');
    if (!hiddenContainer) {
      console.error('Hidden container not found.');
      return;
    }

    const ticketElements = hiddenContainer.querySelectorAll('.ticket');
    if (!ticketElements.length) {
      console.error('No ticket elements found.');
      return;
    }


    const generatedImages = [];

    try {
      // ✅ Must return a Promise for each map iteration
      await Promise.all(
        Array.from(ticketElements).map((element) => {
          const ticketId = element.dataset.ticketId;
          const ticketDto = ticket.find((t) => t.ticketId == ticketId);
          if (!ticketDto) return Promise.resolve();

          return html2canvas(element, { scale: 2 }).then((canvas) => {
            return new Promise((resolve) => {
              canvas.toBlob((blob) => {
                if (!blob) return resolve();

                const filename = `${ticketDto.bookingId}_${ticketDto.passengerId}_${ticketDto.ticketId}_${ticketDto.passengerName}_${status === 'CANCELLED' ? 'Cancelled' : ''}.jpeg`;

                generatedImages.push({
                  blob,
                  filename,
                  ticketInfo: ticketDto,
                });
                resolve();
              }, 'image/jpeg', 0.95);
            });
          });
        })
      );

      console.log('✅ All tickets generated:', generatedImages.length);
      await sendImagesToBackend(generatedImages);
    } catch (error) {
      console.error('❌ Error generating tickets:', error);
    }
  };

  const sendImagesToBackend = async (images) => {
    if (!images.length) {
      console.warn('No images to send.');
      return;
    }

    const formData = new FormData();
    const ticketInfos = images.map((image) => image.ticketInfo);

    formData.append('ticketInfo', JSON.stringify(ticketInfos));
    images.forEach((image) => formData.append('tickets', image.blob, image.filename));

    console.log('📤 Sending ticket info:', ticketInfos);

    try {
      const response = await fetch(url, { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Failed to send tickets');
      const data = await response.json();
      console.log('✅ Tickets sent successfully:', data);
      onComplete();
      // Optionally navigate after completion
      // navigate('/');
    } catch (error) {
      console.error('❌ Error sending tickets:', error);
    }
  };

  return (
    <div>
      {/* Hidden container for ticket rendering */}
      <div
        id="hidden-tickets-container"
        className='min-h-screen container mx-auto px-4 flex justify-center items-center'
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {ticket.map((t, index) => (
          // ✅ Ensure ETicket root element has class "ticket" and data-ticket-id
          
            <ETicket key={t.ticketId} ticketInfo={t} />
        ))}
      </div>
    </div>
  );
};

export default TicketGenerator;
