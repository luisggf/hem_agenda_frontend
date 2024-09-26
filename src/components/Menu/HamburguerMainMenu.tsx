import * as Dialog from "@radix-ui/react-dialog";
import {
  Menu,
  X,
  Home,
  Calendar,
  PlusCircle,
  PenTool,
  Droplet,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import RegisterDonationLocal from "../popups/RegisterDonationLocalDialog";

export default function HamburgerMenu() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="fixed top-2 right-4 z-50 p-2 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-0 right-0 bottom-0 z-50 w-1/5 bg-white shadow-lg focus:outline-none">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 bg-red-500 px-4">
              <Heart className="h-6 w-6 text-white" />
              <span className="text-white text-xl font-semibold">
                Hem Agenda
              </span>
              <Dialog.Close asChild>
                <button
                  className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>
            <nav className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-100 rounded-md transition-colors duration-200"
                  >
                    <Home className="w-6 h-6" />
                    <span className="ml-3">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/schedule"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-100 rounded-md transition-colors duration-200"
                  >
                    <Calendar className="w-6 h-6" />
                    <span className="ml-3">Schedule</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-100 rounded-md transition-colors duration-200">
                    <PlusCircle className="w-6 h-6" />
                    <RegisterDonationLocal />
                  </div>
                </li>
                <li>
                  <Link
                    to="/maintenance-donation-local"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-100 rounded-md transition-colors duration-200"
                  >
                    <PenTool className="w-6 h-6" />
                    <span className="ml-3">Maintenance Donation Local</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/search-persons-donation"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-red-100 rounded-md transition-colors duration-200"
                  >
                    <Droplet className="w-6 h-6" />
                    <span className="ml-3">Check Person Donations</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
