import React, { useState } from "react";
import { VStack, Button, Field, Fieldset, Input } from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { Toaster, toaster } from "@/components/ui/toaster";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "@/context/ChatProvider";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const { setUser } = ChatState();
  // const [pic, setPic] = useState();

  // const postDetails = (pic) => {};
  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toaster.create({
        title: "Passwords do not match",
        description: "Please make sure both password fields are the same.",
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
        "/api/user",
        { name, email, password },
        config
      );

      toaster.create({
        title: "User registered successfully",
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
      setLoading(false);
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
          <Field.Root id="name" required>
            <Field.Label>Name</Field.Label>
            <Input
              name="name"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
            />
          </Field.Root>

          <Field.Root id="signup-email" required>
            <Field.Label>Email address</Field.Label>
            <Input
              name="email"
              type="email"
              id="signup-email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>

          <Field.Root id="signup-password" required>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              name="password"
              type="password"
              id="signup-password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field.Root>

          <Field.Root id="signup-confirmPassword" required>
            <Field.Label>Confirm Password</Field.Label>
            <PasswordInput
              name="confirmPassword"
              type="password"
              id="signup-confirmPassword"
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field.Root>

          {/* <Field.Root id="pic" required>
            <Field.Label>Profile Picture</Field.Label>
            <Input
              name="pic"
              type="file"
              accept="image/*"
              onChange={(e) => setPic(e.target.files[0])}
            />
          </Field.Root> */}
        </Fieldset.Content>

        <Button
          type="submit"
          alignSelf="flex-start"
          bg={"purple.500"}
          color="white"
          _hover={{ bg: "purple.600" }}
          w={"100%"}
          isLoading={loading}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Fieldset.Root>
    </VStack>
  );
};

export default Signup;
