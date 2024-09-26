// addressUtils.tsx
export type AddressData = {
  logradouro: string;
  localidade: string;
  uf: string;
};

export type Estado = {
  id: number;
  sigla: string;
};

export type Cidade = {
  id: number;
  nome: string;
  estado_id: number;
};

// Function to fetch address by CEP
export async function buscarEnderecoPorCEP(
  cep: string
): Promise<AddressData | null> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  if (!data.erro) {
    return data;
  } else {
    throw new Error("CEP não encontrado");
  }
}

// Function to fetch all states
export async function getEstados(): Promise<Estado[]> {
  const response = await fetch(`http://localhost:3333/getAllStates`);
  return await response.json();
}

// Function to fetch cities by state ID
export async function getCidades(estadoId: number): Promise<Cidade[]> {
  const response = await fetch(`http://localhost:3333/cities`);
  const allCidades = await response.json();
  return allCidades.filter((cidade: Cidade) => cidade.estado_id === estadoId);
}
