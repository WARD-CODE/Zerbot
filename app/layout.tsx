// layout.tsx
'use client';

import React, { ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import AppWrappers from './AppWrappers';
import Sidebar from '@/components/sidebar/Sidebar';
import Navbar from '@/components/navbar/NavbarAdmin';
import Footer from '@/components/footer/FooterAdmin';
import routes from '@/routes';
import { AuthProvider } from '@/context/AuthContext';
import ChatPage from './page';

import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import '../public/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Spinner state lifted to layout
  const [spinners, setSpinners] = useState([]);
  const [activeSpinner, setActiveSpinner] = useState(null);

  return (
    <html lang="en">
      <body id="root" style={{ overflow: 'hidden', height: '100vh', background: 'transparent' }}>
        <AuthProvider>
          <AppWrappers>
            {isAuthPage ? (
              children
            ) : (
              <Flex direction="row" height="100vh" overflow="hidden">
                <Sidebar
                  spinners={spinners}
                  setSpinners={setSpinners}
                  activeSpinner={activeSpinner}
                  setActiveSpinner={setActiveSpinner}
                />
                <Flex
                  direction="column"
                  flex="1"
                  minW="0"
                  overflow="hidden"
                  ml={{ xl: '290px' }}
                  height="100vh"
                >
                  <Box
                    position="fixed"
                    top="5"
                    left={{ base: 0, xl: '290px' }}
                    right="0"
                    zIndex="1000"
                    bg="white"
                    boxShadow="sm"
                  >
                    <Navbar />
                  </Box>
                  <Box
                    pt="10px"
                    pb="80px"
                    px={{ base: '20px', md: '30px' }}
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    <ChatPage activeSpinner={activeSpinner} />
                  </Box>
                  <Box
                    pt="0.5px"
                    pb="0px"
                    position="fixed"
                    bottom="0"
                    left={{ base: 0, xl: '290px' }}
                    right="0"
                    zIndex="1000"
                    bg="white"
                    boxShadow="sm"
                  >
                    <Footer />
                  </Box>
                </Flex>
              </Flex>
            )}
          </AppWrappers>
        </AuthProvider>
      </body>
    </html>
  );
}

function formatPathname(pathname: string | null): string {
  if (!pathname) return '';
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments.pop() || '';
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
}
