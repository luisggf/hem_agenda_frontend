import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { toast } from "sonner";
import axios from "axios";

type AddressData = {
  logradouro: string;
  localidade: string;
  uf: string;
};

type Estado = {
  id: number;
  sigla: string;
};

type Cidade = {
  id: number;
  nome: string;
  estado_id: number;
};

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

async function buscarEnderecoPorCEP(cep: string) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  if (!data.erro) {
    return data;
  } else {
    throw new Error("CEP não encontrado");
  }
}

async function getEstados() {
  const response = await fetch(`http://localhost:3333/getAllStates`);
  return await response.json();
}

async function getCidades(estadoId: number) {
  const response = await fetch(`http://localhost:3333/cities`);
  const allCidades = await response.json();
  const filteredCidades = allCidades.filter(
    (cidade: Cidade) => cidade.estado_id === estadoId
  );
  return filteredCidades;
}

export default function UpdateDonationLocationDialog({
  location,
}: {
  location: DonationLocal;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    rua: "",
    numero: "",
    complemento: "",
    cep: "",
    cidade: "",
    cidade_id: "",
    estado: "",
  });

  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);

  useEffect(() => {
    if (location) {
      setFormData({
        nome: location.nome || "",
        rua: location.rua || "",
        numero: location.numero || "",
        complemento: location.complemento || "",
        cidade_id: location.cidade_id.toString() || "",
        estado: location.estado || "",
        cidade: "",
        cep: formData.cep || "",
      });
    }
  }, []);

  useEffect(() => {
    const fetchEstados = async () => {
      const estados = await getEstados();
      setEstados(estados);
    };

    fetchEstados();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "estado") {
      // Reset city when state changes
      setFormData((prev) => ({
        ...prev,
        estado: value,
        cidade_id: "", // Reset city when the state changes
      }));

      // Fetch cities when state changes
      const selectedEstado = estados.find((estado) => estado.sigla === value);
      if (selectedEstado) {
        fetchCidades(selectedEstado.id);
      }
    }
  };
  const handleCEPClick = async () => {
    if (formData.cep.length === 8) {
      try {
        const addressData = (await buscarEnderecoPorCEP(
          formData.cep
        )) as AddressData;

        const selectedEstado = estados.find(
          (estado) => estado.sigla === addressData.uf
        );
        if (selectedEstado) {
          const cidades = await fetchCidades(selectedEstado.id);

          const selectedCidade = cidades.find(
            (cidade: Cidade) =>
              cidade.nome.toLowerCase() === addressData.localidade.toLowerCase()
          );

          if (selectedCidade) {
            setFormData((prev) => ({
              ...prev,
              rua: addressData.logradouro,
              estado: addressData.uf,
              cidade_id: selectedCidade.id, // Correctly set the city ID
            }));
          }
        }
        toast.success("CEP validado com sucesso!");
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast.error(
          "CEP não encontrado. Por favor, verifique e tente novamente."
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const data = {
      id_to_update: location.id,
      nome: formData.nome,
      rua: formData.rua,
      numero: formData.numero,
      complemento: formData.complemento,
      cidade_id: formData.cidade_id,
    };
    e.preventDefault();
    try {
      await axios.patch("http://localhost:3333/update-donation-local", data);
      toast.success("Donation location updated successfully!");
    } catch (error) {
      console.error("Error updating donation local:", error);
      toast.error("Failed to update the donation location.");
    }
  };
  const fetchCidades = async (estadoId: number) => {
    const cidades = await getCidades(estadoId);
    setCidades(cidades);
    return cidades;
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-black mt-2  text-white hover:bg-black/80 p-2 mx-auto w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          Update
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md z-50">
          <Dialog.Title className="text-xl font-bold ">
            Update Donation Location
          </Dialog.Title>
          <Dialog.Description className="text-sm mb-10 text-black/50">
            Please fill in the new Donation Local address.
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="cep"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  CEP
                </label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  maxLength={8}
                  value={formData.cep}
                  onChange={handleInputChange} // Keep onChange to update the state
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="h-7 w-full"
                  onClick={handleCEPClick} // Call the new function on button click
                >
                  Validar CEP
                </Button>
              </div>
            </div>

            <div>
              <label
                htmlFor="rua"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Rua
              </label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="complemento"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Complemento
                </label>
                <input
                  type="text"
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="estado"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              >
                <option value="">Selecione um Estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.sigla}>
                    {estado.sigla}
                  </option>
                ))}
              </select>
            </div>

            {/* Cidade Select */}
            <div>
              <label
                htmlFor="cidade"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Cidade
              </label>
              <select
                id="cidade"
                name="cidade"
                value={formData.cidade_id}
                onChange={(e) => {
                  const selectedCityId = e.target.value;
                  const selectedCity = cidades.find(
                    (cidade) => cidade.id === parseInt(selectedCityId)
                  );

                  setFormData((prev) => ({
                    ...prev,
                    cidade_id: selectedCityId,
                    cidade: selectedCity ? selectedCity.nome : "", // Update both cidade and cidade_id
                  }));
                }}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              >
                <option value="">Selecione uma Cidade</option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.id}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-4 mt-2 w-full text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Register Location
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
