'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Menu,
  MenuItem,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AlertTitle,  
  Snackbar,
  Tooltip,
  Stack,
  Tab,
  Tabs,
  CardMedia,
  CardActions,
  Zoom,
  Fade,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Skeleton,
  Grow,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Badge,
} from '@mui/material';

// Importações de ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import WarningIcon from '@mui/icons-material/Warning';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axios from "axios";

const API_BASE_URL = 'http://localhost:8080';

const formatName = (name) => {
  if (!name) return 'Usuário';
  try {
    return decodeURIComponent(escape(name));
  } catch {
    return name;
  }
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Componente de Chat Individual
const ChatConversation = ({ projectId, currentUserId, receiverId, receiverName, projectTitle, onBack, onUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId, receiverId]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/project/${projectId}`, {
        params: { userId: currentUserId }
      });
      if (response.data.success) {
        const filteredMessages = response.data.messages.filter(msg => 
          (msg.senderId === currentUserId && msg.receiverId === receiverId) ||
          (msg.senderId === receiverId && msg.receiverId === currentUserId)
        );
        setMessages(filteredMessages);
        markAsRead();
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/chat/read/${projectId}`, {
        userId: currentUserId
      });
      if (onUnreadCount) onUnreadCount(0);
    } catch (error) {
      console.error('Erro:', error);
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
      console.error('Erro:', error);
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

  const messageGroups = groupMessagesByDate();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>{projectTitle}</Typography>
          <Typography variant="caption" color="text.secondary">Conversa com {receiverName}</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'grey.50' }}>
        {Object.entries(messageGroups).length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Nenhuma mensagem ainda. Seja o primeiro a conversar!</Typography>
          </Box>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <Box key={date}>
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="caption" sx={{ bgcolor: 'grey.200', px: 2, py: 0.5, borderRadius: 2 }}>{date}</Typography>
              </Box>
              {msgs.map((msg) => {
                const isOwn = msg.senderId === currentUserId;
                return (
                  <Box key={msg.id} sx={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start', mb: 1.5 }}>
                    <Paper elevation={0} sx={{ maxWidth: '70%', p: 1.5, borderRadius: 2, bgcolor: isOwn ? 'primary.main' : 'white', color: isOwn ? 'white' : 'text.primary' }}>
                      <Typography variant="body2">{msg.message}</Typography>
                      <Typography variant="caption" display="block" textAlign="right" sx={{ mt: 0.5, opacity: 0.7 }}>{formatTime(msg.createdAt)}</Typography>
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

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
          <IconButton color="primary" onClick={handleSendMessage} disabled={!newMessage.trim() || sending}>
            {sending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

// Componente de Lista de Conversas
const ChatList = ({ projectId, currentUserId, projectTitle, investors, unreadCounts, onSelectInvestor, onBack }) => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onBack}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>Conversas - {projectTitle}</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {investors.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Nenhum investidor ainda. Quando alguém investir, aparecerá aqui.</Typography>
          </Box>
        ) : (
          <List>
            {investors.map((investor) => (
              <ListItemButton key={investor.id} onClick={() => onSelectInvestor(investor)} sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Badge badgeContent={unreadCounts[investor.id] || 0} color="error">
                    <Avatar>{investor.Nome?.charAt(0) || 'I'}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={investor.Nome} secondary={investor.Email} />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

// Componente Chat Principal para Empreendedor
const ChatComponent = ({ projectId, currentUserId, projectOwnerId, projectTitle, onClose, onUnreadCount }) => {
  const [investors, setInvestors] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});

  React.useEffect(() => {
    fetchInvestors();
    fetchUnreadCounts();
    const interval = setInterval(fetchUnreadCounts, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  const fetchInvestors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/investimentos/project/${projectId}`);
      if (response.data.success) {
        const uniqueInvestors = [];
        const investorIds = [];
        response.data.investimentos.forEach(inv => {
          if (inv.User && !investorIds.includes(inv.User.id)) {
            investorIds.push(inv.User.id);
            uniqueInvestors.push(inv.User);
          }
        });
        setInvestors(uniqueInvestors);
      }
    } catch (error) {
      console.error('Erro ao buscar investidores:', error);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/unread/${currentUserId}`);
      if (response.data.success) {
        const counts = {};
        response.data.conversations.forEach(conv => {
          if (conv.sender && conv.sender.id) {
            counts[conv.sender.id] = conv.unreadCount;
          } else if (conv.project && conv.project.id) {
            counts[conv.project.id] = conv.unreadCount;
          }
        });
        setUnreadCounts(counts);
        const total = response.data.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
        if (onUnreadCount) onUnreadCount(total);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSelectInvestor = (investor) => {
    setSelectedInvestor(investor);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedInvestor(null);
    fetchUnreadCounts();
  };

  if (showChat && selectedInvestor) {
    return (
      <ChatConversation
        projectId={projectId}
        currentUserId={currentUserId}
        receiverId={selectedInvestor.id}
        receiverName={selectedInvestor.Nome}
        projectTitle={projectTitle}
        onBack={handleBackToList}
        onUnreadCount={(count) => {
          setUnreadCounts(prev => ({ ...prev, [selectedInvestor.id]: 0 }));
          fetchUnreadCounts();
        }}
      />
    );
  }

  return (
    <ChatList
      projectId={projectId}
      currentUserId={currentUserId}
      projectTitle={projectTitle}
      investors={investors}
      unreadCounts={unreadCounts}
      onSelectInvestor={handleSelectInvestor}
      onBack={onClose}
    />
  );
};

const ChatButton = ({ projectId, currentUserId, projectOwnerId, projectTitle, unreadCount = 0, onUnreadCountChange }) => {
  const [open, setOpen] = useState(false);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

  const handleUnreadCount = (count) => {
    setLocalUnreadCount(count);
    if (onUnreadCountChange) onUnreadCountChange(count);
  };

  return (
    <>
      <IconButton color="primary" onClick={() => setOpen(true)} sx={{ bgcolor: alpha('#0D8ABC', 0.1), '&:hover': { bgcolor: alpha('#0D8ABC', 0.2) } }}>
        <Badge badgeContent={localUnreadCount} color="error">
          <ChatIcon fontSize="small" />
        </Badge>
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { height: '70vh', maxHeight: 500, borderRadius: 3, overflow: 'hidden' } }}>
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

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    const userDataStr = localStorage.getItem('userData');
    if (!token || !userDataStr) return null;
    const userData = JSON.parse(userDataStr);
    if (userData.IsAdmin === true || userData.IsAdmin === 1 || userData.IsAdmin === 'true') return null;
    const type = userData.Type_user?.toLowerCase?.() || '';
    if (type !== 'empreendedor' && type !== 'entrepreneur') return null;
    return userData;
  } catch (error) {
    console.error('Erro:', error);
    return null;
  }
};

const checkAuth = () => {
  const userData = getUserFromToken();
  if (!userData) {
    window.location.href = '/auth/login';
    return null;
  }
  return userData;
};

const theme = createTheme({
  palette: {
    primary: { main: '#0D8ABC' },
    secondary: { main: '#FF6B35' },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    background: { default: '#f9fafb', paper: '#ffffff' },
  },
  shape: { borderRadius: 12 },
});

const uploadImageToURL = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', '0f063e64295fd3db3dad07302326e5fd');
  const response = await axios.post('https://api.imgbb.com/1/upload', formData);
  return response.data.data.url;
};

export default function EntrepreneurPage() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [apiStatus, setApiStatus] = useState('idle');
  const [currentTab, setCurrentTab] = useState(0);
  const [projectsView, setProjectsView] = useState('grid');
  const [selectedProject, setSelectedProject] = useState(null);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [createStep, setCreateStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [filters, setFilters] = useState({ status: 'todos', category: 'todos' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatProject, setSelectedChatProject] = useState(null);
  const [projectInvestments, setProjectInvestments] = useState({});
  const [unreadMessagesByProject, setUnreadMessagesByProject] = useState({});
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  const entrepreneur = useMemo(() => {
    if (!userData) return null;
    return {
      id: userData.id,
      name: formatName(userData.Nome || 'Empreendedor'),
      email: userData.Email || '',
      bio: userData.Bio || 'Empreendedor na plataforma KAMBABUSINESS',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.Nome || 'Empreendedor')}&background=0D8ABC&color=fff&size=128&bold=true&format=svg`,
      coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
      status: userData.Status || 'Ativo',
      verified: true,
      memberSince: userData.createdAt ? new Date(userData.createdAt).getFullYear().toString() : '2026',
    };
  }, [userData]);

  const [editProfile, setEditProfile] = useState({ name: '', bio: '' });
  const [newProject, setNewProject] = useState({ name: '', description: '', category: '', targetAmount: '', image: '', pitch: '', expectedRoi: '', duration: '' });

  const fetchUserProjects = useCallback(async (userId) => {
    if (!userId) return;
    setProjectsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/project/project-userId/${userId}`);
      if (response.data && response.data.projects) {
        const formattedProjects = response.data.projects.map(proj => ({
          id: proj.id,
          name: proj.Nome,
          description: proj.Content || proj.Resumo,
          image: proj.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
          category: proj.Categ,
          targetAmount: proj.ValorProjecto,
          raisedAmount: proj.ValorArrecadado || 0,
          status: proj.Status,
          successProbability: proj.ProbalidadeAi || 0,
          roi: proj.ReceitaEstimada || 0,
          ownerId: proj.Iduser
        }));
        setProjects(formattedProjects);
        setFilteredProjects(formattedProjects);
        setApiStatus('success');
      }
    } catch (error) {
      console.error('Erro:', error);
      setApiError(true);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const fetchProjectInvestments = async (projectId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/investimentos/project/${projectId}`);
      if (response.data.success) {
        setProjectInvestments(prev => ({ ...prev, [projectId]: { investimentos: response.data.investimentos, totalInvestido: response.data.totalInvestido } }));
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const fetchUnreadMessages = async () => {
    if (!userData) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat/unread/${userData.id}`);
      if (response.data.success) {
        setTotalUnreadMessages(response.data.totalUnread);
        const counts = {};
        response.data.conversations.forEach(conv => {
          if (conv.project && conv.project.id) {
            counts[conv.project.id] = conv.unreadCount;
          }
        });
        setUnreadMessagesByProject(counts);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleUnreadCountChange = (projectId, count) => {
    setUnreadMessagesByProject(prev => ({ ...prev, [projectId]: count }));
    fetchUnreadMessages();
  };

  useEffect(() => {
    if (!projects.length) return;
    let filtered = [...projects];
    if (filters.status !== 'todos') filtered = filtered.filter(p => p.status === filters.status);
    if (filters.category !== 'todos') filtered = filtered.filter(p => p.category === filters.category);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query));
    }
    setFilteredProjects(filtered);
  }, [projects, filters, searchQuery]);

  useEffect(() => {
    setMounted(true);
    const user = checkAuth();
    if (user) setUserData(user);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userData) {
      fetchUserProjects(userData.id);
      fetchUnreadMessages();
      const interval = setInterval(fetchUnreadMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [userData, fetchUserProjects]);

  useEffect(() => {
    if (entrepreneur) setEditProfile({ name: entrepreneur.name, bio: entrepreneur.bio });
  }, [entrepreneur?.id]);

  useEffect(() => {
    projects.forEach(project => fetchProjectInvestments(project.id));
  }, [projects]);

  const activeProjectsCount = projects.filter(p => p.status === 'Ativo').length;
  const pendingProjectsCount = projects.filter(p => p.status === 'Em análise').length;
  const totalRaised = projects.reduce((sum, p) => sum + (p.raisedAmount || 0), 0);

  const entrepreneurMetrics = entrepreneur ? [
    { title: 'Total de Projetos', value: projects.length.toString(), trend: `${activeProjectsCount} ativos`, icon: StorefrontIcon, color: '#0D8ABC', bgColor: '#e6f3fa' },
    { title: 'Total Arrecadado', value: `Kz ${formatCurrency(totalRaised)}`, trend: 'Em investimentos', icon: AttachMoneyIcon, color: '#10b981', bgColor: '#d1fae5' },
    { title: 'Status da Conta', value: entrepreneur.status, trend: entrepreneur.verified ? 'Verificado' : 'Não verificado', icon: VerifiedIcon, color: entrepreneur.status === 'Ativo' ? '#10b981' : '#ef4444', bgColor: entrepreneur.status === 'Ativo' ? '#d1fae5' : '#fee2e2' },
  ] : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'success';
      case 'Em análise': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ativo': return <CheckCircleIcon fontSize="small" />;
      case 'Em análise': return <PendingIcon fontSize="small" />;
      default: return null;
    }
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setOpenProjectDialog(true);
  };

  const handleOpenChat = (project) => {
    setSelectedChatProject({ ...project, ownerId: project.ownerId || userData.id });
  };

  const handleCreateProject = () => {
    if (entrepreneur?.status !== 'Ativo') {
      setSnackbar({ open: true, message: 'Sua conta precisa estar ativa para criar projetos.', severity: 'warning' });
      return;
    }
    setCreateStep(0);
    setSelectedImage(null);
    setImagePreview(null);
    setNewProject({ name: '', description: '', category: '', targetAmount: '', image: '', pitch: '', expectedRoi: '', duration: '' });
    setOpenCreateDialog(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = async () => {
    if (createStep === 0) {
      if (!selectedImage) {
        setSnackbar({ open: true, message: 'Selecione uma imagem', severity: 'error' });
        return;
      }
      setUploading(true);
      try {
        const imageUrl = await uploadImageToURL(selectedImage);
        setNewProject(prev => ({ ...prev, image: imageUrl }));
        setCreateStep(1);
      } catch (error) {
        setSnackbar({ open: true, message: 'Erro ao fazer upload', severity: 'error' });
      } finally {
        setUploading(false);
      }
    } else {
      setCreateStep(createStep + 1);
    }
  };

  const handlePrevStep = () => setCreateStep(createStep - 1);

  const handleSubmitProject = async () => {
    setSubmitting(true);
    try {
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData'));
      const projectData = {
        Nome: newProject.name,
        Content: newProject.description,
        Categ: newProject.category,
        ValorProjecto: newProject.targetAmount,
        Img: newProject.image,
        Resumo: newProject.pitch,
        ReceitaEstimada: newProject.expectedRoi,
        DuracaoProjecto: Number(newProject.duration),
        Iduser: userDataFromStorage.id,
      };
      await axios.post(`${API_BASE_URL}/project/create`, projectData);
      setSnackbar({ open: true, message: 'Projeto criado com sucesso!', severity: 'success' });
      setOpenCreateDialog(false);
      fetchUserProjects(userDataFromStorage.id);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao criar projeto', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenSettings = () => {
    if (entrepreneur) setEditProfile({ name: entrepreneur.name, bio: entrepreneur.bio });
    setOpenSettingsDialog(true);
  };

  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleApplyFilter = (type, value) => {
    setFilters({ ...filters, [type]: value });
    handleFilterClose();
  };

  const handleRetryConnection = () => {
    if (userData) fetchUserProjects(userData.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/auth/login';
  };

  const updateUserProfile = async () => {
    if (!userData) return;
    setProfileUpdating(true);
    try {
      await axios.put(`${API_BASE_URL}/auth/user-update/${userData.id}`, { Nome: editProfile.name, Bio: editProfile.bio });
      const updatedUserData = { ...userData, Nome: editProfile.name, Bio: editProfile.bio };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setSnackbar({ open: true, message: 'Perfil atualizado!', severity: 'success' });
      setOpenSettingsDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erro ao atualizar perfil', severity: 'error' });
    } finally {
      setProfileUpdating(false);
    }
  };

  if (!mounted) return null;
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }
  if (!userData || !entrepreneur) return null;

  const isUserActive = entrepreneur.status === 'Ativo';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        
        <Drawer variant="permanent" sx={{ width: 280, flexShrink: 0, '& .MuiDrawer-paper': { width: 280, bgcolor: 'background.paper', borderRight: 'none' } }}>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }} variant="rounded"><StorefrontIcon /></Avatar>
            <Box><Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>KAMBABUSINESS</Typography><Typography variant="caption" color="text.secondary">EMPREENDEDOR</Typography></Box>
          </Box>

          <List sx={{ px: 2, flex: 1 }}>
            {[
              { text: 'Dashboard', icon: DashboardIcon, index: 0 },
              { text: 'Meus Projetos', icon: StorefrontIcon, index: 1 },
              { text: 'Criar Projeto', icon: AddIcon, index: 2 },
              { text: 'Configurações', icon: SettingsIcon, index: 3 },
            ].map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton selected={currentTab === item.index} onClick={() => item.index === 2 ? handleCreateProject() : setCurrentTab(item.index)} sx={{ borderRadius: 2, py: 1.5, '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } } }}>
                  <ListItemIcon><item.icon /></ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={entrepreneur.avatar} sx={{ width: 48, height: 48, border: '2px solid', borderColor: 'primary.main' }} />
              <Box sx={{ flex: 1 }}><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{entrepreneur.name}</Typography><Chip size="small" label={entrepreneur.status} color={entrepreneur.status === 'Ativo' ? 'success' : 'warning'} /></Box>
              <Tooltip title="Sair"><IconButton size="small" onClick={handleLogout}><LogoutIcon fontSize="small" /></IconButton></Tooltip>
            </Paper>
          </Box>
        </Drawer>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar>
              <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>Painel do Empreendedor</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField size="small" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>, sx: { borderRadius: 3, bgcolor: 'grey.50', width: 300 } }} />
                <Tooltip title="Atualizar"><IconButton onClick={() => fetchUserProjects(userData.id)}><RefreshIcon /></IconButton></Tooltip>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><Badge badgeContent={totalUnreadMessages} color="error"><AccountCircleIcon /></Badge></IconButton>
              </Stack>
            </Toolbar>
          </AppBar>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => { setCurrentTab(3); setAnchorEl(null); }}><ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon><ListItemText>Configurações</ListItemText></MenuItem>
            <Divider /><MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon><ListItemText>Sair</ListItemText></MenuItem>
          </Menu>

          <Box sx={{ p: 4, overflow: 'auto' }}>
            
            {currentTab === 0 && (
              <Zoom in={true}>
                <Box>
                  <Paper sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', mb: 4 }}>
                    <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${entrepreneur.coverImage})`, backgroundSize: 'cover', filter: 'blur(2px) brightness(0.7)' }} />
                    <Box sx={{ position: 'relative', p: 6, background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar src={entrepreneur.avatar} sx={{ width: 80, height: 80, border: '4px solid white' }} />
                        <Box><Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>Olá, {entrepreneur.name.split(' ')[0]}!</Typography><Stack direction="row" spacing={2} sx={{ mt: 1 }}><Chip size="small" icon={<VerifiedIcon />} label="Verificado" sx={{ bgcolor: alpha(theme.palette.success.main, 0.2), color: 'white' }} variant="outlined" /><Chip size="small" label={`Membro desde ${entrepreneur.memberSince}`} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), color: 'white' }} variant="outlined" /></Stack></Box>
                      </Box>
                      <Typography variant="body1" sx={{ mt: 2, color: 'white', opacity: 0.9 }}>{entrepreneur.bio}</Typography>
                      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                        <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpenSettings} sx={{ bgcolor: 'white', color: 'primary.main' }}>Editar Perfil</Button>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleCreateProject} sx={{ color: 'white', borderColor: 'white' }}>Novo Projeto</Button>
                      </Stack>
                    </Box>
                  </Paper>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {entrepreneurMetrics.map((metric, index) => (
                      <Grid item xs={12} sm={6} lg={4} key={index}>
                        <Card><CardContent><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Box><Typography color="text.secondary" variant="body2">{metric.title}</Typography><Typography variant="h4" sx={{ fontWeight: 700 }}>{metric.value}</Typography><Typography variant="body2" color="success.main">{metric.trend}</Typography></Box><Avatar sx={{ bgcolor: metric.bgColor, color: metric.color, width: 56, height: 56 }}><metric.icon /></Avatar></Box></CardContent></Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="h6" sx={{ mb: 3 }}>Projetos Recentes</Typography>
                  {projectsLoading ? <Skeleton height={300} /> : projects.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center' }}><StorefrontIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} /><Typography variant="h5">Nenhum projeto criado</Typography><Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateProject} sx={{ mt: 2 }}>Criar Primeiro Projeto</Button></Paper>
                  ) : (
                    <Grid container spacing={3}>
                      {projects.slice(0, 2).map((project) => {
                        const investments = projectInvestments[project.id];
                        const totalInvested = investments?.totalInvestido || 0;
                        const progress = (totalInvested / project.targetAmount) * 100;
                        return (
                          <Grid item xs={12} md={6} key={project.id}>
                            <Card><CardMedia component="img" height="220" image={project.image} /><CardContent><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography variant="h6">{project.name}</Typography><Chip size="small" icon={getStatusIcon(project.status)} label={project.status} color={getStatusColor(project.status)} /></Box><Typography variant="body2" color="text.secondary">{project.description?.substring(0, 120)}...</Typography><Box sx={{ mt: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="caption">Arrecadado</Typography><Typography variant="caption" fontWeight={600}>Kz {formatCurrency(totalInvested)} / Kz {formatCurrency(project.targetAmount)}</Typography></Box><LinearProgress variant="determinate" value={Math.min(progress, 100)} sx={{ height: 6, borderRadius: 3 }} /></Box></CardContent><CardActions sx={{ p: 3, pt: 0, display: 'flex', gap: 1 }}><Button variant="outlined" fullWidth startIcon={<VisibilityIcon />} onClick={() => handleViewProject(project)}>Ver Detalhes</Button><ChatButton projectId={project.id} currentUserId={userData.id} projectOwnerId={project.ownerId} projectTitle={project.name} unreadCount={unreadMessagesByProject[project.id] || 0} onUnreadCountChange={(count) => handleUnreadCountChange(project.id, count)} /></CardActions></Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Box>
              </Zoom>
            )}

            {currentTab === 1 && (
              <Fade in={true}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Meus Projetos</Typography>
                    <Stack direction="row" spacing={2}>
                      <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleFilterClick}>Filtrar</Button>
                      <Button variant="outlined" startIcon={projectsView === 'grid' ? <ViewListIcon /> : <ViewModuleIcon />} onClick={() => setProjectsView(projectsView === 'grid' ? 'list' : 'grid')}>{projectsView === 'grid' ? 'Lista' : 'Grade'}</Button>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateProject}>Novo</Button>
                    </Stack>
                  </Box>

                  <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}><MenuItem disabled>Categoria</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'todos')}>Todos</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Agrotech')}>Agrotech</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Healthtech')}>Healthtech</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Energia')}>Energia</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Edtech')}>Edtech</MenuItem></Menu>

                  {projectsLoading ? <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} /> : filteredProjects.length === 0 ? <Paper sx={{ p: 6, textAlign: 'center' }}><StorefrontIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} /><Typography variant="h5">Nenhum projeto</Typography><Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateProject}>Criar</Button></Paper> : projectsView === 'grid' ? (
                    <Grid container spacing={3}>
                      {filteredProjects.map((project) => {
                        const investments = projectInvestments[project.id];
                        const totalInvested = investments?.totalInvestido || 0;
                        const investors = investments?.investimentos?.length || 0;
                        const progress = (totalInvested / project.targetAmount) * 100;
                        return (
                          <Grid item xs={12} md={6} key={project.id}>
                            <Card><CardMedia component="img" height="200" image={project.image} /><CardContent><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h6">{project.name}</Typography><Chip size="small" icon={getStatusIcon(project.status)} label={project.status} color={getStatusColor(project.status)} /></Box><Box sx={{ mt: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}><Typography variant="caption">Arrecadado</Typography><Typography variant="caption" fontWeight={600}>Kz {formatCurrency(totalInvested)} / Kz {formatCurrency(project.targetAmount)}</Typography></Box><LinearProgress variant="determinate" value={Math.min(progress, 100)} sx={{ height: 6, borderRadius: 3, my: 1 }} /></Box><Grid container spacing={2} sx={{ mt: 1 }}><Grid item xs={6}><Typography variant="caption">Meta</Typography><Typography variant="subtitle2">Kz {formatCurrency(project.targetAmount)}</Typography></Grid><Grid item xs={6}><Typography variant="caption">Investidores</Typography><Typography variant="subtitle2">{investors}</Typography></Grid><Grid item xs={6}><Typography variant="caption">Probabilidade IA</Typography><Typography variant="subtitle2" color="primary">{project.successProbability}%</Typography></Grid><Grid item xs={6}><Typography variant="caption">ROI</Typography><Typography variant="subtitle2" color="success.main">{project.roi}%</Typography></Grid></Grid></CardContent><CardActions sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}><Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleViewProject(project)}>Ver Detalhes</Button><ChatButton projectId={project.id} currentUserId={userData.id} projectOwnerId={project.ownerId} projectTitle={project.name} unreadCount={unreadMessagesByProject[project.id] || 0} onUnreadCountChange={(count) => handleUnreadCountChange(project.id, count)} /></CardActions></Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table><TableHead><TableRow><TableCell>Projeto</TableCell><TableCell>Categoria</TableCell><TableCell>Status</TableCell><TableCell align="right">Meta</TableCell><TableCell align="right">Arrecadado</TableCell><TableCell align="right">Investidores</TableCell><TableCell align="right">Ações</TableCell></TableRow></TableHead>
                      <TableBody>{filteredProjects.map((project) => {
                        const investments = projectInvestments[project.id];
                        const totalInvested = investments?.totalInvestido || 0;
                        const investors = investments?.investimentos?.length || 0;
                        return (
                          <TableRow key={project.id}><TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar src={project.image} variant="rounded" sx={{ width: 40, height: 40 }} /><Typography variant="subtitle2">{project.name}</Typography></Box></TableCell><TableCell>{project.category}</TableCell><TableCell><Chip size="small" icon={getStatusIcon(project.status)} label={project.status} color={getStatusColor(project.status)} /></TableCell><TableCell align="right">Kz {formatCurrency(project.targetAmount)}</TableCell><TableCell align="right">Kz {formatCurrency(totalInvested)}</TableCell><TableCell align="right">{investors}</TableCell><TableCell align="right"><IconButton size="small" onClick={() => handleViewProject(project)}><VisibilityIcon fontSize="small" /></IconButton><ChatButton projectId={project.id} currentUserId={userData.id} projectOwnerId={project.ownerId} projectTitle={project.name} unreadCount={unreadMessagesByProject[project.id] || 0} onUnreadCountChange={(count) => handleUnreadCountChange(project.id, count)} /></TableCell></TableRow>
                        );
                      })}</TableBody></Table>
                    </TableContainer>
                  )}
                </Box>
              </Fade>
            )}

            {currentTab === 3 && (
              <Fade in={true}>
                <Box><Typography variant="h6" sx={{ mb: 3 }}>Configurações</Typography>
                  <Grid container spacing={3}><Grid item xs={12} md={4}><Card><CardContent sx={{ textAlign: 'center' }}><Avatar src={entrepreneur.avatar} sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '3px solid', borderColor: 'primary.main' }} /><Typography variant="h6">{entrepreneur.name}</Typography><Typography variant="body2" color="text.secondary">{entrepreneur.email}</Typography><Chip label={entrepreneur.status} color={entrepreneur.status === 'Ativo' ? 'success' : 'warning'} sx={{ mt: 1 }} /></CardContent></Card></Grid>
                  <Grid item xs={12} md={8}><Card><CardContent><Typography variant="subtitle1" sx={{ mb: 3 }}>Informações Pessoais</Typography><Grid container spacing={3}><Grid item xs={12}><TextField fullWidth label="Nome" value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} /></Grid><Grid item xs={12}><TextField fullWidth label="Biografia" value={editProfile.bio} onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} multiline rows={4} /></Grid></Grid><Box sx={{ mt: 3, textAlign: 'right' }}><Button variant="contained" onClick={updateUserProfile} disabled={profileUpdating}>{profileUpdating ? <CircularProgress size={24} /> : 'Salvar'}</Button></Box></CardContent></Card></Grid></Grid></Box>
              </Fade>
            )}
          </Box>
        </Box>

        <Dialog open={openProjectDialog} onClose={() => setOpenProjectDialog(false)} maxWidth="md" fullWidth>
          {selectedProject && (<><DialogTitle>Detalhes do Projeto</DialogTitle><DialogContent><Box component="img" src={selectedProject.image} sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 2, mb: 2 }} /><Typography variant="h5">{selectedProject.name}</Typography><Typography variant="body2" color="text.secondary" gutterBottom>Categoria: {selectedProject.category}</Typography><Typography variant="body1" paragraph>{selectedProject.description}</Typography><Grid container spacing={3}><Grid item xs={6}><Typography variant="caption">Meta</Typography><Typography variant="subtitle2">Kz {formatCurrency(selectedProject.targetAmount)}</Typography></Grid><Grid item xs={6}><Typography variant="caption">Arrecadado</Typography><Typography variant="subtitle2" color="success.main">Kz {formatCurrency(selectedProject.raisedAmount)}</Typography></Grid><Grid item xs={6}><Typography variant="caption">Probabilidade IA</Typography><Typography variant="subtitle2" color="primary">{selectedProject.successProbability}%</Typography></Grid><Grid item xs={6}><Typography variant="caption">ROI</Typography><Typography variant="subtitle2" color="success.main">{selectedProject.roi}%</Typography></Grid></Grid>{projectInvestments[selectedProject.id]?.investimentos?.length > 0 && (<Box sx={{ mt: 3 }}><Typography variant="subtitle2" sx={{ mb: 2 }}>Investidores</Typography><Stack spacing={1}>{projectInvestments[selectedProject.id].investimentos.map((inv, idx) => (<Paper key={idx} variant="outlined" sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar>{inv.investor?.Nome?.charAt(0) || 'I'}</Avatar><Box><Typography variant="body2" fontWeight={600}>{inv.investor?.Nome || 'Investidor'}</Typography><Typography variant="caption" color="text.secondary">Investiu em: {new Date(inv.createdAt).toLocaleDateString('pt-AO')}</Typography></Box></Box><Typography variant="subtitle2" fontWeight={600}>Kz {formatCurrency(inv.amount)}</Typography></Paper>))}</Stack></Box>)}<Button fullWidth variant="contained" startIcon={<ChatIcon />} onClick={() => { setOpenProjectDialog(false); handleOpenChat(selectedProject); }} sx={{ mt: 3 }}>Conversar com Investidores</Button></DialogContent><DialogActions><Button onClick={() => setOpenProjectDialog(false)}>Fechar</Button></DialogActions></>)}
        </Dialog>

        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Criar Projeto</DialogTitle>
          <DialogContent><Stepper activeStep={createStep} orientation="vertical"><Step><StepLabel>Informações Básicas</StepLabel><StepContent><Grid container spacing={2}><Grid item xs={12}><TextField fullWidth label="Nome" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} required /></Grid><Grid item xs={12}><TextField fullWidth label="Descrição" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} multiline rows={4} required /></Grid><Grid item xs={6}><FormControl fullWidth><InputLabel>Categoria</InputLabel><Select value={newProject.category} onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}><MenuItem value="Agrotech">Agrotech</MenuItem><MenuItem value="Healthtech">Healthtech</MenuItem><MenuItem value="Energia">Energia</MenuItem><MenuItem value="Edtech">Edtech</MenuItem><MenuItem value="Outro">Outro</MenuItem></Select></FormControl></Grid><Grid item xs={6}><Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} fullWidth sx={{ height: 56 }} disabled={uploading}>{uploading ? 'Enviando...' : (selectedImage ? selectedImage.name : 'Upload')}<input type="file" hidden accept="image/*" onChange={handleImageChange} disabled={uploading} /></Button>{imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 100, marginTop: 8, borderRadius: 4 }} />}</Grid></Grid><Box sx={{ mt: 2 }}><Button variant="contained" onClick={handleNextStep} disabled={!newProject.name || !newProject.description || !newProject.category || !selectedImage || uploading}>Continuar</Button></Box></StepContent></Step><Step><StepLabel>Detalhes Financeiros</StepLabel><StepContent><Grid container spacing={2}><Grid item xs={6}><TextField fullWidth label="Meta (Kz)" type="number" value={newProject.targetAmount} onChange={(e) => setNewProject({ ...newProject, targetAmount: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">Kz</InputAdornment> }} required /></Grid><Grid item xs={6}><TextField fullWidth label="ROI (%)" type="number" value={newProject.expectedRoi} onChange={(e) => setNewProject({ ...newProject, expectedRoi: e.target.value })} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} required /></Grid><Grid item xs={6}><TextField fullWidth label="Duração (dias)" type="number" value={newProject.duration} onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })} required /></Grid><Grid item xs={12}><TextField fullWidth label="Pitch" value={newProject.pitch} onChange={(e) => setNewProject({ ...newProject, pitch: e.target.value })} multiline rows={2} /></Grid></Grid><Box sx={{ mt: 2 }}><Button variant="outlined" onClick={handlePrevStep} sx={{ mr: 1 }}>Voltar</Button><Button variant="contained" onClick={handleSubmitProject} disabled={!newProject.targetAmount || !newProject.expectedRoi || !newProject.duration || submitting}>{submitting ? <CircularProgress size={24} /> : 'Enviar'}</Button></Box></StepContent></Step></Stepper></DialogContent>
        </Dialog>

        <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogContent><Grid container spacing={3}><Grid item xs={12} sx={{ textAlign: 'center' }}><Avatar src={entrepreneur.avatar} sx={{ width: 100, height: 100, mx: 'auto', border: '2px solid', borderColor: 'primary.main' }} /></Grid><Grid item xs={12}><TextField fullWidth label="Nome" value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} /></Grid><Grid item xs={12}><TextField fullWidth label="Biografia" value={editProfile.bio} onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} multiline rows={3} /></Grid></Grid></DialogContent>
          <DialogActions><Button onClick={() => setOpenSettingsDialog(false)}>Cancelar</Button><Button variant="contained" onClick={updateUserProfile} disabled={profileUpdating}>{profileUpdating ? <CircularProgress size={24} /> : 'Salvar'}</Button></DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}><Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert></Snackbar>

        <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32 }} onClick={handleCreateProject}><AddIcon /></Fab>

        {selectedChatProject && (
          <ChatButton
            projectId={selectedChatProject.id}
            currentUserId={userData.id}
            projectOwnerId={selectedChatProject.ownerId}
            projectTitle={selectedChatProject.name}
            unreadCount={unreadMessagesByProject[selectedChatProject.id] || 0}
            onUnreadCountChange={(count) => handleUnreadCountChange(selectedChatProject.id, count)}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}