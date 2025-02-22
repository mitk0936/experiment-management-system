"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/presentation/common/lib/utils";

interface ModalProps {
  trigger?: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
  open: boolean; // Controlled state
  onOpenChange: (open: boolean) => void; // Callback to control modal state
}

export default function Modal({
  trigger,
  title,
  children,
  className,
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          tabIndex={-1}
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "bg-white dark:bg-gray-900 rounded-lg shadow-xl",
            "w-full max-w-xl min-w-[350px] p-6 z-50",
            className,
          )}
        >
          <div className="relative w-full">
            <div className="flex justify-between align-middle">
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
              <Dialog.Close
                onClick={() => onOpenChange(false)}
                className="rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
            <div className="mt-4">{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
