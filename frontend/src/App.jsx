import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ChatState } from "@/context/ChatProvider";
import { Spinner } from "@chakra-ui/react";

function App() {
  const { user } = ChatState();
  if (user === undefined) return <Spinner />;
  return (
    <>
      <Toaster />
      <Route path="/" component={HomePage} exact />
      <Route path="/chats" component={ChatPage} />
    </>
  );
}

export default App;
