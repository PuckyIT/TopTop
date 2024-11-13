// redux/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho user
type User = {
  _id: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  likesCount: number;
  avatar: string;
  username: string;
};

// Khởi tạo state ban đầu là null
const initialState = {
  _id: '',
  email: '',
  password: '',
  role: '',
  isActive: false,
  createdAt: '',
  updatedAt: '',
  bio: '',
  followersCount: 0,
  followingCount: 0,
  likesCount: 0,
  avatar: '',
  username: '',
};

// Tạo slice cho người dùng
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Cập nhật thông tin người dùng
    setUser(state, action: PayloadAction<User>) {
      if (state) {
        Object.assign(state, action.payload); // Cập nhật trực tiếp state
      } else {
        return action.payload; // Thiết lập state mới khi state hiện tại là null
      }
    },
    // Xóa thông tin người dùng
    clearUser() {
      return {
        _id: '',
        email: '',
        password: '',
        role: '',
        isActive: false,
        createdAt: '',
        updatedAt: '',
        bio: '',
        followersCount: 0,
        followingCount: 0,
        likesCount: 0,
        avatar: '',
        username: '',
      }; // Xóa người dùng
    },
  },
});

// Export các actions từ slice
export const { setUser, clearUser } = userSlice.actions;

// Export reducer của slice
export default userSlice.reducer;