'use client';
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text, IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat } from "@/features/chats/chatSlice";
import ProfileModal2 from "../utils/ProfileModal2";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import { getSender, getSenderFull } from "@/utils/getSender";
import { io } from "socket.io-client";
import { setNotification } from "@/features/notification/notificationSlice";

let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const { user } = useSelector((state) => state.user || {});
  const { currentChat } = useSelector((state) => state.chat || { currentChat: null });
  const dispatch = useDispatch();
  const { notification } = useSelector((state) => state.notification || { notification: [] });

  // Fetch messages for the current chat
  const fetchMessages = async () => {
    if (!currentChat) return;

    try {
      setLoading(true);
      const response = await axios.post(`/api/fetchMessages`, {
        userId: user._id,
        chatId: currentChat,
      });
      setMessages(response.data.response);
      setLoading(false);
      socket.emit("join chat", currentChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", currentChat._id);
      try {
        const response = await axios.post("/api/createMessage", {
          senderId: user._id,
          content: newMessage,
          chatId: currentChat,
        });
       
        if (response.status === 201) {
          socket.emit("new message", response.data);
          setMessages((prevMessages) => [...prevMessages, response.data]);
        } else {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to send message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setNewMessage("");
      }
    }
  };

  // Handle typing in the input
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", currentChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", currentChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Cleanup to prevent multiple listeners
    return () => {
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      fetchMessages();
      selectedChatCompare = currentChat;
    }
  }, [currentChat]);

  useEffect(() => {
    if (!socketConnected) return;

    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification?.some((notif) => notif._id === newMessageRecieved._id)) {
          dispatch(setNotification([newMessageRecieved, ...(notification || [])]));
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
      }
    });

    return () => {
      socket.off("message recieved");
    };
  }, [socketConnected, selectedChatCompare, notification, fetchAgain, dispatch]);

  return (
    <>
      {currentChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => dispatch(setCurrentChat(""))}
            />
            {!currentChat.isGroupChat ? (
              <>
                {getSender(user, currentChat.users)}
                <ProfileModal2 user={getSenderFull(user, currentChat.users)} />
              </>
            ) : (
              <>
                {currentChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {istyping ? (
              <div className="typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            ) : (
              <></>
            )}
            <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
