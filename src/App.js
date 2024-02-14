import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import MainPage from "./pages/MainPage";
import RoomOne from "./pages/RoomOne";
import RoomTwo from "./pages/RoomTwo";
import RoomThree from "./pages/RoomThree";

function App() {
  const [isLogin, setIsLogin] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:666/websocket/users");
    ws.onopen = () => {
      console.log("Connected to WebSocket server", "message");
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            method: "IsTokenValid",
            online: window.localStorage.getItem("token"),
          })
        );
      } else {
        console.error("La conexión WebSocket no está abierta aún.");
      }
    };

    ws.onmessage = (event) => {
      console.log("Token correcto: ", event.data);
      setIsLogin(event.data);
    };

    return () => {};
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {isLogin === "true" ? (
          <>
           <Route path="/main" element={<MainPage />} />
           <Route path="/roomone" element={<RoomOne />} />
           <Route path="/roomtwo" element={<RoomTwo />} />
           <Route path="/roomthree" element={<RoomThree />} />
           
          </>
        ) : (
          <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
