'use client';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat, setChats } from "@/features/chats/chatSlice";
import { getSender } from "@/utils/getSender";
import GroupModal from "./GroupModal";
import ChatLoading from "@/utils/ChatLoading ";

const MyChats = ({ fetchAgain }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [clicked, setClicked] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.user || {});
  const { currentChat, chats } = useSelector((state) => state.chat || { chats: [] });

  const fetchChats = async () => {
    setLoading(true);
    try {
      console.log("entered")
      const response = await axios.post("/api/fetchChats", { _id: user._id });
      console.log(response)
      if (Array.isArray(response.data)) {
        console.log(response.data)
        dispatch(setChats(response.data));
      } else {
        throw new Error("Invalid response data format");
      }
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (chat) => {
    setClicked(chat);
    dispatch(setCurrentChat(chat));
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const renderChatContent = () => {
    if (loading) {
      return <ChatLoading />;
    }

    if (chats.length === 0) {
      return <Text>No chats available. Add a user to start chatting.</Text>;
    }

    return (
      <Stack overflowY="scroll">
        {chats.map((chat) => (
          <Box
            onClick={() => handleClick(chat)}
            cursor="pointer"
            bg={currentChat === chat ? "#38B2AC" : "#E8E8E8"}
            color={currentChat === chat ? "white" : "black"}
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}
          >
            <Text>
              {!chat.isGroupChat
                ? getSender(user, chat.users)
                : chat.chatName}
            </Text>
            {chat.latestMessage && (
              <Text fontSize="xs">
                <b>{chat.latestMessage.sender.name} : </b>
                {chat.latestMessage.content.length > 50
                  ? chat.latestMessage.content.substring(0, 51) + "..."
                  : chat.latestMessage.content}
              </Text>
            )}
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Box
      display={{ base: currentChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text>My Chats</Text>
        <GroupModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {renderChatContent()}
      </Box>
    </Box>
  );
};

export default MyChats;
