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
  useDisclosure,
  Button,
  FormLabel,
  Input,
  FormControl,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { CldUploadWidget } from 'next-cloudinary'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const UpdateDetailModal = ({ handleCloseModal }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useSelector((state) => state.user)
  const initialRef = React.useRef(null)
  const [name, setName] = useState(user.name || "")
  const [pic, setPic] = useState(user.pic || "")
  const finalRef = React.useRef(null)
  const [picLoading, setPicLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleSubmit = async () => {
    setPicLoading(true)

    try {
      if (!name || !pic) {
        toast({
          title: "Please fill out all fields.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setPicLoading(false)
        return
      }

      const res = await axios.post("/api/updateDetails", { name, pic, id: user._id })
      if (res.status !== 201) {
        toast({
          title: "Error updating details.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
        setPicLoading(false)
        return
      }

      const storedUser = JSON.parse(localStorage.getItem('user'))
      storedUser.name = name
      storedUser.pic = pic
      localStorage.setItem('user', JSON.stringify(storedUser))

      toast({
        title: "Details updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })

      onClose()
    //   console.log("object")
      window.location.reload();
    //   router.replace(router.asPath); 
        //   console.log("object")
    } catch (error) {
      toast({
        title: "Server error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
    } finally {
      setPicLoading(false)
    }
  }

  return (
    <>
      <Button onClick={onOpen}>Update Details</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Your Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input ref={initialRef} value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Update Pic</FormLabel>
              <CldUploadWidget
                uploadPreset='testing'
                onSuccess={(result) => setPic(result.info.url)}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      open()
                    }}
                    className="w-full px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Upload an Image
                  </button>
                )}
              </CldUploadWidget>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            {picLoading ? (
              <Spinner size="md" color="blue.500" mr={4} />
            ) : (
              <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                Save
              </Button>
            )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateDetailModal
