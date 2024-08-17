'use client'
import React, { useState } from 'react'
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
    FormLabel,
    Input,
    useToast,
    Box,
    Spinner,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'
import UserListItem from '@/utils/UserListItem'
import { setChats } from '@/features/chats/chatSlice'

const GroupModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [name, setname] = useState("")
    const [searchName, setSearchName] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [searching, setSearching] = useState(false)
    const { user } = useSelector((state) => state.user)
    const { chats } = useSelector((state) => state.chat || { chats: null });
    const [selectedUsers, setSelectedUsers] = useState([]);
    const toast = useToast();
    const dispatch = useDispatch();

    const handleDelete = (user) => {
        setSelectedUsers(selectedUsers.filter((item) => item._id !== user._id))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        console.log(name,selectedUsers)
        if(!name || !selectedUsers.length){
          toast({
            title: "Please fill all fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
        try {
          const response = await axios.post('/api/createGroupChat', { users: selectedUsers.map((e) => e._id), name, userId: user._id });
          if (response.status !== 201) {
            toast({
              title: "Error creating Group",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }
          toast({
            title: "Group Created Successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          console.log(response.data)
          dispatch(setChats([response.data, ...chats]))
          closeModal(); // Close modal and reset fields after successful submission
        } catch (error) {
          console.log(error);
          toast({
            title:  error.response.data.message ||"Error in Catch Block",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          return;
        }
    }

    const closeModal = () => {
      onClose(); // Close the modal
      setname(""); // Reset group name
      setSearchName(""); // Reset search input
      setSearchResult([]); // Clear search results
      setSelectedUsers([]); // Clear selected users
    }

    const handleSearch = async (e) => {
      setSearchName(e);

      // If the search input is empty, clear the search result
      if (!e) {
          setSearchResult([]);
          return;
      }

      if (!searchName) {
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
          setSearching(true);
          const searchQuery = encodeURIComponent(searchName);
          const response = await axios.get(`/api/getAllUsers?search=${searchQuery}&id=${user._id}`);
          setSearchResult(response.data);
          setSearching(false);
      } catch (error) {
          setSearching(false);
          toast({
              title: "Error Occurred!",
              description: "Failed to Load the Search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
          });
      }
    }

    const handleGroup = async (user) => {
        if (selectedUsers.some(u => u._id === user._id)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, user]); // Corrected the spread operator usage
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal
                isOpen={isOpen}
                onClose={closeModal} // Use closeModal to reset everything
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"  // Use display instead of d
                        justifyContent="center"
                    >Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDirection="column" alignItems="center">
                        <FormControl>
                            <FormLabel>Group Name</FormLabel>
                            <Input value={name} onChange={(e) => setname(e.target.value)} placeholder='Group name' />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Search Users</FormLabel>
                            <Input value={searchName} onChange={(e) => handleSearch(e.target.value)} placeholder='Eg: rohan, ajay, ram' />
                        </FormControl>
                    </ModalBody>
                    <Box w="100%" display="flex" flexWrap="wrap">
                        {selectedUsers.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleDelete(u)}
                            />
                        ))}
                    </Box>
                    {searching ? (
                        <Spinner size="lg" color="blue.500" />
                    ) : (
                        searchResult?.map((User) => (
                            <UserListItem
                                key={User._id}
                                user={User}
                                handleFunction={() => handleGroup(User)} // Use User here, not user
                            />
                        ))
                    )}
                    <ModalFooter>
                        <Button onClick={(e) => handleSubmit(e)} colorScheme='blue' mr={3}>
                            Create
                        </Button>
                        <Button onClick={closeModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupModal;
