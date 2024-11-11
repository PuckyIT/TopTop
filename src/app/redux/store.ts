// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// Tạo store Redux và kết nối reducer
const store = configureStore({
  reducer: {
    user: userReducer, // user reducer sẽ quản lý thông tin người dùng
  },
});

export default store;
