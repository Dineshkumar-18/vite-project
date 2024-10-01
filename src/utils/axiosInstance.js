import axios from 'axios';
import { useSession } from '../context/SessionContext';

let setIsSessionExpired;
let setUserType;

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7055/api',
  withCredentials: true,
});



// Add a response interceptor to handle 401 errors
export const configureInterceptors = (sessionSetter,userTypeSetter) => {
  setIsSessionExpired = sessionSetter; // Save the setter function
  setUserType = userTypeSetter; 

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("Interceptor");

      if (error.response && error.response.status === 401) {
        console.log(error);
        

        if (setIsSessionExpired) {
          console.log("insideSetIsSessionExpired");
          setIsSessionExpired(true); // Update session expiration state
        } else {
          console.error("setIsSessionExpired is not defined");
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
