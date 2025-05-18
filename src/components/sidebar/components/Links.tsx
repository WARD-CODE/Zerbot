'use client';

import { Flex, Box, Text, useColorModeValue } from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';
import { usePathname } from 'next/navigation';

interface SidebarLinksProps {
  routes: IRoute[];
}

export function SidebarLinks({ routes }: SidebarLinksProps) {
  const pathname = usePathname();
  const activeColor = useColorModeValue('orange.500', 'orange.300');
  const inactiveColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');

  const isActive = (path: string) => pathname?.includes(path);

  return (
    <>
      {routes.map((route, key) => (
        <NavLink
          key={key}
          href={route.layout ? route.layout + route.path : route.path}
          style={{ width: '100%' }}
        >
          <Flex
            align="center"
            px="4"
            py="3"
            borderRadius="lg"
            _hover={{ bg: hoverBg }}
          >
            {route.icon && (
              <Box
                color={isActive(route.path) ? activeColor : inactiveColor}
                me="3"
              >
                {route.icon}
              </Box>
            )}
            <Text
              color={isActive(route.path) ? activeColor : inactiveColor}
              fontWeight={isActive(route.path) ? 'bold' : 'normal'}
              fontSize="sm"
            >
              {route.name}
            </Text>
          </Flex>
        </NavLink>
      ))}
    </>
  );
}

export default SidebarLinks;
