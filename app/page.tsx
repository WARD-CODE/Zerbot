'use client';

import {
  Box,
  Button,
  Flex,
  Icon,
  Textarea,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const SpiralIcon = (props: any) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4" stroke="#FF9900" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ChatPage() {
  const [input, setInput] = useState('');

  const textColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'whiteAlpha.600');

  return (
    <Box
      w="100vw"
      h="100vh"
      overflow="hidden"
      position="relative"
    >
      {/* Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        backgroundImage="url('/img/chat/pattern-bg.svg')"
        backgroundRepeat="no-repeat"
        backgroundPosition="center"
        backgroundSize="contain"
        opacity="0.5"
        zIndex={0}
      />

      {/* المحتوى فوق الخلفية */}
      <Flex
        direction="column"
        align="center"
        justify="center"
        w="100%"
        h="100%"
        position="relative"
        zIndex={1}
        px="20px"
      >
        {/* العنوان */}
        <Text
          fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
          fontWeight="bold"
          mb="40px"
          color={textColor}
          textAlign="center"
        >
          What do you need?
        </Text>

        {/* مربع الرسالة */}
        <Flex
          align="flex-end"
          bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
          borderRadius="2xl"
          px="32px"
          py="28px"
          w="100%"
          maxW="1100px"
          minH="140px"
          boxShadow="md"
          mb="32px"
          position="relative"
        >
          <Textarea
            variant="unstyled"
            placeholder="Message Zerbot"
            _placeholder={{ color: gray, fontSize: { base: 'xl', md: '2xl' } }}
            color={textColor}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            resize="vertical"
            minH="80px"
            maxH="300px"
            pr="90px"
            fontSize={{ base: 'xl', md: '2xl' }}
            lineHeight="2"
            bg="transparent"
            border="none"
            boxShadow="none"
            _focus={{ boxShadow: 'none', border: 'none' }}
          />
          <Button
            bg="white"
            color="orange.400"
            _hover={{ bg: 'orange.100' }}
            borderRadius="full"
            p="0"
            minW="64px"
            h="64px"
            position="absolute"
            right="18px"
            bottom="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="md"
          >
            <span className="spiral-action-icon">
              <SpiralIcon width={40} height={40} />
            </span>
          </Button>
        </Flex>

        {/* الأزرار تحت الرسالة */}
        <Flex gap="15px" justify="center" mb="20px" align="center">
          <Button
            bg="orange.200"
            color="orange.800"
            _hover={{ bg: 'orange.300' }}
            borderRadius="full"
            px="28px"
            fontWeight="bold"
            h="44px"
            fontSize="lg"
            minW="160px"
          >
            DeepSearch
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              bg="orange.200"
              color="orange.800"
              _hover={{ bg: 'orange.300' }}
              borderRadius="full"
              px="28px"
              fontWeight="bold"
              h="44px"
              fontSize="lg"
              minW="160px"
              rightIcon={<ChevronDownIcon color="orange.800" />}
              boxShadow="md"
            >
              Zerbo6 1.0
            </MenuButton>
            <MenuList minW="160px" borderRadius="xl" boxShadow="md">
              <MenuItem fontWeight="bold" color="orange.800">Zerbo6 1.0</MenuItem>
              <MenuItem fontWeight="bold" color="orange.800">LaMA (soon)</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}
