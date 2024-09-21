import { Button } from "../ui/button";
import * as Dialog from "@radix-ui/react-dialog";

export default function BookDonation() {
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button>Book Slot</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay></Dialog.Overlay>
          <Dialog.Content>
            <Dialog.Title className="text-xl font-bold ">Sign Up</Dialog.Title>
            <Dialog.Description className="text-sm mb-10 text-black/50">
              Please fill in your information to create an account.
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
