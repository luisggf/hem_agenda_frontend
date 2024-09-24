import axios from "axios";
import React, { useEffect, useState } from "react";

interface LocaisColeta {
  id: number;
  nome: string;
  rua: string;
  numero: string;
  complemento?: string;
  created_at: string;
  updated_at: string;
  cidade_id: number;
}

interface DonationConfirmationProps {
  donorName: string;
  bloodType: string;
  donationDate: string;
  donationLocationId: number;
}

const DonationConfirmation: React.FC<DonationConfirmationProps> = ({
  donorName,
  bloodType,
  donationDate,
  donationLocationId,
}) => {
  const [donationLocation, setDonationLocation] = useState<LocaisColeta | null>(
    null
  );

  useEffect(() => {
    async function fetchDonationLocation() {
      try {
        const response = await axios.get(
          `http://localhost:3333/donation-local/${donationLocationId}`
        );
        setDonationLocation(response.data);
      } catch (error) {
        console.error("Error fetching donation location:", error);
      }
    }
    fetchDonationLocation();
  }, [donationLocationId]);

  const exportToPDF = () => {
    console.log("Export to PDF functionality to be implemented");
  };

  const downloadAsJPEG = () => {
    console.log("Download as JPEG functionality to be implemented");
  };

  const shareViaWhatsApp = () => {
    const text = `I just donated blood! Type: ${bloodType}, Date: ${donationDate}, Location: ${donationLocation?.nome}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!donationLocation) {
    return <div>Loading donation location...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-red-50 to-red-100 shadow-lg rounded-lg">
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold text-red-700">
          Blood Donation Confirmation
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center">
          <span className="text-lg px-4 py-2 bg-white border border-red-500 rounded-full">
            {bloodType}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-700">
            <span className="font-medium">{donorName}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <span>{donationDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <span>
              <span>
                {donationLocation.nome}, {donationLocation.rua},{" "}
                {donationLocation.numero}
                {donationLocation.complemento &&
                  `, ${donationLocation.complemento}`}
              </span>
            </span>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-4">
          Thank you for your life-saving donation!
        </div>
      </div>
      <div className="flex justify-center space-x-2 p-6">
        <button
          onClick={exportToPDF}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          PDF
        </button>
        <button
          onClick={downloadAsJPEG}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          JPEG
        </button>
        <button
          onClick={shareViaWhatsApp}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          WhatsApp
        </button>
      </div>
    </div>
  );
};

export default DonationConfirmation;
