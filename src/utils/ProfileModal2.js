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
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal2 = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen} role="button" aria-label={`View ${user.name}'s profile`}>
          {children}
        </span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
          aria-label={`View ${user.name}'s profile`}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={6} // Padding around the content
        >
          <ModalHeader
            fontSize="36px" // Slightly smaller font size for a cleaner look
            fontFamily="Work sans"
            textAlign="center"
            mb={4} // Added margin-bottom for spacing
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            p={4} // Padding inside the body
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={`Profile picture of ${user.name}`}
              mb={4} // Margin-bottom for spacing between image and text
            />
            <Text
              fontSize={{ base: "24px", md: "28px" }} // Adjusted font size for better readability
              fontFamily="Work sans"
              textAlign="center"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter
            display="flex"
            justifyContent="center"
            p={4} // Padding around the footer
            gap={4}
          >
            {/* <Button onClick={onUpdateOpen}>Update Details</Button> */}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  );
};

export default ProfileModal2;
