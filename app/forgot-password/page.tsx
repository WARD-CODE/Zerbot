"use client";
import { Box, Button, Flex, Input, Text, Link } from '@chakra-ui/react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

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
          Forgot Password
        </Text>
        <form>
          <Input
            mb={6}
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="lg"
            borderRadius="full"
            bg="gray.50"
          />
          <Button
            w="100%"
            colorScheme="orange"
            borderRadius="full"
            size="lg"
            mb={2}
            type="submit"
            isDisabled
          >
            Send Reset Link
          </Button>
        </form>
        <Flex justify="center" align="center" mt={2}>
          <Link color="orange.400" fontWeight="bold" href="/login">
            Back to Login
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
} 