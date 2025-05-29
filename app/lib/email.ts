import nodemailer from "nodemailer";
import { BondRequest } from "@/app/models/BondRequest";

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
  bondId?: string;
  bondTitle?: string;
  bondFeatures?: string[];
  features?: string[];
  bondImage?: string;
  nominalPrice?: string;
  unitPrice?: string;
  name?: string;
  registration?: string;
  email?: string;
  phone?: string;
  price?: string;
}) {
  const features = bondRequest.bondFeatures || bondRequest.features;
  const featuresList =
    features?.map((feature) => `• ${feature}`).join("\n") ||
    "No features specified";

  const bondTitle = bondRequest.bondTitle || bondRequest.bondId;
  const bondId = bondRequest.bondId;

  const isFormSubmission = bondRequest.name && bondRequest.registration;

  let formFields = "";
  if (isFormSubmission) {
    formFields = `
    <h3>Form Details:</h3>
    <p><strong>Name:</strong> ${bondRequest.name || "N/A"}</p>
    <p><strong>Registration:</strong> ${bondRequest.registration || "N/A"}</p>
    <p><strong>Email:</strong> ${bondRequest.email || "N/A"}</p>
    <p><strong>Phone:</strong> ${bondRequest.phone || "N/A"}</p>
    <p><strong>Price:</strong> ${bondRequest.price || "N/A"}</p>
    `;
  }

  const mailOptions = {
    from: '"Bond Request System" <info@apex.mn>',
    to: "it@apex.mn",
    subject: `New ${isFormSubmission ? "Form Submission" : "Bond Request"}: ${
      bondTitle || "Unknown Bond"
    }`,
    text: `
New ${isFormSubmission ? "Form Submission" : "Bond Request"} Received

Bond Details:
Title: ${bondTitle || "Unknown"}
ID: ${bondId || "Unknown"}

Features:
${featuresList}

Pricing:
Nominal Price: ${bondRequest.nominalPrice || "N/A"}
Unit Price: ${bondRequest.unitPrice || "N/A"}

${
  isFormSubmission
    ? `
Form Details:
Name: ${bondRequest.name || "N/A"}
Registration: ${bondRequest.registration || "N/A"}
Email: ${bondRequest.email || "N/A"}
Phone: ${bondRequest.phone || "N/A"}
Price: ${bondRequest.price || "N/A"}
`
    : ""
}

Please check the admin dashboard for more details.
    `,
    html: `
      <h2>New ${
        isFormSubmission ? "Form Submission" : "Bond Request"
      } Received</h2>
      <h3>Bond Details:</h3>
      <p><strong>Title:</strong> ${bondTitle || "Unknown"}</p>
      <p><strong>ID:</strong> ${bondId || "Unknown"}</p>
      
      <h3>Features:</h3>
      <pre>${featuresList}</pre>
      
      <h3>Pricing:</h3>
      <p><strong>Nominal Price:</strong> ${
        bondRequest.nominalPrice || "N/A"
      }</p>
      <p><strong>Unit Price:</strong> ${bondRequest.unitPrice || "N/A"}</p>
      
      ${isFormSubmission ? formFields : ""}
      
      <p>Please check the admin dashboard for more details.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

export async function sendBondRequestStatusEmail(
  bondRequest: BondRequest,
  status: "accepted" | "declined",
  declineReason?: string
) {
  const subject =
    status === "accepted"
      ? `Your Bond Request Has Been Accepted`
      : `Your Bond Request Has Been Declined`;

  // Get the features from either source
  const features = bondRequest.bondFeatures || bondRequest.features || [];

  // Generate a formatted features list for HTML
  const featuresList =
    features?.map((feature) => `<li>${feature}</li>`).join("") || "";

  // Extract price information from the bond request or features
  let paymentAmount = "";

  // First try to get the price from user input - handle possible comma formatting in the price
  if (bondRequest.price) {
    // Remove any commas and convert to number
    const cleanPrice = bondRequest.price.toString().replace(/,/g, "");
    if (!isNaN(Number(cleanPrice))) {
      paymentAmount = cleanPrice;
    }
  }

  // If still no valid price, extract from unit price in features
  if (!paymentAmount) {
    const unitPriceFeature = features.find((feature) =>
      feature.includes("Нэгж үнэ:")
    );

    if (unitPriceFeature) {
      // Extract just the numeric part (e.g. 5000000 from "Нэгж үнэ: ₮5,000,000")
      const priceMatch = unitPriceFeature.match(/₮([0-9,]+)/);
      if (priceMatch && priceMatch[1]) {
        // Remove any commas and convert to number
        paymentAmount = priceMatch[1].replace(/,/g, "");
      }
    }
  }

  // Format the price for display - handle potential empty values
  const price =
    paymentAmount && !isNaN(Number(paymentAmount))
      ? new Intl.NumberFormat("mn-MN").format(Number(paymentAmount))
      : "5,000,000"; // Default to 5,000,000 if we can't extract the price

  // Create HTML for accepted request with payment details
  const acceptedHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #2e7d32; margin-bottom: 10px;">Хүсэлт баталгаажлаа</h1>
        <p style="font-size: 16px; color: #4a4a4a;">
          Таны хөрөнгө оруулалтын хүсэлт амжилттай баталгаажлаа.
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Бондын мэдээлэл</h2>
        <p><strong>Нэр:</strong> ${bondRequest.bondTitle}</p>
        <p><strong>ID:</strong> ${bondRequest.bondId}</p>
        
        <h3 style="margin-top: 15px; color: #333;">Онцлогууд:</h3>
        <ul style="padding-left: 20px;">
          ${featuresList}
        </ul>
      </div>
      
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h2 style="color: #2e7d32; margin-top: 0;">Төлбөрийн мэдээлэл</h2>
        <p><strong>Дүн:</strong> ${price} ₮</p>
        <p><strong>Банк:</strong> Хаан Банк</p>
        <p><strong>Данс:</strong> 5174075663</p>
        <p><strong>Хүлээн авагч:</strong> Апекс Капитал ҮЦК ХХК</p>
        <p><strong>Гүйлгээний утга:</strong> ${
          bondRequest.name || "Хэрэглэгч"
        } - ${bondRequest.bondTitle}</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Таны мэдээлэл</h2>
        <p><strong>Нэр:</strong> ${bondRequest.name || "N/A"}</p>
        <p><strong>Регистр:</strong> ${bondRequest.registration || "N/A"}</p>
        <p><strong>И-мэйл:</strong> ${bondRequest.userEmail}</p>
        <p><strong>Утас:</strong> ${bondRequest.phone || "N/A"}</p>
        <p><strong>Үнийн дүн:</strong> ${price} ₮</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
        <p>Асуулт байвал бидэнтэй холбогдоно уу: <a href="mailto:info@apex.mn" style="color: #1976d2;">info@apex.mn</a> эсвэл <a href="tel:+97677778899" style="color: #1976d2;">+976 7777 8899</a></p>
        <p>© ${new Date().getFullYear()} Апекс Капитал. Бүх эрх хуулиар хамгаалагдсан.</p>
      </div>
    </div>
  `;

  // Create email text content
  const acceptedText = `
Хүсэлт баталгаажлаа

Таны хөрөнгө оруулалтын хүсэлт амжилттай баталгаажлаа.

БОНДЫН МЭДЭЭЛЭЛ:
Нэр: ${bondRequest.bondTitle}
ID: ${bondRequest.bondId}

Онцлогууд:
${features.map((feature) => `- ${feature}`).join("\n")}

ТӨЛБӨРИЙН МЭДЭЭЛЭЛ:
Дүн: ${price} ₮
Банк: Хаан Банк
Данс: 5174075663
Хүлээн авагч: Апекс Капитал ҮЦК ХХК
Гүйлгээний утга: ${bondRequest.name || "Хэрэглэгч"} - ${bondRequest.bondTitle}

ТАНЫ МЭДЭЭЛЭЛ:
Нэр: ${bondRequest.name || "N/A"}
Регистр: ${bondRequest.registration || "N/A"}
И-мэйл: ${bondRequest.userEmail}
Утас: ${bondRequest.phone || "N/A"}
Үнийн дүн: ${price} ₮

Асуулт байвал бидэнтэй холбогдоно уу: info@apex.mn эсвэл +976 7777 8899
  `;

  const mailOptions = {
    from: '"Bond Request System" <info@apex.mn>',
    to: bondRequest.userEmail,
    subject,
    text:
      status === "accepted"
        ? acceptedText
        : `
Your bond request has been ${status}.

Bond Details:
Title: ${bondRequest.bondTitle}
ID: ${bondRequest.bondId}

${status === "declined" ? `Reason for decline:\n${declineReason}` : ""}

Please contact us if you have any questions.
    `,
    html:
      status === "accepted"
        ? acceptedHTML
        : `
      <h2>Your bond request has been ${status}</h2>
      <h3>Bond Details:</h3>
      <p><strong>Title:</strong> ${bondRequest.bondTitle}</p>
      <p><strong>ID:</strong> ${bondRequest.bondId}</p>
      
      ${
        status === "declined"
          ? `
        <h3>Reason for decline:</h3>
        <p>${declineReason}</p>
      `
          : ""
      }
      
      <p>Please contact us if you have any questions.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}
