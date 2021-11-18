 import { showMessage as showToast } from "react-native-flash-message"; 
  
 export const showMessage = (description, type) => {
    showToast({
              message: 'Oops...',
              description,
              type: type === 'success' ? 'success' : 'danger',
              backgroundColor: type === 'success' ? '#1ABC9C' : '#D9435E'
            })
    };