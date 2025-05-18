'use client';

import {
  Box,
  Flex,
  Icon,
  Link,
  Text,
  Avatar,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiPlus, FiClock, FiFolder, FiActivity, FiLogOut, FiSettings, FiMenu, FiChevronLeft, FiChevronRight, FiArrowLeft, FiArrowRight, FiMessageCircle } from 'react-icons/fi';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Custom Spiral Icon (valid JSX)
const SpiralIcon = (props: any) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Sidebar() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [toggleHovered, setToggleHovered] = useState(false);
  useEffect(() => setMounted(true), []);
  const sidebarBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.500', 'whiteAlpha.800');
  const { logout } = useAuth();
  const router = useRouter();
  const toggleBaseColor = useColorModeValue('#A0AEC0', '#1B254B');

  // Simple toggle for sidebar
  const handleToggle = () => setVisible((v) => !v);

  // HalfCircleToggleIcon: right half white when open, left half white when closed
  const HalfCircleToggleIcon = ({ open, color }: { open: boolean; color: string }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <circle cx="20" cy="20" r="18" fill={color} stroke={color} strokeWidth="2" />
      {open ? (
        // Open: right half white
        <path d="M20 2C30.4934 2 39 10.5066 39 20C39 29.4934 30.4934 38 20 38V2Z" fill="white" />
      ) : (
        // Closed: left half white
        <path d="M20 2C9.50659 2 1 10.5066 1 20C1 29.4934 9.50659 38 20 38V2Z" fill="white" />
      )}
    </svg>
  );

  if (!mounted) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      h="100vh"
      w={visible ? { base: '240px', md: '270px', lg: '300px' } : { base: '56px', md: '68px', lg: '80px' }}
      minW={visible ? { base: '240px', md: '270px', lg: '300px' } : { base: '56px', md: '68px', lg: '80px' }}
      zIndex={1000}
      bg={sidebarBg}
      boxShadow="0 0 0 1px #E2E8F0, 0 4px 24px 0 rgba(0,0,0,0.04)"
      overflow="visible"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      transition="width 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      {/* Toggle Button always visible at right edge of sidebar */}
      <Box
        position="absolute"
        top="18px"
        right="18px"
        zIndex={1001}
        cursor="pointer"
        onClick={() => setVisible((v) => !v)}
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ pointerEvents: 'auto', transition: 'background 0.3s' }}
        _hover={{ background: 'none' }}
        className="sidebar-icon-btn"
        onMouseEnter={() => setToggleHovered(true)}
        onMouseLeave={() => setToggleHovered(false)}
        sx={{
          '.toggle-circle-btn': {
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: visible ? 'rotate(180deg)' : 'rotate(0deg)',
          },
        }}
      >
        <Box
          as="span"
          display="flex"
          alignItems="center"
          justifyContent="center"
          transition="filter 0.3s"
          className="toggle-circle-btn"
        >
          <HalfCircleToggleIcon open={visible} color={toggleHovered || visible ? '#FF9900' : toggleBaseColor} />
        </Box>
      </Box>
      {/* Sidebar content always rendered, visibility toggled */}
      <Flex
        direction="column"
        w={{ base: '210px', md: '240px', lg: '270px' }}
        h="100%"
        p={visible ? { base: '18px', md: '24px', lg: '32px' } : '0'}
        pt={visible ? { base: '28px', md: '36px', lg: '48px' } : '0'}
        opacity={visible ? 1 : 0}
        pointerEvents={visible ? 'auto' : 'none'}
        justifyContent="space-between"
        style={{
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Top Logo */}
        <Box mb={{ base: '12px', md: '18px', lg: '24px' }} textAlign="center">
          <Box
            as="a"
            href="/"
            display="inline-block"
          >
            <Image
              src="/img/Zerbot_typo.png"
              alt="Zerbot Logo"
              width={visible ? 150 : 0}
              height={visible ? 50 : 0}
              className="zerbo6-logo-img"
              style={{ margin: '0 auto', maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        </Box>
        {/* Usual Chat Section */}
        <Box w="100%" mb={{ base: '14px', md: '18px', lg: '24px' }}>
          <Flex
            as="button"
            align="center"
            w="100%"
            justify="space-between"
            role="group"
            tabIndex={0}
            px={2}
            py={1}
            cursor="pointer"
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            _focus={{ bg: 'transparent' }}
          >
            <Flex align="center">
              <Icon as={FiMessageCircle} boxSize={7} mr={2} color="gray.500" _groupHover={{ color: '#FF9900' }} />
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} fontWeight="semibold" color="gray.700" mb="2" _groupHover={{ color: '#FF9900' }}>
                Usual Chat
              </Text>
            </Flex>
            <Box ml={2} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FiPlus} boxSize={5} color="gray.500" _groupHover={{ color: '#FF9900' }} />
            </Box>
          </Flex>
        </Box>
        {/* Projects Section */}
        <Box w="100%" mb={{ base: '14px', md: '18px', lg: '24px' }}>
          <Flex
            as="button"
            align="center"
            w="100%"
            justify="space-between"
            role="group"
            tabIndex={0}
            px={2}
            py={1}
            cursor="pointer"
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            _focus={{ bg: 'transparent' }}
          >
            <Flex align="center">
              <Icon as={FiFolder} boxSize={7} mr={2} color="gray.500" _groupHover={{ color: '#FF9900' }} />
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} fontWeight="semibold" color="gray.700" mb="2" _groupHover={{ color: '#FF9900' }}>
                Projects
              </Text>
            </Flex>
            <Box ml={2} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FiPlus} boxSize={5} color="gray.500" _groupHover={{ color: '#FF9900' }} />
            </Box>
          </Flex>
        </Box>
        {/* Spinners Section */}
        <Box w="100%">
          <Flex
            as="button"
            align="center"
            w="100%"
            justify="space-between"
            role="group"
            tabIndex={0}
            px={2}
            py={1}
            cursor="pointer"
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
            _focus={{ bg: 'transparent' }}
          >
            <Flex align="center">
              <Icon as={SpiralIcon} boxSize={7} mr={2} color="gray.500" _groupHover={{ color: '#FF9900' }} />
              <Text fontSize={{ base: 'md', md: 'lg', lg: 'xl' }} fontWeight="semibold" color="gray.700" mb="2" _groupHover={{ color: '#FF9900' }}>
                Spinners
              </Text>
            </Flex>
            <Box ml={2} display="flex" alignItems="center" justifyContent="center">
              <Icon as={FiPlus} boxSize={5} color="gray.500" _groupHover={{ color: '#FF9900' }} />
            </Box>
          </Flex>
        </Box>
        {/* Bottom Bar */}
        {visible ? (
          <Box pt={{ base: '10px', md: '16px', lg: '20px' }} w="100%">
            <Flex direction="column" align="center" gap={{ base: '12px', md: '18px', lg: '24px' }}>
              <Flex gap={{ base: '16px', md: '20px', lg: '24px' }}>
                <Icon as={FiSettings} w={{ base: 6, md: 7, lg: 8 }} h={{ base: 6, md: 7, lg: 8 }} color={iconColor} cursor="pointer" onClick={() => { /* settings click handler here if needed */ }} className="sidebar-icon-btn" />
                <Icon as={FiLogOut} w={{ base: 6, md: 7, lg: 8 }} h={{ base: 6, md: 7, lg: 8 }} color={iconColor} cursor="pointer" onClick={() => { logout(); router.push('/login'); }} className="sidebar-icon-btn" />
              </Flex>
            </Flex>
          </Box>
        ) : null}
      </Flex>
      {/* Always render vertical icons at the bottom when closed */}
      {!visible && (
        <Box
          position="absolute"
          bottom="24px"
          left="50%"
          transform="translateX(-50%)"
          w={{ base: '36px', md: '44px', lg: '56px' }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={{ base: '16px', md: '20px', lg: '24px' }}
          zIndex={9999}
          pointerEvents="auto"
        >
          <Icon as={FiSettings} w={{ base: 6, md: 7, lg: 8 }} h={{ base: 6, md: 7, lg: 8 }} color="gray.700" cursor="pointer" onClick={() => { /* settings click handler here if needed */ }} className="sidebar-icon-btn" />
          <Icon as={FiLogOut} w={{ base: 6, md: 7, lg: 8 }} h={{ base: 6, md: 7, lg: 8 }} color="gray.700" cursor="pointer" onClick={() => { logout(); router.push('/login'); }} className="sidebar-icon-btn" />
        </Box>
      )}
    </Box>
  );
}

// Accept fontSize and iconSize props for SidebarLink
function SidebarLink({ icon, label, fontSize = { base: 'xl', md: '2xl', lg: '3xl' }, iconSize = { base: 7, md: 8, lg: 10 } }: { icon: any; label: string; fontSize?: any; iconSize?: any }) {
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.500', 'whiteAlpha.800');

  return (
    <Link
      href="#"
      display="flex"
      alignItems="center"
      gap="14px"
      color={textColor}
      fontWeight="bold"
      _hover={{ textDecoration: 'none', color: 'orange.400' }}
      fontSize={fontSize}
    >
      <Icon as={icon} boxSize={iconSize} color={iconColor} />
      {label}
    </Link>
  );
}

export default Sidebar;
