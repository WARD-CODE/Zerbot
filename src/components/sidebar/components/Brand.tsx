'use client';

import { Flex, Image } from '@chakra-ui/react';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  return (
    <Flex alignItems="center" flexDirection="column" mt="20px">
      <Image src="/img/Zerbot_typo.png" alt="Zerbo6 Logo" height="30px" mb="15px" />
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
