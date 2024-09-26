import { useState, useEffect } from "react";
import SignUpDialog from "./popups/SignUpDialog";
import { Button } from "./ui/button";
import { Calendar, Heart, Clock, MapPin } from "lucide-react";
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
  cidade_id: number; // Use cidade_id directly
}

export default function Home() {
  const [donationLocations, setDonationLocations] = useState<LocaisColeta[]>(
    []
  );

  // Fetch data from API
  useEffect(() => {
    const fetchAllLocations = async () => {
      try {
        const response = await fetch("http://localhost:3333/getDonationsLocal");
        const data = await response.json();

        setDonationLocations(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching donation locations:", error);
      }
    };
    fetchAllLocations();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <p className="flex items-center justify-center">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="ml-2 text-lg font-bold">Hem Agenda</span>
        </p>
        <HamburgerMenu></HamburgerMenu>
        {/* <nav className="ml-auto flex gap-4 sm:gap-6">
          <p className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </p>
          <p className="text-sm font-medium hover:underline underline-offset-4">
            Schedule
          </p>
          <p className="text-sm font-medium hover:underline underline-offset-4">
            About
          </p>
          <p className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </p>
        </nav> */}
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-red-50 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Save Lives, Donate Blood
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your donation can save up to three lives. Join our community
                  of heroes and make a difference today.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Schedule Donation</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white flex justify-center">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Upcoming Donation Events
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {donationLocations.length > 0 ? (
                donationLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex flex-col p-6 bg-white rounded-lg shadow-lg"
                  >
                    <div className="flex items-center mb-4 text-red-500">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="font-semibold">
                        {new Date(location.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{location.nome}</h3>
                    <div className="flex items-center mb-2 text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center mb-4 text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {location.rua}, {location.numero}, Cidade ID:{" "}
                        {location.cidade_id}
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
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-50 flex justify-center">
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
