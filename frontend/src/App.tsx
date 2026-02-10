import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import Questions from "./pages/QuestionsOfTopics";
import Profile from "./pages/Profile";
import Course from "./pages/Course";
import Lesson from "./pages/Lesson";

import Login from "./pages/authentication/login";
import SignUp from "./pages/authentication/signup";

import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  // const content = {
  //   label : "JavaScript"
  // }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Questions />} />
        <Route path="/courses/:label" element={<Course/>} />
        <Route path="/courses/:label/:level" element={<Course/>} />
        <Route path="/courses/:label/:level/:lesson" element={<Lesson/>} />
        <Route path="/courses/:label/:lesson" element={<Lesson/>} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

