'use client'
import { Box, Text } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { currentChat } = useSelector((state) => state.chat || { currentChat: null });

  return (
    <Box
      display={{ base: currentChat ? "flex" : "none", md: "flex" }} // Conditional display based on screen size
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
