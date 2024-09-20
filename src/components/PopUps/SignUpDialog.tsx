import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

type AddressData = {
  logradouro: string;
  localidade: string;
  uf: string;
};

async function buscarEnderecoPorCEP(cep: string) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  if (!data.erro) {
    return data;
  } else {
    throw new Error("CEP não encontrado");
  }
}

export default function SignUpDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    rua: "",
    numero: "",
    complemento: "",
    rg: "",
    tipo_sanguineo: "",
    cep: "",
    cidade: "",
    estado: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCEPBlur = async () => {
    if (formData.cep.length === 8) {
      try {
        const addressData = (await buscarEnderecoPorCEP(
          formData.cep
        )) as AddressData;
        setFormData((prev) => ({
          ...prev,
          rua: addressData.logradouro,
          cidade: addressData.localidade,
          estado: addressData.uf,
        }));
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("CEP não encontrado. Por favor, verifique e tente novamente.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    // Here you would typically send the data to your backend
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button>Sign Up</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-xl font-bold ">Sign Up</Dialog.Title>
          <Dialog.Description className="text-sm mb-10 text-black/50">
            Please fill in your information to create an account.
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
                value={formData.cep}
                onChange={handleInputChange}
                onBlur={handleCEPBlur}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              />
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="numero"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
                />
              </div>
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
                htmlFor="rg"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                RG
              </label>
              <input
                type="text"
                id="rg"
                name="rg"
                value={formData.rg}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              />
            </div>
            <div>
              <label
                htmlFor="tipo_sanguineo"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Tipo Sanguíneo
              </label>
              <select
                id="tipo_sanguineo"
                name="tipo_sanguineo"
                value={formData.tipo_sanguineo}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="cidade"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Cidade
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              />
            </div>
            <div>
              <label
                htmlFor="estado"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Estado
              </label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-red-50 focus:ring focus:ring-red-50"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 w-full text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Sign Up
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
