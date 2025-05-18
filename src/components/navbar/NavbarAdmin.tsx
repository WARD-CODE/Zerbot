'use client';

import {
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text as ChakraText,
  Box,
} from '@chakra-ui/react';
import { MdOutlineInfo, MdDarkMode } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { SearchIcon } from '@chakra-ui/icons';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminNavbar() {
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.500', 'gray.500');
  const modeHoverColor = useColorModeValue('#FF9900', '#FFD580');
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <Flex
      w="100%"
      justifyContent="flex-end"
      alignItems="center"
      px="20px"
      py="10px"
      bg="transparent"
      position="absolute"
      top="0"
      left="0"
      zIndex="100"
    >
      <Flex align="center" justify="flex-end" gap="20px" h="100%">
        {/* Icons */}
        <Icon as={MdOutlineInfo} color={iconColor} w="10" h="10" className="navbar-icon-btn" />
        <Menu>
          <MenuButton as={Box} cursor="pointer">
            <Icon as={FaUserCircle} color={iconColor} w="10" h="10" className="navbar-icon-btn" />
          </MenuButton>
          <MenuList minW="200px" borderRadius="xl" boxShadow="md">
            {user ? (
              <>
                <ChakraText px="16px" py="8px" fontWeight="bold" color={textColor}>
                  {user.name}
                </ChakraText>
                <ChakraText px="16px" fontSize="sm" color={iconColor}>
                  ID: {user.id}
                </ChakraText>
                <MenuItem onClick={() => router.push('/settings')}>Settings</MenuItem>
                <MenuItem color="red.400" onClick={() => { logout(); router.push('/login'); }}>Log out</MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => router.push('/login')}>Login</MenuItem>
                <MenuItem onClick={() => router.push('/signup')}>Register</MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}
