import { useState } from "react";

export const useDialog = () => {
  const [dialogIsVisible, setDialogIsVisible] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  const showDialog = target => {
    setDialogContent(target);
    setDialogIsVisible(true);
  };

  const hideDialog = () => {
    setDialogIsVisible(false);
    setDialogContent(null);
  };

  return [dialogIsVisible, dialogContent, showDialog, hideDialog];
};
