import { toast } from 'react-toastify';

class Toast {

    constructor() {
        toast.configure()
    }
    
    show(type, message, autoClose = 3000, hideProgressBar = false, closeOnClick = true, pauseOnHover = true, draggable = true, progress = undefined) {
        const params = { autoClose, hideProgressBar, closeOnClick, pauseOnHover, draggable, progress }
        if(!message) return
        switch (type) {
            case "error":
                toast.error(message, {...params})
                break;
            case "warning":
                toast.warning(message, {...params})
                break;
            case "success":
                toast.success(message, {...params})
                break;
            case "info":
                toast.info(message, {...params})
                break;
            case "dark":
                toast.dark(message, {...params})
                break;
            default:
                toast(message, {...params})
                break;
        }
    }
}

export default new Toast()