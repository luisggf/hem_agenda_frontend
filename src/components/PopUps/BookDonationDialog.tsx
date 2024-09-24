import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import DonationConfirmation from "../cards/BloodDonationConfirmationCard";

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

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setNameQuery(person.nome);
    setRg(person.rg);
    setFilteredPersons([]);
  };

  const handleSubmit = async () => {
    if (selectedPerson) {
      try {
        await axios.post("http://localhost:3333/register-donation", {
          pessoa_id: selectedPerson.id,
          local_id: localId,
        });
        setDonationDate(new Date().toISOString());
        setShowConfirmation(true);
      } catch (error) {
        console.error("Error registering donation:", error);
        alert("Failed to register donation. Please try again.");
      }
    } else {
      alert("Please select a person from the list.");
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button className="w-full">Book Slot</Button>
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
            <div className="space-y-4">
              <div className="mb-4">
                <label
                  htmlFor="nome"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500"
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-500 focus:ring focus:ring-red-500"
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
