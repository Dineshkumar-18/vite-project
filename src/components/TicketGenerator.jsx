import { useEffect, useState } from 'react';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ETicket from './ETicket';

const TicketGenerator = () => {

  const [ticketData, setTicketData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch('https://localhost:7055/api/Payment/paymentsuccess/5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
     // body: JSON.stringify({ paymentId: "some-payment-id" })
    })
    .then(response => response.json())
    .then(data => {
      console.log(ticketData)
      setTicketData(data.data);  // Set the ticket data received from the backend
    })
    .catch(error => console.error('Error fetching ticket data:', error));
  }, []);

  

  useEffect(() => {
    if (ticketData.length > 0 && !isProcessing) {
      setIsProcessing(true);
      generateAndSendAllTickets();
    }
  }, [ticketData, isProcessing]);


  
  const generateAndSendAllTickets = () => {
    // Loop through each ticket element and generate JPEG for each
    const ticketElements = document.querySelectorAll('.ticket');
    const jpegFiles = [];

    // Loop through each ticket element and generate JPEG for each
    Promise.all(
      Array.from(ticketElements).map((element, index) =>
        html2canvas(element, { scale: 2 }).then(canvas => {
          // Convert the canvas to a JPEG data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95); // Get the image as a data URL

          // Convert the data URL to a Blob
          return fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              // Create a File object for each JPEG
              const file = new File([blob], `ticket-${index + 1}.jpeg`, { type: 'image/jpeg' });
              jpegFiles.push(file);
            });
        })
      )
    ).then(() => {
      // Once all images are processed, send them to the backend
      sendTicketsToBackend(jpegFiles);
    })
    .catch(error => console.error('Error generating tickets:', error))
  };
  


  const sendTicketsToBackend = (pdfFiles) => {
    const formData = new FormData();
    formData.append("ticketinfo", JSON.stringify(ticketData));
    pdfFiles.forEach(file => formData.append('tickets', file));

    fetch('https://localhost:7055/api/Ticket/send-ticket-email', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => console.log('Files successfully sent to backend:', data))
    .catch(error => console.error('Error sending the PDFs:', error));
  };
  return (
    <div>
      {ticketData.map((ticket, index) => ( 
      <ETicket key={index} ticketInfo={ticket}/>
      ))}
   </div>
  )
}

export default TicketGenerator
