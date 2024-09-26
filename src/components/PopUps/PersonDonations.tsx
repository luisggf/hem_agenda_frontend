import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Loader, Heart, Calendar, MapPin } from "lucide-react";
import DonationConfirmation from "../cards/BloodDonationConfirmationCard";
import HamburgerMenu from "../Menu/HamburguerMainMenu";
import { toast } from "sonner"; // Importing Button and toast from Sonner

interface Person {
  id: number;
  nome: string;
  rua: string;
  numero: string;
  complemento: string;
  rg: string;
  tipo_id: number;
  cidade_id: number;
}

interface Donation {
  tipo_sanguineo: number;
  id: number;
  data: string;
  created_at: string;
  updated_at: string;
  local: DonationLocal;
  pessoa_id: number;
  local_id: number;
}

interface DonationLocal {
  id: number;
  nome: string;
  rua: string;
  numero: string;
  complemento: string;
  created_at: string;
  updated_at: string;
  cidade_id: number;
}

export default function CheckPersonsDonations() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [nameQuery, setNameQuery] = useState("");
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPersons() {
      try {
        const response = await axios.get("http://localhost:3333/getPersons");
        if (Array.isArray(response.data.Pessoas)) {
          setPersons(response.data.Pessoas);
        } else {
          console.error("Invalid data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    }
    fetchPersons();
  }, []);

  useEffect(() => {
    if (Array.isArray(persons)) {
      const filtered = persons.filter((person) =>
        person.nome.toLowerCase().includes(nameQuery.toLowerCase())
      );
      setFilteredPersons(filtered.slice(0, 3));
    } else {
      console.error("Persons data is not an array:", persons);
    }
  }, [nameQuery, persons]);

  const handleSelectPerson = async (person: Person) => {
    setSelectedPerson(person);
    setNameQuery(""); // Clear the query to close the suggestion list
    setFilteredPersons([]); // Clear the filtered list to ensure suggestions disappear
    setIsLoading(true); // Set loading to true during data fetching

    try {
      const response = await axios.get(
        `http://localhost:3333/donations-from-person/${person.id}`
      );
      const donationsFromPerson = response.data;
      setDonations(donationsFromPerson || []);
    } catch (error) {
      console.error("Error fetching person details:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  const handleSearch = () => {
    if (nameQuery.trim() === "") {
      toast.error("Please enter a valid name");
      return;
    }
    if (filteredPersons.length > 0) {
      handleSelectPerson(filteredPersons[0]); // Select the first person if found
    } else {
      toast.error("No person found with this name");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search on Enter key press
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm">
        <p className="flex items-center justify-center">
          <Heart className="h-6 w-6 text-red-500" />
          <span className="ml-2 text-lg font-bold">Hem Agenda</span>
        </p>
        <HamburgerMenu></HamburgerMenu>
      </header>

      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-center mb-6">
              Check Person's Donations
            </h1>
            <div className="max-w-md mx-auto">
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nome"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  onKeyDown={handleKeyPress} // Add key press event handler
                  placeholder="Enter name to search"
                  className="w-full px-4 py-2 rounded-md border-2 border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {nameQuery && filteredPersons.length > 0 && (
                <ul className="mt-2 border border-gray-200 rounded-md shadow-sm bg-white">
                  {filteredPersons.map((person) => (
                    <li
                      key={person.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectPerson(person)}
                    >
                      {person.nome}
                    </li>
                  ))}
                </ul>
              )}
              <button
                className=" bg-black text-white hover:bg-black/80 p-2 w-1/2 mt-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </section>

        {selectedPerson && (
          <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
            <div className="container px-4 md:px-6 mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
                {selectedPerson.nome} colaborations
              </h2>
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Loader className="animate-spin h-8 w-8 text-red-600" />
                </div>
              ) : donations.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {donations.map((donation) => (
                    <div
                      key={donation.id}
                      className="flex flex-col p-6 bg-white rounded-lg shadow-lg"
                    >
                      <div className="flex items-center mb-4 text-red-500">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span className="font-semibold">
                          {new Date(donation.data).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {donation.local.nome}
                      </h3>
                      <div className="flex items-center mb-4 text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>
                          {donation.local.rua}, {donation.local.numero}
                          {donation.local.complemento &&
                            `, ${donation.local.complemento}`}
                        </span>
                      </div>
                      <DonationConfirmation
                        donorName={selectedPerson.nome}
                        bloodType={selectedPerson.tipo_id}
                        donationDate={donation.data}
                        donationLocationId={donation.local_id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 text-lg">
                  No donations found.
                </div>
              )}
            </div>
          </section>
        )}
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
