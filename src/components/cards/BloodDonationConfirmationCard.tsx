import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { FileArchive, FileImage, Share2 } from "lucide-react";

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

interface BloodType {
  id: number;
  tipo: string;
  fator: string;
}

interface DonationConfirmationProps {
  donorName: string;
  bloodType: number;
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
  const [bloodTypeInfo, setBloodTypeInfo] = useState<BloodType | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    async function fetchBloodType() {
      try {
        const response = await axios.get(
          `http://localhost:3333/bloodtype/${bloodType}`
        );
        setBloodTypeInfo(response.data.Blood_Type);
      } catch (error) {
        console.error("Error fetching blood type:", error);
      }
    }
    fetchBloodType();
  }, [bloodType]);

  const exportToPDF = () => {
    setIsExporting(true);
    const input = componentRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save("donation_confirmation.pdf");
        setIsExporting(false);
      });
    }
  };

  const downloadAsJPEG = () => {
    setIsExporting(true);
    const input = componentRef.current;
    if (input) {
      html2canvas(input).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/jpeg");
        link.download = "donation_confirmation.jpeg";
        link.click();
        setIsExporting(false);
      });
    }
  };

  const shareViaWhatsApp = () => {
    const text = `I just donated blood! Type: ${
      bloodTypeInfo?.fator
    }, Date: ${format(new Date(donationDate), "MMMM d, yyyy")}, Location: ${
      donationLocation?.nome
    }`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!donationLocation || !bloodTypeInfo) {
    return <div className="text-center p-4">Loading donation details...</div>;
  }

  return (
    <div
      ref={componentRef}
      className="w-full max-w-md mx-auto bg-gradient-to-br from-red-50 to-red-100 shadow-lg rounded-2xl overflow-hidden"
    >
      <div className="bg-red-500 text-white text-center p-6">
        <h2 className="text-3xl font-bold">Blood Donation Confirmation</h2>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center">
          <span className="text-2xl px-6 py-3 bg-white border-2 border-red-500 rounded-full font-bold text-red-600">
            {bloodTypeInfo.fator}
          </span>
        </div>
        <div className="space-y-3">
          <div className="text-center">
            <span className="font-medium text-xl text-gray-800">
              {donorName}
            </span>
          </div>
          <div className="text-center">
            <span className="text-gray-600">
              {format(new Date(donationDate), "MMMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          <div className="text-center">
            <span className="text-gray-600">
              {donationLocation.nome}, {donationLocation.rua},{" "}
              {donationLocation.numero}
              {donationLocation.complemento &&
                `, ${donationLocation.complemento}`}
            </span>
          </div>
        </div>
        <div className="text-center text-lg text-red-600 font-medium mt-6">
          Thank you for your life-saving donation!
        </div>
      </div>
      {!isExporting && (
        <div className="flex justify-center space-x-4 p-6 bg-gray-50">
          <button
            onClick={exportToPDF}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
            aria-label="Export to PDF"
          >
            <FileArchive size={24} />
          </button>
          <button
            onClick={downloadAsJPEG}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
            aria-label="Download as JPEG"
          >
            <FileImage size={24} />
          </button>
          <button
            onClick={shareViaWhatsApp}
            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
            aria-label="Share via WhatsApp"
          >
            <Share2 size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationConfirmation;
