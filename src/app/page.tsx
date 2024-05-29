'use client';
import { Box, Container } from "@chakra-ui/react";
import Calendar from "./components/Calendar";
export default function Home() {
  return (
    <Container maxW="container.xl" p={4}>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
        <Calendar />
      </Box>
    </Container>
  );
}
