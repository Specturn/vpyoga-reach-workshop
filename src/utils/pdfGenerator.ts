import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Registration } from '../types/registration';
import logoImage from '../assets/images/logo.png';

// Generate a unique verification code
const generateVerificationCode = (registration: Registration): string => {
  const data = `${registration.id}-${registration.email}-${registration.timestamp}`;
  return btoa(data).substring(0, 12).toUpperCase();
};

// Generate QR code data for verification
const generateQRData = (registration: Registration): string => {
  const verificationCode = generateVerificationCode(registration);
  const verificationUrl = `${window.location.origin}/verify-ticket/${verificationCode}`;
  return verificationUrl;
};

export const generateTicketPDF = async (registration: Registration) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Security features
  const verificationCode = generateVerificationCode(registration);
  const qrData = generateQRData(registration);
  
  // Generate QR code
  let qrCodeDataUrl: string;
  try {
    qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    qrCodeDataUrl = '';
  }
  
  // Add security watermark
  doc.setTextColor(220, 220, 220); // Much lighter gray for subtle watermark
  doc.setFontSize(35);
  doc.text('REACH : THE BEST VERSION OF YOU', pageWidth * 2/3, pageHeight * 2/3, { angle: 45, align: 'center' });
  
  // Reset text color for content
  doc.setTextColor(0, 0, 0);
  
  // Header with logo - centered at top
  // Calculate center position
  const logoSize = 25;
  const textWidth = 120; // Approximate width of text
  const totalWidth = logoSize + 10 + textWidth;
  const startX = (pageWidth - totalWidth) / 2;
  
  // Add logo
  const logoX = startX;
  const logoY = 20; // Moved down slightly
  doc.addImage(logoImage, 'PNG', logoX, logoY, logoSize, logoSize);
  
  // Text positioned to the right of logo
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 128, 128); // Teal color for main text
  doc.text('Vishwa Poornima\'s', logoX + logoSize + 10, 30, { align: 'left' });
  
  // Separator line - closer to text
  doc.setDrawColor(64, 64, 64); // Dark gray color
  doc.line(logoX + logoSize + 10, 33, logoX + logoSize + 10 + 60, 33);
  
  // Tagline - smaller and closer
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(64, 64, 64); // Dark gray color
  doc.text('Yoga Centre for Complete Health', logoX + logoSize + 10, 38, { align: 'left' });
  
  // Reset colors for rest of content
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
  
  // Security notice - improved styling and spacing
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(128, 0, 0); // Dark red color for emphasis
  doc.text('This is an official ticket. Any alterations will invalidate this ticket.', pageWidth / 2, 55, { align: 'center' });
  
  // Ticket details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0); // Black for headers
  doc.text('Participant Details:', 20, 70);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(64, 64, 64); // Dark gray for content
  doc.text(`Name: ${registration.fullName}`, 20, 85);
  doc.text(`Email: ${registration.email}`, 20, 95);
  doc.text(`Phone: ${registration.phone}`, 20, 105);
  doc.text(`Age: ${registration.age}`, 20, 115);
  doc.text(`Experience: ${registration.experience}`, 20, 125);
  
  // Workshop details
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0); // Black for headers
  doc.text('Workshop Details:', 20, 150);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(64, 64, 64); // Dark gray for content
  doc.text('Event: REACH - The Best Version of You', 20, 165);
  doc.text('Dates: August 9th & 10th, 2025', 20, 175);
  doc.text('Venue: Fireflies Intercultural Center', 20, 185);
  doc.text('Address: Kanakapura Road, Kaggalipura, Bengaluru', 20, 195);
  
  // Payment verification
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0); // Black for headers
  doc.text('Payment Verification:', 20, 220);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(64, 64, 64); // Dark gray for content
  doc.text(`Transaction ID: ${registration.transactionId}`, 20, 235);
  doc.text(`Payment Status: ${registration.paymentConfirmed ? 'CONFIRMED' : 'PENDING'}`, 20, 245);
  doc.text(`Registration ID: ${registration.id}`, 20, 255);
  
  // Security features - using same dark red color as security notice
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(128, 0, 0); // Dark red for security features
  doc.text('Security Features:', 20, 280);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 0, 0); // Dark red for security content
  doc.text(`Verification Code: ${verificationCode}`, 20, 295);
  doc.text(`Generated: ${new Date(registration.timestamp).toLocaleString()}`, 20, 305);
  doc.text(`Verify Online: ${window.location.origin}/verify-ticket/${verificationCode}`, 20, 315);
  
  // Add QR code if generated successfully
  if (qrCodeDataUrl) {
    // Position QR code in bottom-right corner with proper spacing
    const qrSize = 60;
    const qrX = pageWidth - qrSize - 20; // 20px margin from right
    const qrY = pageHeight - qrSize - 40; // 40px margin from bottom
    
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    
    // Add QR code label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Scan to verify ticket', qrX + qrSize/2, qrY + qrSize + 5, { align: 'center' });
  }
  
  // Footer text - positioned at the very bottom after QR code
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('For verification, scan QR code or visit the verification URL above.', pageWidth / 2, pageHeight - 25, { align: 'center' });
  doc.text('This ticket is valid only for the registered participant.', pageWidth / 2, pageHeight - 20, { align: 'center' });
  
  // Save the PDF
  doc.save(`REACH-Workshop-Ticket-${registration.fullName.replace(/\s+/g, '-')}.pdf`);
};