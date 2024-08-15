"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hi! I'm your Food Chef. How can I help you today?` },
  ]);
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '...' },
    ]);

    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),  // Send the current message only
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from API');
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),  // Remove the '...' placeholder
        { role: 'assistant', content: data.message },  // Add the real response
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),  // Remove the '...' placeholder
        { role: 'assistant', content: 'Sorry, something went wrong.' },  // Handle error
      ]);
    }
  };

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to format message content
  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => {
      // Replace **text** with <strong>text</strong>
      const formattedLine = line.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i}>{part.slice(2, -2)}</strong>
          );
        }
        return part;
      });
  
      // Check for bullet points
      if (formattedLine[0] && formattedLine[0].startsWith('* ')) {
        return (
          <li key={index} style={{ marginLeft: '20px' }}>
            {formattedLine.map((item, i) => {
              if (typeof item === 'string') {
                return <span key={i}>{item.trim().slice(2)}</span>;
              } else {
                return <span key={i}>{item}</span>;
              }
            })}
          </li>
        );
      }
  
      return (
        <p key={index} style={{ margin: 0, marginBottom: '1em' }}>
          {formattedLine.map((item, i) => {
            if (typeof item === 'string') {
              return <span key={i}>{item}</span>;
            } else {
              return <span key={i}>{item}</span>;
            }
          })}
        </p>
      );
    });
  };
  

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#999"
    >
      <Box
        bgcolor="black"
        width="800px"
        borderRadius={6}
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        border="2px solid black"
        margin={2}
      >
        <h1 style={{ color: 'white' }} mr={4}>ChefAI</h1>
        <h2 style={{ color: 'white', fontStyle: 'italic' }}>Your Recipe Support</h2>
      </Box>
      <Stack
        direction={'column'}
        width="800px" // Increased width
        height="550px" // Increased height
        spacing={1} // Increased spacing between elements
        border="2px solid black"
        borderRadius={6}
        bgcolor="white"
      >
        {/* Scrollable chat container */}
        <Stack
          direction={'column'}
          spacing={2} // Increased spacing between messages
          padding={4} // Increased padding
          flexGrow={1}
          ref={chatContainerRef}
          sx={{ overflowY: 'auto' }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              py={1} // Added padding top and bottom
            >
              <Box
                bgcolor={message.role === 'assistant' ? '#333' : 'brown'}
                color="white"
                borderRadius={6}
                p={2} // Increased padding
              >
                {formatMessage(message.content)}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2} padding={2} >
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
