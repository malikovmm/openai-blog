import { createContext } from 'react';

export interface DialogContext {
  isDialogOpen?: boolean;
  setOpenDialog?: (open: boolean) => void;
  contentData?: {
    title: string;
    description: string;
    agreeButton: string;
    disagreeButton: string;
  };
  setContentData?: (content: DialogContext['contentData']) => void;
  onConfirm?: (e?: any) => void | Promise<void>;
  onReject?: (e?: any) => void | Promise<void>;
}

export const DialogContext = createContext<{
  dialogData?: DialogContext;
  setDialogData?: (next: DialogContext) => void;
}>({});
