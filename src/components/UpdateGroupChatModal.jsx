'use client'
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import UserBadgeItem from "../components/UserBadgeItem"
import UserListItem from "../utils/UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat } from "@/features/chats/chatSlice";
const UpdateGroupChatModal = ({  fetchAgain, setFetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { user } = useSelector((state) => state.user || {});
  const { currentChat } = useSelector((state) => state.chat || { currentChat: null });
  const { chats } = useSelector((state) => state.chat || { chats: null });
    const dispatch =useDispatch()
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const searchQuery = encodeURIComponent(query);
          const response = await axios.get(`/api/getAllUsers?search=${searchQuery}&id=${user._id}`);
      setLoading(false);
      setSearchResult(response.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
  
    try {
      setRenameLoading(true);
      console.log(groupChatName, currentChat._id);
  
      const response = await axios.post("/api/renameGroup", {
        name: groupChatName,
        grpId: currentChat._id,
      });
  
      console.log(response.data._id);
  
      dispatch(setCurrentChat(response.data)); // Update the current chat with the renamed group
      
      setFetchAgain(!fetchAgain); // Trigger any necessary re-fetching in parent component
      
      setRenameLoading(false); // Stop loading indicator
      onClose();
    } catch (error) {
      setRenameLoading(false); // Ensure loading is stopped even on error
  
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Error renaming group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  
    setGroupChatName(""); // Clear the input field after renaming
  };
  

  const handleAddUser = async (user1) => {
    if (currentChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (currentChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/addToGroup", {chatId:currentChat._id ,userId:user1._id,loggedInUser:user._id})
      dispatch(setCurrentChat(response.data))
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (currentChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const response =await axios.post("/api/removeFromGroup",{userId:user1._id,chatId:currentChat._id})
      user1._id === user._id ? dispatch(setCurrentChat()) : dispatch(setCurrentChat(response.data));
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {currentChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {currentChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={currentChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;