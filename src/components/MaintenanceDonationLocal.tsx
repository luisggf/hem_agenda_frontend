/* eslint-disable react-hooks/exhaustive-deps */
import UpdateDonationLocationDialog from "./popups/UpdateDonationLocationDialog";
import ConfirmationPopup from "./popups/DeleteConfirmationDialog";
import HamburgerMenu from "./Menu/HamburguerMainMenu";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Heart,
} from "lucide-react";

interface DonationLocal {
  id: number;
  nome: string;
  rua: string;
  numero: string;
  complemento?: string;
  created_at: string;
  updated_at: string;
  cidade_id: number;
  estado: string;
}

export default function MaintenanceDonationLocal() {
  const [donationLocals, setDonationLocals] = useState<DonationLocal[]>([]);
  const [filteredLocals, setFilteredLocals] = useState<DonationLocal[]>([]);
  const [cityNames, setCityNames] = useState<{ [key: number]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const localsPerPage = 6;

  useEffect(() => {
    fetchDonationLocals();
  }, []);

  const fetchDonationLocals = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/getDonationsLocal"
      );
      setDonationLocals(response.data);
      setFilteredLocals(response.data);
      fetchCityNames(response.data);
      toast.success("Donation locations fetched successfully!");
    } catch (error) {
      console.error("Error fetching donation locals:", error);
      toast.error("Failed to fetch donation locations.");
    }
  };

  const fetchCityNames = async (locals: DonationLocal[]) => {
    const cities: { [key: number]: string } = {};
    await Promise.all(
      locals.map(async (local) => {
        if (!cities[local.cidade_id]) {
          try {
            const cityResponse = await axios.get(
              `http://localhost:3333/city/${local.cidade_id}`
            );
            cities[local.cidade_id] = cityResponse.data.nome;
          } catch (error) {
            console.error(
              `Error fetching city with id ${local.cidade_id}:`,
              error
            );
          }
        }
      })
    );
    setCityNames(cities);
  };

  const handleSearch = () => {
    let result = [...donationLocals];

    if (searchQuery) {
      result = result.filter((local) =>
        local.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      } else {
        return a.nome.localeCompare(b.nome);
      }
    });

    setFilteredLocals(result);
  };
  useEffect(() => {
    handleSearch();
  }, [sortBy, donationLocals]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const indexOfLastLocal = currentPage * localsPerPage;
  const indexOfFirstLocal = indexOfLastLocal - localsPerPage;
  const currentLocals = filteredLocals.slice(
    indexOfFirstLocal,
    indexOfLastLocal
  );
  const totalPages = Math.ceil(filteredLocals.length / localsPerPage);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between bg-white shadow-sm">
        <p className="flex items-center">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="ml-2 text-lg font-bold">Hem Agenda</span>
        </p>
        <HamburgerMenu />
      </header>

      <main className="flex-grow">
        <section className="bg-red-50 py-32">
          <div className="flex flex-col w-full mx-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-6xl lg:text-7xl/none text-center mb-6">
              Current Donations spots...
            </h1>

            <div className="mx-auto w-full max-w-lg">
              <h1 className="block text-sm font-medium text-gray-700 text-start mb-2 ml-2">
                Search bar...
              </h1>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                className="bg-black flex justify-center mt-2 w-full text-white hover:bg-black/80 p-2 mx-auto rounded-md text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="py-4">
          <div className="container space-y-4 mx-auto px-4 pb-36">
            <div className="w-full md:w-1/4 p-4 flex flex-col sm:flex-row gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "name")}
                className="w-full sm:w-1/2 border border-gray-300 rounded-md p-2"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
            <div className="relative h-[350px] mt-8">
              <div className="absolute inset-x-0 bottom-0 h-16 pointer-events-none bg-gradient-to-t from-gray-50 to-transparent z-100"></div>

              <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-red-300 hover:scrollbar-thumb-red-500 transition-colors duration-200 px-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-16">
                  {currentLocals.length > 0 ? (
                    currentLocals.map((location) => (
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
                        <div className="flex space-x-1">
                          <UpdateDonationLocationDialog
                            location={location}
                          ></UpdateDonationLocationDialog>
                          <ConfirmationPopup
                            location={location}
                          ></ConfirmationPopup>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No upcoming donation events available.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-2">
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
      </main>
    </div>
  );
}
