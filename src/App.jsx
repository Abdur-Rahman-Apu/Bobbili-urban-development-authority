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
    <div className="max-w-screen-2xl mx-auto">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
