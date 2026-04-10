import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Trash2Icon, X } from "lucide-react";
import { Button } from "./ui/button";

const DeleteJobDialog = ({ onConfirm, loading }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="bg-destructive/10 p-2 rounded-lg hover:bg-destructive/20 transition-colors cursor-pointer group">
          <Trash2Icon fill='currentColor' size={18} className='text-destructive group-hover:scale-110 transition-transform'/>
        </div>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90vw] max-w-[400px] bg-card border border-border/50 p-6 rounded-2xl shadow-2xl z-[51] animate-in zoom-in-95 duration-200 focus:outline-none">
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-destructive/10 rounded-full">
              <Trash2Icon size={32} className="text-destructive" />
            </div>
            
            <Dialog.Title className="text-xl font-bold text-foreground">
              Delete Internship?
            </Dialog.Title>
            
            <Dialog.Description className="text-muted-foreground text-sm leading-relaxed">
              Are you sure you want to delete this internship? This action cannot be undone and all associated applications will be lost.
            </Dialog.Description>
          </div>

          <div className="flex gap-3 mt-8">
            <Dialog.Close asChild>
              <Button variant="secondary" className="flex-1 font-semibold">
                Cancel
              </Button>
            </Dialog.Close>
            
            <Button 
                variant="destructive" 
                className="flex-1 font-semibold shadow-lg shadow-destructive/20"
                onClick={onConfirm}
                disabled={loading}
            >
              {loading ? "Deleting..." : "Delete Now"}
            </Button>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
              <X size={20} />
            </button>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteJobDialog;
