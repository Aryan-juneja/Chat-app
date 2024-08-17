'use client';
import ShineBorder from "@/components/magicui/shine-border";
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React from "react";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
function Meteors({ number }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(number)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-fall"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${Math.random() * 2}s`, // Add delay to stagger the start
          }}
        />
      ))}
    </div>
  );
}

function Homepage() {
  return (
    <Box position="relative" minHeight="100vh" overflow="hidden" bg="gray.800">
      {/* Meteors Background */}
      <Meteors number={100} /> {/* Increase number for denser effect */}

      {/* Foreground Content */}
      <Container maxW="xl" centerContent position="relative" zIndex={1} p={4}>
      <ShineBorder
        color={["#FF6347", "#FF4500", "#FFD700"]}
        style={{ backgroundColor: 'black', }} // Set background color to black
      >
        <Box
          d="flex"
          justifyContent="center"
          p={4}
          bg="gray.700"
          w="100%"
          
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.600"
        >
          
          <Text fontSize="5xl" fontFamily="Work sans" color="white" align={"center"}>
            Chit-Chat
          </Text>
        </Box>
        </ShineBorder>
        <div className="mt-4 mb-4"></div>
        <ShineBorder
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        style={{ backgroundColor: 'black' }} // Set background color to black
      >
        <Box bg="gray.700" w="100%" p={4} borderRadius="lg" borderWidth="1px" borderColor="gray.600">
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab _selected={{ color: "white", bg: "gray.600" }}>
                Login
              </Tab>
              <Tab _selected={{ color: "white", bg: "gray.600" }}>
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        </ShineBorder>
      </Container>
    </Box>
  );
}

export default Homepage;
