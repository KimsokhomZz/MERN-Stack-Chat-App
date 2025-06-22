import React, { useState } from "react";
import { VStack, Button, Field, Fieldset, Input } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { set } from "mongoose";
import { Toaster, toaster } from "@/components/ui/toaster";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "@/context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { setUser } = ChatState();
  // const [pic, setPic] = useState();

  // const postDetails = (pic) => {};
  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please fill all the fields",
        type: "warning",
        duration: 3000,
        closable: true,
        position: "bottom-right",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toaster.create({
        title: "Login successful",
        description: "Welcome back!",
        type: "success",
        duration: 3000,
        closable: true,
        position: "bottom-right",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Error occurred!",
        description:
          error.response?.data?.message || "An unexpected error occurred.",
        type: "error",
        duration: 3000,
        closable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <VStack>
      <Fieldset.Root size={"md"} maxW="md">
        {/* <Stack>
          <Fieldset.Legend color="gray.700">Contact details</Fieldset.Legend>
          <Fieldset.HelperText>
            Please provide your contact details below.
          </Fieldset.HelperText>
        </Stack> */}

        <Fieldset.Content>
          <Field.Root id="login-email" required>
            <Field.Label>Email address</Field.Label>
            <Input
              name="email"
              type="email"
              id="login-email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>

          <Field.Root id="login-password" required>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              name="password"
              type="password"
              value={password}
              id="login-password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>
        </Fieldset.Content>

        <Button
          type="submit"
          alignSelf="flex-start"
          bg={"purple.500"}
          color="white"
          _hover={{ bg: "purple.600" }}
          w={"100%"}
          onClick={handleSubmit}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          type="submit"
          alignSelf="flex-start"
          bg={"orange.500"}
          color="white"
          _hover={{ bg: "orange.600" }}
          w={"100%"}
          onClick={() => {
            setEmail("guest@gmail.com");
            setPassword("123456");
            // handleSubmit();
          }}
        >
          Login as a Guest
        </Button>
      </Fieldset.Root>
    </VStack>
  );
};

export default Login;
