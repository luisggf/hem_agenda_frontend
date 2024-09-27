import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { toast } from "sonner";
import { Cross2Icon } from "@radix-ui/react-icons";

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

export default function ConfirmationPopup({
  location,
}: {
  location: DonationLocal;
}) {
  const handleDelete = async (id: number) => {
    {
      try {
        await axios.delete(`http://localhost:3333/donation-local/${id}`);
        toast.success("Donation location deleted successfully!"); // Success toast
      } catch (error) {
        console.error("Error deleting donation local:", error);
        if (axios.isAxiosError(error) && error.response) {
          toast.error(
            `This location has donors registered and cannot be deleted.`
          ); // Error toast with backend message
        } else {
          toast.error("Failed to delete donation location."); // Generic error message
        }
      }
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-black mt-2 text-white hover:bg-black/80 p-2 mx-auto w-full rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          Delete
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black bg-opacity-50 fixed inset-0" />
        <Dialog.Content>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Confirm Deletion
                </h2>
                <Dialog.Close asChild>
                  <button
                    className="absolute top-3 right-3 inline-flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    aria-label="Close"
                  >
                    <Cross2Icon />
                  </button>
                </Dialog.Close>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete the donation location "
                {location.nome}
                "? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
