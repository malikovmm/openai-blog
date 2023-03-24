import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useContext } from 'react';
import { DialogContext } from '../../hooks/useDialog';

export default function ConfirmationDialog() {
  const { dialogData, setDialogData } = useContext(DialogContext);
  const handleClose = () => {
    setDialogData({ ...dialogData, isDialogOpen: false });
  };
  const onConfirm = async (e) => {
    if (dialogData.onConfirm) await dialogData.onConfirm(e);
    handleClose();
  };
  const onReject = async (e) => {
    if (dialogData.onReject) await dialogData.onReject(e);
    handleClose();
  };
  return (
    <Dialog
      open={dialogData.isDialogOpen ?? false}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {dialogData?.contentData?.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogData?.contentData?.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReject}>
          {dialogData?.contentData?.disagreeButton}
        </Button>
        <Button onClick={onConfirm} autoFocus>
          {dialogData?.contentData?.agreeButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
