import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showInfoToast = (msg) => {
    toast.info(msg, {
        position: toast.POSITION.TOP_CENTER
    });
};

export const showSuccessToast = (msg) => {
    toast.success(msg, {
        position: toast.POSITION.TOP_CENTER
    });
};

export const showErrorToast = (msg) => {
    toast.error(msg, {
        position: toast.POSITION.TOP_CENTER
    });
};