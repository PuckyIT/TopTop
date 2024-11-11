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
const initialState: User | null = null;

// Tạo slice cho người dùng
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Cập nhật thông tin người dùng
    setUser(state, action: PayloadAction<User>) {
      return action.payload; // Trả về thông tin người dùng từ payload
    },
    // Xóa thông tin người dùng
    clearUser() {
      return null; // Xóa người dùng
    },
  },
});

// Export các actions từ slice
export const { setUser, clearUser } = userSlice.actions;

// Export reducer của slice
export default userSlice.reducer;