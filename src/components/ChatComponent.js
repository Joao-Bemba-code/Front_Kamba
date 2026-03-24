// components/ChatComponent.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Stack,
  CircularProgress,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const ChatComponent = ({ projectId, currentUserId, projectOwnerId, projectTitle, onClose, onUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  console.log('ChatComponent props:', { projectId, currentUserId, projectOwnerId, projectTitle });

  // Verificar se os dados necessários existem
  if (!projectId || !currentUserId || !projectOwnerId) {
    console.error('Dados incompletos:', { projectId, currentUserId, projectOwnerId });
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Erro: Dados do chat incompletos
        </Alert>
        <Button variant="contained" onClick={onClose}>Fechar</Button>
      </Box>
    );
  }

  const isInvestor = currentUserId !== projectOwnerId;
  const receiverId = isInvestor ? projectOwnerId : currentUserId;

  console.log('Chat config:', { isInvestor, receiverId });

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      console.log('Buscando mensagens...');
      const response = await axios.get(`${API_BASE_URL}/api/chat/project/${projectId}`, {
        params: { userId: currentUserId }
      });
      console.log('Resposta:', response.data);
      
      if (response.data.success) {
        const filteredMessages = response.data.messages.filter(msg => 
          (msg.senderId === currentUserId && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === currentUserId)
        );
        setMessages(filteredMessages);
        markAsRead();
        setError(null);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      setError(error.response?.data?.message || error.message || 'Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/chat/read/${projectId}`, {
        userId: currentUserId
      });
      if (onUnreadCount) {
        onUnreadCount(0);
      }
    } catch (error) {
      console.error('Erro ao marcar como lidas:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat/send`, {
        projectId,
        senderId: currentUserId,
        receiverId: receiverId,
        message: newMessage,
        messageType: 'text'
      });

      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError(error.response?.data?.message || 'Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-AO', { day: 'numeric', month: 'long' });
  };

  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach(msg => {
      const date = formatDate(msg.createdAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 2, p: 3 }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchMessages}>Tentar novamente</Button>
        <Button variant="text" onClick={onClose}>Fechar</Button>
      </Box>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {projectTitle}
          </Typography>
          <Chip 
            size="small" 
            label={isInvestor ? 'Conversa com Empreendedor' : 'Conversa com Investidor'} 
            color="primary" 
            variant="outlined" 
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>

      {/* Messages Area */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'grey.50' }}>
        {Object.entries(messageGroups).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Nenhuma mensagem ainda. Seja o primeiro a conversar!
            </Typography>
          </Box>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <Box key={date}>
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="caption" sx={{ bgcolor: 'grey.200', px: 2, py: 0.5, borderRadius: 2 }}>
                  {date}
                </Typography>
              </Box>
              {msgs.map((msg) => {
                const isOwn = msg.senderId === currentUserId;
                return (
                  <Box key={msg.id} sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        maxWidth: '70%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: isOwn ? 'primary.main' : 'white',
                        color: isOwn ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">{msg.message}</Typography>
                      <Typography variant="caption" display="block" textAlign="right" sx={{ mt: 0.5, opacity: 0.7 }}>
                        {formatTime(msg.createdAt)}
                      </Typography>
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatComponent;