'use client'
import { setUserFromLocalStorage } from '@/features/user/userSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from "@chakra-ui/layout";
import SideDrawer from '@/components/SideDrawer';
import MyChats from '@/components/MyChats';
import Chatbox from '@/components/Chatbox';

const ChatPage = () => {
  const dispatch = useDispatch();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    dispatch(setUserFromLocalStorage()); // Load user from localStorage on app load
  }, [dispatch]);

  const { user } = useSelector((state) => state.user);

  return (
    <div style={{ width: "100%", backgroundColor: "#f0f4f8" }}> {/* Soft Blue Background */}
      {user && <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      <Box display="flex" flexDirection="row" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
}

export default ChatPage;
