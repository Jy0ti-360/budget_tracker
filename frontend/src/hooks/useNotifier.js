import { toast } from 'react-toastify';

const useNotifier = () => {
  const notifySuccess = (msg) =>
    toast.success(msg || 'Success!', { autoClose: 3000 });

  const notifyError = (msg) =>
    toast.error(msg || 'Something went wrong.', { autoClose: 3000 });

  const notifyWarning = (msg) =>
    toast.warn(msg || 'Check your input.', { autoClose: 3000 });

  const notifyInfo = (msg) =>
    toast.info(msg || 'Here’s some info.', { autoClose: 3000 });

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  };
};

export default useNotifier;