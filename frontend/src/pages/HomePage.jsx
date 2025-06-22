import React, { useEffect } from "react";
import { Container, Box, Text, Tabs } from "@chakra-ui/react";
import { UserPlus, KeyRound } from "lucide-react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useHistory } from "react-router-dom";

const HomePage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Container maxW={"md"} centerContent>
      {/* Title */}
      <Box
        w={"100%"}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={5}
        bg={"white"}
        m={"40px 0 15px 0"}
        color={"black"}
        backdropBlur={"lg"}
        borderRadius="lg"
        boxShadow="md"
      >
        <Text fontWeight={"semibold"} fontSize={"lg"}>
          Welcome to the Chat Application 👋
        </Text>
      </Box>

      {/* Login/Register form */}
      <Box
        bg={"white"}
        w={"100%"}
        p={4}
        borderRadius="lg"
        boxShadow="md"
        color={"black"}
        display={"flex"}
        justifyContent="center"
        alignItems="center"
        // flexDirection="column"
      >
        <Tabs.Root defaultValue="login" variant="plain" w="100%">
          <Tabs.List bg="purple.200" rounded="l3" p="2" m="1rem 0" w="100%">
            <Tabs.Trigger value="login" w="50%" className="center-trigger">
              <KeyRound size={16} strokeWidth={3} />
              Login
            </Tabs.Trigger>
            <Tabs.Trigger value="sign up" w="50%" className="center-trigger">
              <UserPlus size={16} strokeWidth={3} />
              Sign Up
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" bg="purple.500" />
          </Tabs.List>
          <Tabs.Content value="login">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="sign up">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
