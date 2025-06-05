'use client';

import {
  Box,
  Button,
  Flex,
  Textarea,
  Text,
  useColorModeValue,
  useToast,
  Icon,
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiDownload } from 'react-icons/fi';
import { BackendChatService } from '@/utils/backendChatService';

const SpiralIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4"
      stroke="#FF9900"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface Message {
  text: string;
  sender: string;
  error?: boolean;
  downloadUrl?: string;
  fileId?: string;
}

export default function ChatPage({ activeSpinner }: { activeSpinner: any }) {
  const [input, setInput] = useState('');
  const [discussionStarted, setDiscussionStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevSpinnerRef = useRef(activeSpinner);
  const chatService = useRef<BackendChatService | null>(null);
  const toast = useToast();

  const textColor = useColorModeValue('gray.500', 'whiteAlpha.600');
  const gray = useColorModeValue('gray.500', 'whiteAlpha.600');

  // Initialize chat service
  useEffect(() => {
    chatService.current = new BackendChatService();
  }, []);

  // Determine title and placeholder based on activeSpinner
  const title = activeSpinner ? `${activeSpinner}` : 'Instant Chat';
  const placeholder = activeSpinner
    ? `Message ${activeSpinner}`
    : 'Message Zerbot';

  // Reset to center when spinner changes
  useEffect(() => {
    if (prevSpinnerRef.current !== activeSpinner) {
      setDiscussionStarted(false);
      setMessages([]);
      setInput('');
      if (chatService.current) {
        chatService.current.clearSession();
      }
      prevSpinnerRef.current = activeSpinner;
    }
  }, [activeSpinner]);

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading && chatService.current) {
      const userMessage = input.trim();
      setInput('');
      setDiscussionStarted(true);
      setIsLoading(true);

      // Add user message
      setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);

      try {
        // Check if this is an executable generation request
        const isExecutableRequest =
          /\b(make|create|generate|build)\s+(executable|exe|program)\b/i.test(
            userMessage,
          ) ||
          /\b(compile|convert)\s+to\s+(exe|executable)\b/i.test(userMessage);

        if (isExecutableRequest) {
          // Generate executable
          const response = await chatService.current.generateExecutable(
            userMessage,
          );

          setMessages((prev) => [
            ...prev,
            {
              text: response.response,
              sender: 'bot',
              downloadUrl: response.download_url,
              fileId: response.file_id,
            },
          ]);
        } else {
          // Regular chat
          const response = await chatService.current.sendMessage(userMessage);

          setMessages((prev) => [
            ...prev,
            {
              text: response.response,
              sender: 'bot',
              downloadUrl: response.download_url,
              fileId: response.file_id,
            },
          ]);
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        setMessages((prev) => [
          ...prev,
          {
            text: `Sorry, I encountered an error: ${errorMessage}. Please check your backend settings and make sure the server is running.`,
            sender: 'bot',
            error: true,
          },
        ]);

        toast({
          title: 'Connection Error',
          description:
            'Failed to connect to Zerbot backend. Check your settings.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = async (fileId: string) => {
    if (chatService.current) {
      try {
        await chatService.current.downloadExecutable(fileId);
        toast({
          title: 'Download Started',
          description: 'Your executable file download has started.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Download Failed',
          description: 'Failed to download the executable file.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Layout state: centered at first, then animates down after chat starts
  const isCentered = !discussionStarted;

  return (
    <Box w="100vw" h="100vh" overflow="hidden" position="relative">
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

      {/* Main chat area */}
      {isCentered ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          w="100%"
          h="100%"
          position="relative"
          zIndex={1}
          px="20px"
          style={{
            transition: 'justify-content 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <Text
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight="bold"
            color={textColor}
            textAlign="center"
            bg="transparent"
            px="16px"
            py="8px"
            borderRadius="xl"
            mb="32px"
            style={{ transition: 'margin 0.6s cubic-bezier(0.4,0,0.2,1)' }}
          >
            {title}
          </Text>
          <Flex
            direction="row"
            align="flex-end"
            gap={{ base: '16px', md: '24px' }}
            bg="rgba(255,255,255,0.15)"
            borderRadius="3xl"
            px={{ base: '18px', md: '32px' }}
            py={{ base: '32px', md: '48px' }}
            boxShadow="0 4px 24px 0 rgba(31,38,135,0.10)"
            style={{
              backdropFilter: 'blur(8px)',
              transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
            }}
            minH="100px"
            w="100%"
            maxW="1400px"
          >
            <Textarea
              variant="unstyled"
              placeholder={placeholder}
              _placeholder={{
                color: gray,
                fontSize: { base: 'xl', md: '2xl' },
              }}
              color={textColor}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              resize="none"
              minH="80px"
              maxH="120px"
              pr="90px"
              fontSize={{ base: 'xl', md: '2xl' }}
              lineHeight="2"
              bg="transparent"
              border="none"
              boxShadow="none"
              _focus={{ boxShadow: 'none', border: 'none' }}
              flex="1"
              disabled={isLoading}
            />
            {/* Resize scale at the far right */}
            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="center"
              h="100%"
              ml="8px"
              mr="8px"
              mb="6px"
            >
              <Box
                as="span"
                display="inline-block"
                width="24px"
                height="24px"
                borderRadius="sm"
                opacity={0.5}
                style={{ cursor: 'nwse-resize', userSelect: 'none' }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6"
                    stroke="#A0AEC0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 18L18 10"
                    stroke="#A0AEC0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 18L18 14"
                    stroke="#A0AEC0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </Box>
            </Box>
            {/* DeepSearch as a round earth button */}
            <Button
              bg="white"
              color="#FF9900"
              _hover={{ bg: 'orange.100' }}
              borderRadius="full"
              minW="56px"
              h="56px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="md"
              mr={{ base: '0', md: '8px' }}
              ml={{ base: '0', md: '8px' }}
              mt="16px"
              p={0}
              disabled={isLoading}
            >
              <Icon as={FiGlobe} w="28px" h="28px" />
            </Button>
            {/* Send button */}
            <Button
              bg="white"
              color="orange.400"
              _hover={{ bg: 'orange.100' }}
              borderRadius="full"
              p="0"
              minW="56px"
              h="56px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="md"
              onClick={handleSendMessage}
              ml={{ base: '0', md: '8px' }}
              mt="16px"
              disabled={isLoading || !input.trim()}
            >
              <SpiralIcon width={32} height={32} />
            </Button>
          </Flex>
        </Flex>
      ) : (
        <Box
          h="100vh"
          w="100%"
          position="relative"
          display="flex"
          flexDirection="column"
        >
          {/* Title always at the top */}
          <Box
            position="absolute"
            top={{ base: '14vh', md: '16vh', lg: '18vh' }}
            left="0"
            right="0"
            zIndex={10}
            w="100%"
            textAlign="center"
            py={{ base: '16px', md: '24px', lg: '32px' }}
            bg="transparent"
          >
            <Text
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontWeight="bold"
              color={textColor}
            >
              {title}
            </Text>
          </Box>

          {/* Messages area */}
          <Box
            position="absolute"
            left="0"
            right="0"
            bottom={{ base: '20vh', md: '20vh', lg: '20vh' }}
            w="105%"
            maxW="2050px"
            mx="auto"
            zIndex={5}
          >
            <Box
              overflowY="auto"
              h={{ base: '32vh', md: '34vh', lg: '45vh' }}
              bg="transparent"
              w="100%"
              sx={{
                '::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <Flex direction="column" gap="24px">
                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    display="flex"
                    position="relative"
                    left="-400px"
                    right="0"
                    top="0"
                    bottom="0"
                    justifyContent={
                      msg.sender === 'user'
                        ? 'flex-end'
                        : msg.sender === 'bot'
                        ? 'center'
                        : 'flex-start'
                    }
                  >
                    <Box
                      bg={msg.sender === 'user' ? 'orange.100' : 'white'}
                      color={msg.sender === 'user' ? 'orange.900' : 'navy.700'}
                      px="22px"
                      py="14px"
                      borderRadius="xl"
                      boxShadow={
                        msg.sender === 'user'
                          ? '0 2px 8px 0 rgba(255,153,0,0.10)'
                          : '0 2px 12px 0 rgba(31,38,135,0.08)'
                      }
                      fontSize={{ base: 'lg', md: 'xl' }}
                      fontWeight={msg.sender === 'user' ? 'bold' : 'normal'}
                      maxW="60%"
                      textAlign={
                        msg.sender === 'bot' && msg.error
                          ? 'center'
                          : msg.sender === 'user'
                          ? 'right'
                          : 'left'
                      }
                      border={msg.error ? '1.5px solid #e2e8f0' : 'none'}
                      style={{
                        fontFamily: 'inherit',
                        ...(msg.error
                          ? { background: 'rgba(255,255,255,0.95)' }
                          : {}),
                      }}
                    >
                      <Text mb={msg.downloadUrl ? 2 : 0}>{msg.text}</Text>
                      {msg.downloadUrl && msg.fileId && (
                        <Button
                          size="sm"
                          colorScheme="orange"
                          leftIcon={<Icon as={FiDownload} />}
                          onClick={() => handleDownload(msg.fileId!)}
                          mt={2}
                        >
                          Download Executable
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
                {isLoading && (
                  <Box display="flex" justifyContent="center">
                    <Box
                      bg="white"
                      px="22px"
                      py="14px"
                      borderRadius="xl"
                      boxShadow="0 2px 12px 0 rgba(31,38,135,0.08)"
                    >
                      <Text>Zerbot is thinking...</Text>
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Flex>
            </Box>
          </Box>

          {/* Message bar always at the bottom */}
          <Box
            position="absolute"
            left="0"
            right="0"
            bottom="0"
            zIndex={20}
            w="100%"
            px="24px"
            pb="24px"
            display="flex"
            justifyContent="center"
          >
            <Flex
              w="100%"
              maxW="1400px"
              bg="rgba(255,255,255,0.15)"
              borderRadius="3xl"
              boxShadow="0 4px 24px 0 rgba(31,38,135,0.10)"
              backdropFilter="blur(8px)"
              align="flex-end"
              px="32px"
              py="18px"
            >
              <Textarea
                variant="unstyled"
                placeholder={placeholder}
                _placeholder={{
                  color: gray,
                  fontSize: { base: 'xl', md: '2xl' },
                }}
                color={textColor}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                resize="none"
                minH="40px"
                maxH="120px"
                pr="90px"
                fontSize={{ base: 'xl', md: '2xl' }}
                lineHeight="2"
                bg="transparent"
                border="none"
                boxShadow="none"
                _focus={{ boxShadow: 'none', border: 'none' }}
                flex="1"
                disabled={isLoading}
              />
              {/* Resize scale at the far right */}
              <Box
                display="flex"
                alignItems="flex-end"
                justifyContent="center"
                h="100%"
                ml="8px"
                mr="8px"
                mb="6px"
              >
                <Box
                  as="span"
                  display="inline-block"
                  width="24px"
                  height="24px"
                  borderRadius="sm"
                  opacity={0.5}
                  style={{ cursor: 'nwse-resize', userSelect: 'none' }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 18L18 6"
                      stroke="#A0AEC0"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 18L18 10"
                      stroke="#A0AEC0"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14 18L18 14"
                      stroke="#A0AEC0"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Box>
              </Box>
              {/* DeepSearch as a round earth button */}
              <Button
                bg="white"
                color="#FF9900"
                _hover={{ bg: 'orange.100' }}
                borderRadius="full"
                minW="56px"
                h="56px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="md"
                mr={{ base: '0', md: '8px' }}
                ml={{ base: '0', md: '8px' }}
                mt="16px"
                p={0}
                disabled={isLoading}
              >
                <Icon as={FiGlobe} w="28px" h="28px" />
              </Button>
              {/* Send button */}
              <Button
                bg="white"
                color="orange.400"
                _hover={{ bg: 'orange.100' }}
                borderRadius="full"
                p="0"
                minW="56px"
                h="56px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="md"
                onClick={handleSendMessage}
                ml={{ base: '0', md: '8px' }}
                mt="16px"
                disabled={isLoading || !input.trim()}
              >
                <SpiralIcon width={32} height={32} />
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
}
