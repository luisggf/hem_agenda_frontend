import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import DonationConfirmation from "../cards/BloodDonationConfirmationCard";
import { toast } from "sonner"; // Assuming you're using sonner for toast notifications

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

export default function BookDonation({ localId }: { localId: number }) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [nameQuery, setNameQuery] = useState("");
  const [rg, setRg] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [donationDate, setDonationDate] = useState("");

  // Ref to track if the user has selected a person to close the suggestions
  const hasSelectedPersonRef = useRef(false);

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
        toast.error("Failed to fetch persons. Please try again.");
      }
    }
    fetchPersons();
  }, []);

  useEffect(() => {
    if (!hasSelectedPersonRef.current && nameQuery.trim() !== "") {
      const filtered = persons.filter((person) =>
        person.nome.toLowerCase().includes(nameQuery.toLowerCase())
      );
      setFilteredPersons(filtered.slice(0, 3));

      // Auto-fill RG if the name matches exactly one person
      const matchedPerson = filtered.find(
        (person) => person.nome.toLowerCase() === nameQuery.toLowerCase()
      );
      if (matchedPerson) {
        setRg(matchedPerson.rg);
        setSelectedPerson(matchedPerson); // Auto-select the matched person
      } else {
        setRg(""); // Clear RG if no exact match is found
        setSelectedPerson(null); // Reset selected person if no match is found
      }
    }
  }, [nameQuery, persons]);

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setNameQuery(person.nome);
    setRg(person.rg);
    setFilteredPersons([]); // Clear the filtered list to ensure suggestions disappear
    hasSelectedPersonRef.current = true; // Set the ref to indicate a person has been selected
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameQuery(value);
    setSelectedPerson(null); // Clear the selected person when the user types a new query
    setRg(""); // Reset the RG field when a new name is typed
    hasSelectedPersonRef.current = false; // Reset the ref when the user types again
  };

  const handleSubmit = async () => {
    // Check if the name typed matches a valid person
    const matchedPerson = persons.find(
      (person) => person.nome.toLowerCase() === nameQuery.toLowerCase()
    );

    if (!matchedPerson) {
      // Trigger an error message if no valid person is selected
      toast.error(
        "Name not found. Please select a valid person from the list."
      );
      return;
    }

    // Validate if RG is correct
    if (rg !== matchedPerson.rg) {
      toast.error("Invalid RG for the selected person.");
      return;
    }

    try {
      await axios.post("http://localhost:3333/register-donation", {
        pessoa_id: matchedPerson.id,
        local_id: localId,
      });
      setDonationDate(new Date().toISOString());
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error registering donation:", error);
      toast.error("Failed to register donation. Please try again.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="w-full">Register Donation</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold ">
            Donation Information
          </Dialog.Title>
          <Dialog.Description className="text-sm mb-10 text-black/50">
            Please provide your details to confirm your donation.{" "}
          </Dialog.Description>
          {!showConfirmation ? (
            <div className="space-y-4  outline-none">
              <div className="mb-4  outline-none">
                <label
                  htmlFor="nome"
                  className="block text-sm font-bold text-gray-700 mb-2  outline-none"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nameQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown} // Handle Enter key press
                  placeholder="Enter your name"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-200  outline-none focus:ring focus:ring-red-50"
                />

                {nameQuery && filteredPersons.length > 0 && (
                  <ul className="border mt-2 max-h-32 overflow-y-auto">
                    {filteredPersons.map((person) => (
                      <li
                        key={person.id}
                        className="p-2 cursor-pointer hover:bg-red-50"
                        onClick={() => handleSelectPerson(person)}
                      >
                        {person.nome}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="rg"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  RG
                </label>
                <input
                  type="text"
                  id="rg"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                  placeholder="Enter your RG"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-200  outline-none focus:ring focus:ring-red-50"
                  onKeyDown={handleKeyDown} // Also allow RG submission via Enter key
                />
              </div>

              <Button className="w-full" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          ) : (
            <DonationConfirmation
              donorName={selectedPerson?.nome || ""}
              bloodType={selectedPerson?.tipo_id || 0}
              donationDate={donationDate}
              donationLocationId={localId}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
