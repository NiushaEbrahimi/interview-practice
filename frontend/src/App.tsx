import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Questions from "./pages/QuestionsOfTopics";
import Profile from "./pages/Profile";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";
import Login from "./pages/authentication/login";
import SignUp from "./pages/authentication/signup";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          } />
          <Route path="/courses/:label" element={
            <ProtectedRoute>
              <Course/>
            </ProtectedRoute>
          } />
          <Route path="/courses/:label/:level" element={
            <ProtectedRoute>
              <Course/>
            </ProtectedRoute>
          } />
          <Route path="/courses/:label/:level/:lesson" element={
            <ProtectedRoute>
              <Lesson/>
            </ProtectedRoute>
          } />
          <Route path="/courses/:label/:lesson" element={
            <ProtectedRoute>
              <Lesson/>
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}