/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import SignUpDialog from "./popups/SignUpDialog";
import {
  Calendar,
  Heart,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BloodDonationDialog from "./popups/BookDonationDialog";
import HamburgerMenu from "./Menu/HamburguerMainMenu";

// Update interface to match the API structure
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

interface City {
  id: number;
  nome: string;
}

export default function Home() {
  const [donationLocations, setDonationLocations] = useState<LocaisColeta[]>(
    []
  );
  const [cityNames, setCityNames] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Fetch data from API
  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const response = await fetch("http://localhost:3333/getDonationsLocal");
        const data = await response.json();
        setDonationLocations(data);
      } catch (error) {
        console.error("Error fetching donation locations:", error);
      }
    };

    fetchAllLocations();
  }, []);

  const fetchCityName = async (cidadeId: number) => {
    if (!cityNames[cidadeId]) {
      try {
        const response = await fetch(`http://localhost:3333/city/${cidadeId}`);
        const cityData: City = await response.json();
        setCityNames((prevState) => ({
          ...prevState,
          [cidadeId]: cityData.nome,
        }));
      } catch (error) {
        console.error(`Error fetching city name for ID: ${cidadeId}`, error);
      }
    }
  };

  useEffect(() => {
    donationLocations.forEach((location) => fetchCityName(location.cidade_id));
  }, [donationLocations]);

  const totalPages = Math.ceil(donationLocations.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = donationLocations.slice(
    startIndex,
    startIndex + cardsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <p className="flex items-center justify-center">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="ml-2 text-lg font-bold">Hem Agenda</span>
        </p>
        <HamburgerMenu></HamburgerMenu>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-red-50 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  <span className="text-red-500 flex flex-col text-8xl font-extrabold">
                    Save Lives
                  </span>{" "}
                  Donate Blood Today
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your donation can save up to three lives. Join our community
                  of heroes and make a difference today.
                </p>
              </div>
              <div className="space-x-4 w-1/4">
                <SignUpDialog></SignUpDialog>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white flex justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Upcoming Donation Events
            </h2>
            <div className="relative h-[350px] mt-8">
              <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-gray-50 to-transparent z-100"></div>

              <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-red-300 hover:scrollbar-thumb-red-500 transition-colors duration-200 px-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
                  {currentCards.length > 0 ? (
                    currentCards.map((location) => (
                      <div
                        key={location.id}
                        className="flex flex-col p-6 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-md hover:shadow-red-300 transition-all duration-300"
                      >
                        <div className="flex items-center mb-4 text-red-500">
                          <Calendar className="w-5 h-5 mr-2" />
                          <span className="font-semibold">
                            {new Date(location.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {location.nome}
                        </h3>
                        <div className="flex items-center mb-2 text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>9:00 AM - 5:00 PM</span>
                        </div>
                        <div className="flex items-center mb-4 text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>
                            {location.rua}, {location.numero},{" "}
                            {cityNames[location.cidade_id] || "Loading..."}
                          </span>
                        </div>
                        <BloodDonationDialog
                          localId={location.id}
                        ></BloodDonationDialog>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming donation events available.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronLeft />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </section>
        <section className="w-full p-52 bg-red-50 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Become a Regular Donor
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Sign up to receive notifications about upcoming blood drives
                  and track your donation history.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <SignUpDialog></SignUpDialog>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 BloodDonate. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </p>
          <p className="text-xs hover:underline underline-offset-4">Privacy</p>
        </nav>
      </footer>
    </div>
  );
}
