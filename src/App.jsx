import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import socket from "./Pages/Common/socket";
import router from "./Routes/Routes";

function App() {
  useEffect(() => {
    // Connect to Socket.IO server when the app starts
    socket.connect();

    return () => {
      // Disconnect from Socket.IO when the component unmounts
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
