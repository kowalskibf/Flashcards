import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Screens/Home";
import Login from "./Screens/Login";
import FlashcardList from "./Screens/FlashCards";
import StudyMode from "./Screens/StudyMode";
import FlashCardSlide from "./Screens/FlashCardSlide";
// import SingleFlipCard from "./components/SingleFlipCard";
import FlashCard from "./Screens/FlashCard";
import Add from "./Screens/Add";
import MySets from "./Screens/MySets";
import Navbar from "./Navbar";
import FlashCards from "./Screens/FlashCards";
import Profile from "./Screens/Profile";
import CreateSet from "./Screens/CreateSet";
import ChangePassword from "./Screens/ChangePassword";
import MyFlashcards from "./Screens/MyFlashcards";
import EditFlashcard from "./Screens/EditFlashcard";
import Study from "./Screens/Study";
import StudySet from "./Screens/StudySet";
import Test from "./Screens/Test";
import TestSet from "./Screens/TestSet";
import EditSet from "./Screens/EditSet";
import Register from "./Screens/Register";
import LandingPage from "./Screens/LandingPage";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/all" element={<FlashcardList />} />
          <Route path="/study-mode" element={<StudyMode />} />
          <Route path="/sets" element={<MySets />} />
          <Route path="/set/:id/:title" element={<FlashCardSlide />} />
          <Route path="/flashcards/:id" element={<FlashCard />} />
          <Route path="/flashcard/add" element={<Add />} />
          <Route path="/my-flashcards" element={<MyFlashcards />} />
          <Route path="/my-sets" element={<MySets />} />
          <Route path="/my-sets/:id/:title" element={<FlashCards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createSet" element={<CreateSet />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/flashcard/edit/:id" element={<EditFlashcard />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/:id" element={<StudySet />} />
          <Route path="/test" element={<Test />} />
          <Route path="/test/:id" element={<TestSet />} />
          <Route path="/set/:id/edit" element={<EditSet />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </div>
  );
}