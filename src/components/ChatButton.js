// components/ChatButton.js
"use client";

import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Dialog,
  DialogContent,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatComponent from './ChatComponent';

const ChatButton = ({ projectId, currentUserId, projectOwnerId, projectTitle, unreadCount = 0, onUnreadCountChange }) => {
  const [open, setOpen] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

  const handleUnreadCount = (count) => {
    setLocalUnreadCount(count);
    if (onUnreadCountChange) {
      onUnreadCountChange(count);
    }
  };

  return (
    <>
      <IconButton
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: 'rgba(13, 138, 188, 0.1)',
          '&:hover': { bgcolor: 'rgba(13, 138, 188, 0.2)' },
        }}
      >
        <Badge badgeContent={localUnreadCount} color="error">
          <ChatIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '70vh',
            maxHeight: 500,
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%' }}>
          <ChatComponent
            projectId={projectId}
            currentUserId={currentUserId}
            projectOwnerId={projectOwnerId}
            projectTitle={projectTitle}
            onClose={() => setOpen(false)}
            onUnreadCount={handleUnreadCount}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatButton;