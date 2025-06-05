'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BackendSettings {
  backendUrl: string;
  geminiApiKey: string;
}

export default function ApiModal({ isOpen, onClose }: ApiModalProps) {
  const [settings, setSettings] = useState<BackendSettings>({
    backendUrl: 'http://localhost:8000',
    geminiApiKey: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const toast = useToast();

  // Load saved settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('zerbotBackendSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const testBackendConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${settings.backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Backend health check failed: ${response.status}`);
      }

      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  };

  const handleSave = async () => {
    if (!settings.backendUrl.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Backend URL is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!settings.geminiApiKey.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Gemini API Key is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setIsTestingConnection(true);

    try {
      // Save settings to localStorage
      localStorage.setItem('zerbotBackendSettings', JSON.stringify(settings));

      // Test backend connection
      const isHealthy = await testBackendConnection();

      if (isHealthy) {
        toast({
          title: 'Settings Saved',
          description:
            'Backend settings saved and connection verified successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: 'Settings Saved with Warning',
          description:
            'Settings saved but backend connection test failed. Please check if the backend server is running.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Save Failed',
        description: `Settings saved but backend connection test failed: ${errorMessage}`,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setIsTestingConnection(false);
    }
  };

  const handleTestConnection = async () => {
    if (!settings.backendUrl.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a backend URL first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsTestingConnection(true);

    try {
      const isHealthy = await testBackendConnection();

      if (isHealthy) {
        toast({
          title: 'Connection Success',
          description: 'Successfully connected to the backend!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description:
            'Failed to connect to the backend. Please check the URL and ensure the server is running.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: 'Connection Test Failed',
        description: `Failed to test backend connection: ${errorMessage}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Backend Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Alert status="info">
              <AlertIcon />
              <Text fontSize="sm">
                Configure your Zerbot backend connection and API settings. Make
                sure your backend server is running.
              </Text>
            </Alert>

            <FormControl isRequired>
              <FormLabel>Backend URL</FormLabel>
              <Input
                placeholder="http://localhost:8000"
                value={settings.backendUrl}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    backendUrl: e.target.value,
                  }))
                }
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                The URL where your FastAPI backend is running
              </Text>
            </FormControl>

            <Divider />

            <FormControl isRequired>
              <FormLabel>Gemini API Key</FormLabel>
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={settings.geminiApiKey}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    geminiApiKey: e.target.value,
                  }))
                }
              />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Get your API key from Google AI Studio (makersuite.google.com)
              </Text>
            </FormControl>

            <Alert status="warning">
              <AlertIcon />
              <Text fontSize="sm">
                Your API key will be stored locally in your browser and sent to
                the backend server for AI requests.
              </Text>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={handleTestConnection}
            isLoading={isTestingConnection}
            loadingText="Testing..."
          >
            Test Connection
          </Button>
          <Button
            colorScheme="orange"
            onClick={handleSave}
            isLoading={isLoading}
            loadingText="Saving..."
          >
            Save Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
