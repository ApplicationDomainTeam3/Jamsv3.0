
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Textarea,
  } from "@chakra-ui/react";



  import { useState } from "react";
  
  export  function Eform () {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
  
    const baseUrl = "http://localhost:4000";
  
    const sendEmail = async () => {
      let dataSend = {
        email: email,
        subject: subject,
        message: message,
      };
  
      const res = await fetch(`${baseUrl}/email/sendEmail`, {
        method: "POST",
        body: JSON.stringify(dataSend),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        // HANDLING ERRORS
        .then((res) => {
          console.log(res);
          if (res.status > 199 && res.status < 300) {
            alert("Send Successfully !");
          }
        });
    };
    return (
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Send Email</Heading>
           
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("#603f8b", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="Receipient Email "
                  bg={useColorModeValue("white", "gray.700")}
                  onChange={(e) => setEmail(e.target.value)}
                  color={"black"}
                />
              </FormControl>
              <FormControl id="email">
                <FormLabel>Subject</FormLabel>
                <Input
                  onChange={(e) => setSubject(e.target.value)}
                  type="text"
                  placeholder="Subject Title"
                  bg={useColorModeValue("white", "gray.700")}
                  color={"black"}
                />
              </FormControl>
              <FormControl id="text">
                        
                <FormLabel>Message</FormLabel>
                <Textarea
                  
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Start Message"
                  color={"black"}
                />
              </FormControl>
              <Stack spacing={10}>
                <Button
                  bg={"blue.400"}
                  color={"black"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={() => sendEmail()}
                >
                  Send
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>

    );
  }
  

