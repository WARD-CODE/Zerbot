"use client";

import { Box, Button, Flex, Input, Text, Link, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props: any) => (
  <svg width={20} height={20} viewBox="0 0 48 48" {...props}>
    <g>
      <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.82 2.36 30.28 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.36 13.6 17.73 9.5 24 9.5z"/>
      <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/>
      <path fill="#FBBC05" d="M10.67 28.29A14.5 14.5 0 019.5 24c0-1.49.26-2.93.72-4.29l-7.98-6.2A23.93 23.93 0 000 24c0 3.77.9 7.34 2.49 10.49l8.18-6.2z"/>
      <path fill="#EA4335" d="M24 48c6.28 0 11.56-2.08 15.41-5.66l-7.19-5.6c-2.01 1.35-4.59 2.16-8.22 2.16-6.27 0-11.63-4.1-13.53-9.59l-8.18 6.2C6.73 42.18 14.82 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </g>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <Flex minH="100vh" align="center" justify="center" bg="transparent">
      <Box
        bg="white"
        p={{ base: 6, md: 10 }}
        borderRadius="2xl"
        boxShadow="lg"
        minW={{ base: '90vw', md: '400px' }}
        maxW="400px"
        zIndex={2}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} color="orange.500" textAlign="center">
          Login
        </Text>
        <form>
          <Input
            mb={4}
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="lg"
            borderRadius="full"
            bg="gray.50"
          />
          <Input
            mb={6}
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            size="lg"
            borderRadius="full"
            bg="gray.50"
          />
          <Button
            w="100%"
            mb={4}
            leftIcon={<GoogleIcon />}
            bg="white"
            color="gray.700"
            border="1px solid #e0e0e0"
            borderRadius="full"
            boxShadow="sm"
            _hover={{ bg: '#f5f5f5' }}
            fontWeight="bold"
            fontSize="md"
            type="button"
          >
            Continue with Google
          </Button>
          <Button
            w="100%"
            colorScheme="orange"
            borderRadius="full"
            size="lg"
            mb={2}
            type="submit"
            isDisabled
          >
            Login
          </Button>
          <Flex justify="flex-end" align="center" mt={1} mb={2}>
            <Link color="gray.500" href="/forgot-password" fontSize="sm">
              Forgot password?
            </Link>
          </Flex>
        </form>
        <Flex justify="space-between" align="center" mt={2}>
          <Link color="orange.400" fontWeight="bold" href="/signup">
            Register
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
} 