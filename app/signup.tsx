import { Box, Button, Flex, Input, Text, Link } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
          User Signup
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
            mb={4}
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            size="lg"
            borderRadius="full"
            bg="gray.50"
          />
          <Input
            mb={6}
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            size="lg"
            borderRadius="full"
            bg="gray.50"
          />
          <Button
            w="100%"
            colorScheme="orange"
            borderRadius="full"
            size="lg"
            mb={4}
            type="submit"
            isDisabled
          >
            Sign up
          </Button>
        </form>
        <Flex justify="space-between" align="center" mt={2}>
          <Link color="orange.400" fontWeight="bold" href="/login">
            Login
          </Link>
          <Link color="gray.500" href="/admin/signup">
            Sign up as Admin
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
} 