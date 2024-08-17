'use client'
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";
import { useRouter } from "next/navigation";
import NotificationBadge, { Effect } from "react-notification-badge";
import { useDispatch, useSelector } from "react-redux";
import ProfileModal from "@/utils/ProfileModal";
import UserListItem from "@/utils/UserListItem";
import { setChats, setCurrentChat } from "@/features/chats/chatSlice";
import ChatLoading from "@/utils/ChatLoading ";
import { setNotification } from "@/features/notification/notificationSlice";
import { getSender } from "@/utils/getSender";

function SideDrawer({fetchAgain, setFetchAgain }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const { chats } = useSelector((state) => state.chats || { chats: [] });
  const { notification } = useSelector((state) => state.notification || { notification: [] });
  const dispatch = useDispatch();
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


const logoutHandler = async () => {
  localStorage.removeItem("user");
  try {
    const res = await axios.get("/api/Logout");
    if (res.status===200) {
      toast({
        title: "Logged Out Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      router.push('/');
    }
  } catch (error) {
    toast({
      title: "Error logging out",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
  }
};


  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const searchQuery = encodeURIComponent(search);
      const response = await axios.get(`/api/getAllUsers?search=${searchQuery}&id=${user._id}`);
      console.log(response.data);
      setSearchResult(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const response = await axios.post("/api/accessChat", { userid: user._id, senderid: userId });
      const chatExists = chats.find((c) => c._id === response.data._id);

      if (!chatExists) {
        dispatch(setChats([response.data, ...chats]));
      }

      dispatch(setCurrentChat(response.data));
      setLoadingChat(false);
      setFetchAgain(!fetchAgain)
      onClose();  // Close the drawer after accessing the chat

    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Clear search results when the drawer is closed
  const handleClose = () => {
    onClose();
    setSearch("")
    setSearchResult([]);  // Clear the search results
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chit-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length} // replace with your actual notification count
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* Uncomment this section once your notifications logic is ready */}
            <MenuList pl={2}>
              {!notification?.length && "No New Messages"}
              {notification?.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    dispatch(setCurrentChat(notif.chat));
                    dispatch(setNotification(notification.filter((n) => n !== notif)));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={handleClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((User) => (
                <UserListItem
                  key={User._id}
                  user={User}
                  handleFunction={() => accessChat(User._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
