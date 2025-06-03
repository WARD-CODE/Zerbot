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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Button,
  Textarea,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Collapse,
  IconButton,
} from '@chakra-ui/react';
import { FiPlus, FiClock, FiFolder, FiActivity, FiLogOut, FiSettings, FiMenu, FiChevronLeft, FiChevronRight, FiArrowLeft, FiArrowRight, FiMessageCircle, FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

// Custom Spiral Icon (valid JSX)
const SpiralIcon = (props: any) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Accept spinner state as props
function Sidebar({ spinners, setSpinners, activeSpinner, setActiveSpinner }) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [toggleHovered, setToggleHovered] = useState(false);
  const [isSpinnerModalOpen, setSpinnerModalOpen] = useState(false);
  const [newSpinnerName, setNewSpinnerName] = useState('');
  const [newSpinnerInstructions, setNewSpinnerInstructions] = useState('');
  const [newSpinnerCreativity, setNewSpinnerCreativity] = useState(0.5);
  const [newSpinnerWordFocus, setNewSpinnerWordFocus] = useState(5);
  const [newSpinnerWordDiversity, setNewSpinnerWordDiversity] = useState(5);
  const [newSpinnerMaxLength, setNewSpinnerMaxLength] = useState(1000);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
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

  // Handler for adding a new spinner
  const handleAddSpinner = () => {
    if (newSpinnerName.trim()) {
      const newSpinner = {
        name: newSpinnerName.trim(),
        instructions: newSpinnerInstructions,
        creativity: newSpinnerCreativity,
        wordFocus: newSpinnerWordFocus,
        wordDiversity: newSpinnerWordDiversity,
        maxLength: newSpinnerMaxLength,
      };
      setSpinners([...spinners, newSpinner]);
      setActiveSpinner(newSpinner.name);
    }
    setSpinnerModalOpen(false);
    setNewSpinnerName('');
    setNewSpinnerInstructions('');
    setNewSpinnerCreativity(0.5);
    setNewSpinnerWordFocus(5);
    setNewSpinnerWordDiversity(5);
    setNewSpinnerMaxLength(1000);
  };

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
            onClick={() => setSpinnerModalOpen(true)}
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
          {/* Spinner List */}
          <Box mt={2} ml={0} maxH="132px" overflowY="auto" p={0} w="100%">
            {spinners.map((spinner) => (
              <Flex
                key={spinner.name}
                align="center"
                py={2}
                px={4}
                borderRadius="md"
                cursor="pointer"
                bg={activeSpinner === spinner.name ? 'rgba(255,153,0,0.10)' : 'transparent'}
                _hover={{ bg: 'rgba(31,38,135,0.06)' }}
                onClick={() => setActiveSpinner(spinner.name)}
                transition="background 0.2s"
                mb={0.5}
                fontWeight={activeSpinner === spinner.name ? 'bold' : '500'}
                fontSize="md"
                letterSpacing="0.01em"
                color={activeSpinner === spinner.name ? 'orange.700' : 'gray.700'}
                position="relative"
                pr={8}
                role="group"
                w="100%"
              >
                <Icon as={SpiralIcon} boxSize={6} mr={2} color="orange.400" />
                <Text isTruncated maxW="170px">{spinner.name}</Text>
              </Flex>
            ))}
          </Box>
          {/* Spinner Creation Modal */}
          <Modal isOpen={isSpinnerModalOpen} onClose={() => setSpinnerModalOpen(false)} isCentered size="lg">
            <ModalOverlay />
            <ModalContent bg="white" border="2px solid #FF9900" borderRadius="xl" boxShadow="lg">
              <ModalHeader color="gray.700">Create New Spinner</ModalHeader>
              <ModalCloseButton color="gray.500" />
              <ModalBody>
                <Box fontWeight="bold" fontSize="lg" color="gray.700" mb={2}>Basic Configuration</Box>
                <Box mb={4}>
                  <Text mb={1} fontWeight="medium" color="gray.700">Spinner Name</Text>
                  <Input
                    placeholder="Enter spinner name"
                    value={newSpinnerName}
                    onChange={(e) => setNewSpinnerName(e.target.value)}
                    color="gray.700"
                    borderColor="#FF9900"
                    _focus={{ borderColor: '#FF9900', boxShadow: '0 0 0 1px #FF9900' }}
                  />
                </Box>
                <Box mb={4}>
                  <Text mb={1} fontWeight="medium" color="gray.700">System Instructions</Text>
                  <Textarea
                    placeholder="Enter system instructions for the spinner..."
                    value={newSpinnerInstructions}
                    onChange={(e) => setNewSpinnerInstructions(e.target.value)}
                    color="gray.700"
                    borderColor="#FF9900"
                    _focus={{ borderColor: '#FF9900', boxShadow: '0 0 0 1px #FF9900' }}
                    minH="100px"
                  />
                </Box>
                <Flex align="center" justify="space-between" mb={2} cursor="pointer" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}>
                  <Box fontWeight="bold" fontSize="lg" color="gray.700">Advanced Configuration</Box>
                  <IconButton
                    aria-label="Toggle advanced configuration"
                    icon={<FiChevronDown />}
                    variant="ghost"
                    size="sm"
                    transform={isAdvancedOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                    transition="transform 0.2s"
                    color="gray.500"
                  />
                </Flex>
                <Collapse in={isAdvancedOpen} animateOpacity>
                  <Box pt={2}>
                    <Text fontWeight="medium" color="gray.700" mb={1}>Creativity Level <span style={{ color: '#FF9900', fontWeight: 'bold' }}>{newSpinnerCreativity.toFixed(2)}</span></Text>
                    <Slider
                      value={newSpinnerCreativity}
                      onChange={(val) => setNewSpinnerCreativity(val)}
                      min={0}
                      max={1}
                      step={0.01}
                      colorScheme="orange"
                      mb={4}
                    >
                      <SliderTrack h="4px" bg="gray.100">
                        <SliderFilledTrack bg="orange.400" />
                      </SliderTrack>
                      <SliderThumb boxSize={6} border="2px solid" borderColor="orange.400" />
                    </Slider>
                    <Flex align="center" mb={2}>
                      <Text fontWeight="medium" color="gray.700" flex="1">Word Choice Focus</Text>
                      <NumberInput
                        value={newSpinnerWordFocus}
                        onChange={(_, val) => setNewSpinnerWordFocus(val)}
                        min={1}
                        max={10}
                        color="gray.700"
                        w="120px"
                      >
                        <NumberInputField borderColor="#FF9900" _focus={{ borderColor: '#FF9900', boxShadow: '0 0 0 1px #FF9900' }} textAlign="center" fontWeight="bold" />
                        <NumberInputStepper>
                          <NumberIncrementStepper color="#FF9900" />
                          <NumberDecrementStepper color="#FF9900" />
                        </NumberInputStepper>
                      </NumberInput>
                    </Flex>
                    <Flex align="center" mb={2}>
                      <Text fontWeight="medium" color="gray.700" flex="1">Word Diversity</Text>
                      <NumberInput
                        value={newSpinnerWordDiversity}
                        onChange={(_, val) => setNewSpinnerWordDiversity(val)}
                        min={1}
                        max={10}
                        color="gray.700"
                        w="120px"
                      >
                        <NumberInputField borderColor="#FF9900" _focus={{ borderColor: '#FF9900', boxShadow: '0 0 0 1px #FF9900' }} textAlign="center" fontWeight="bold" />
                        <NumberInputStepper>
                          <NumberIncrementStepper color="#FF9900" />
                          <NumberDecrementStepper color="#FF9900" />
                        </NumberInputStepper>
                      </NumberInput>
                    </Flex>
                    <Flex align="center" mb={2}>
                      <Text fontWeight="medium" color="gray.700" flex="1">Maximum Response Length</Text>
                      <NumberInput
                        value={newSpinnerMaxLength}
                        onChange={(_, val) => setNewSpinnerMaxLength(val)}
                        min={100}
                        max={2000}
                        step={100}
                        color="gray.700"
                        w="120px"
                      >
                        <NumberInputField borderColor="#FF9900" _focus={{ borderColor: '#FF9900', boxShadow: '0 0 0 1px #FF9900' }} textAlign="center" fontWeight="bold" />
                        <NumberInputStepper>
                          <NumberIncrementStepper color="#FF9900" />
                          <NumberDecrementStepper color="#FF9900" />
                        </NumberInputStepper>
                      </NumberInput>
                    </Flex>
                  </Box>
                </Collapse>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="orange" bg="#FF9900" color="white" mr={3} onClick={handleAddSpinner} _hover={{ bg: '#ffae42' }}>
                  Add
                </Button>
                <Button colorScheme="orange" bg="#FF9900" color="white" onClick={() => setSpinnerModalOpen(false)} _hover={{ bg: '#ffae42' }}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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

Sidebar.propTypes = {
  spinners: PropTypes.array.isRequired,
  setSpinners: PropTypes.func.isRequired,
  activeSpinner: PropTypes.string,
  setActiveSpinner: PropTypes.func.isRequired,
};

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
