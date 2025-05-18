"use client";
import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="#fff">
      {children}
    </Flex>
  );
} 