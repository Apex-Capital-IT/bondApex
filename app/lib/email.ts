import nodemailer from 'nodemailer';
import { BondRequest } from '@/app/models/BondRequest';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendBondRequestEmail(bondRequest: {
  bondId: string;
  bondTitle: string;
  features?: string[];
  nominalPrice?: string;
  unitPrice?: string;
}) {
  const featuresList = bondRequest.features?.map(feature => `• ${feature}`).join('\n') || 'No features specified';
  
  const mailOptions = {
    from: '"Bond Request System" <info@apex.mn>',
    to: 'it@apex.mn',
    subject: `New Bond Request: ${bondRequest.bondTitle}`,
    text: `
New Bond Request Received

Bond Details:
Title: ${bondRequest.bondTitle}
ID: ${bondRequest.bondId}

Features:
${featuresList}

Pricing:
Nominal Price: ${bondRequest.nominalPrice || 'N/A'}
Unit Price: ${bondRequest.unitPrice || 'N/A'}

Please check the admin dashboard for more details.
    `,
    html: `
      <h2>New Bond Request Received</h2>
      <h3>Bond Details:</h3>
      <p><strong>Title:</strong> ${bondRequest.bondTitle}</p>
      <p><strong>ID:</strong> ${bondRequest.bondId}</p>
      
      <h3>Features:</h3>
      <pre>${featuresList}</pre>
      
      <h3>Pricing:</h3>
      <p><strong>Nominal Price:</strong> ${bondRequest.nominalPrice || 'N/A'}</p>
      <p><strong>Unit Price:</strong> ${bondRequest.unitPrice || 'N/A'}</p>
      
      <p>Please check the admin dashboard for more details.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendBondRequestStatusEmail(
  bondRequest: BondRequest,
  status: 'accepted' | 'declined',
  declineReason?: string
) {
  const subject = status === 'accepted' 
    ? `Your Bond Request Has Been Accepted`
    : `Your Bond Request Has Been Declined`;

  const mailOptions = {
    from: '"Bond Request System" <info@apex.mn>',
    to: bondRequest.userEmail,
    subject,
    text: `
Your bond request has been ${status}.

Bond Details:
Title: ${bondRequest.bondTitle}
ID: ${bondRequest.bondId}

${status === 'declined' ? `Reason for decline:\n${declineReason}` : ''}

Please contact us if you have any questions.
    `,
    html: `
      <h2>Your bond request has been ${status}</h2>
      <h3>Bond Details:</h3>
      <p><strong>Title:</strong> ${bondRequest.bondTitle}</p>
      <p><strong>ID:</strong> ${bondRequest.bondId}</p>
      
      ${status === 'declined' ? `
        <h3>Reason for decline:</h3>
        <p>${declineReason}</p>
      ` : ''}
      
      <p>Please contact us if you have any questions.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully to:', bondRequest.userEmail);
  } catch (error) {
    console.error('Error sending status update email:', error);
    throw error;
  }
} 