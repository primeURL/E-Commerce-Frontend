// import { Middleware } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "../store"; // Import RootState for state typing

// const cartMiddleware: Middleware<{}, RootState> = (store) => (next) => async (action) => {
//     if (action.type.startsWith('cartReducer')) {
//         try {
//             // Get the current state of the cart
//             const userId = store.getState().userReducer?.user?._id
//             const cartState = store.getState().cartReducer
//             await axios.put(`${import.meta.env.VITE_SERVER}/api/v1/user/updateUserCart/${userId}`,cartState)
//         } catch (error) {
//             console.error('Error in cart middleware:', error);
//         }
   
//     }
//     return next(action);

// };

// export default cartMiddleware