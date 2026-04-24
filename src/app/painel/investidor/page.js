'use client';

import React, { useState, useEffect } from 'react';
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
  IconButton,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
  CircularProgress,
  Fade,
  Zoom,
  alpha,
  Badge,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import GroupsIcon2 from '@mui/icons-material/Groups';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

import axios from "axios";

const API_BASE_URL = 'http://localhost:8080';

const formatName = (name) => {
  if (!name) return 'Investidor';
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

const ChatComponent = ({ projectId, currentUserId, projectOwnerId, projectTitle, onClose, onUnreadCount }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = React.useRef(null);

  if (!projectId || !currentUserId || !projectOwnerId) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">Erro: Dados do chat incompletos</Alert>
        <Button sx={{ mt: 2 }} onClick={onClose}>Fechar</Button>
      </Box>
    );
  }

  const isInvestor = currentUserId !== projectOwnerId;
  const receiverId = isInvestor ? projectOwnerId : currentUserId;

  React.useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

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
        setError(null);
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao carregar mensagens');
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
      setError('Erro ao enviar mensagem');
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
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
        <Button sx={{ mt: 2 }} onClick={fetchMessages}>Tentar novamente</Button>
        <Button sx={{ mt: 2, ml: 1 }} onClick={onClose}>Fechar</Button>
      </Box>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>{projectTitle}</Typography>
          <Chip size="small" label={isInvestor ? 'Conversa com Empreendedor' : 'Conversa com Investidor'} color="primary" variant="outlined" sx={{ mt: 0.5 }} />
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
    if (type !== 'investidor' && type !== 'investor') return null;
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

export default function InvestorProfile() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [investmentsLoading, setInvestmentsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  const [openInvestDialog, setOpenInvestDialog] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedChatProject, setSelectedChatProject] = useState(null);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [investorStats, setInvestorStats] = useState({ totalInvestido: 0, totalProjetos: 0, projetosAtivos: 0 });
  const [filters, setFilters] = useState({ category: 'todos' });
  const [editProfile, setEditProfile] = useState({ name: '', bio: '' });
  const [unreadMessagesByProject, setUnreadMessagesByProject] = useState({});
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  const investor = userData ? {
    id: userData.id,
    name: formatName(userData.Nome || 'Investidor'),
    email: userData.Email || '',
    bio: userData.Bio || 'Investidor na plataforma KAMBABUSINESS',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.Nome || 'Investidor')}&background=0D8ABC&color=fff&size=128&bold=true&format=svg`,
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
    status: userData.Status || 'Ativo',
    memberSince: userData.createdAt ? new Date(userData.createdAt).getFullYear().toString() : '2026',
  } : null;

  useEffect(() => {
    if (investor) setEditProfile({ name: investor.name, bio: investor.bio });
  }, [investor?.id]);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/project/projectos-all`, { timeout: 10000 });
      
      let projetosData = [];
      if (response.data && response.data.projects) {
        projetosData = response.data.projects;
      } else if (response.data && response.data.projets) {
        projetosData = response.data.projets;
      } else if (Array.isArray(response.data)) {
        projetosData = response.data;
      }
      
      const activeProjects = projetosData.filter(p => p.Status === 'Ativo');
      setProjects(activeProjects);
      setFilteredProjects(activeProjects);
    } catch (error) {
      console.error('Erro:', error);
      setSnackbar({ open: true, message: 'Erro ao carregar projetos', severity: 'error' });
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchInvestments = async () => {
    if (!userData) return;
    setInvestmentsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/investimentos/investor/${userData.id}`);
      if (response.data.success) {
        setInvestments(response.data.investimentos);
        const totalInvestido = response.data.investimentos.reduce((sum, inv) => sum + inv.amount, 0);
        const totalProjetos = response.data.investimentos.length;
        const projetosAtivos = response.data.investimentos.filter(inv => inv.project?.Status === 'Ativo').length;
        setInvestorStats({ totalInvestido, totalProjetos, projetosAtivos });
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setInvestmentsLoading(false);
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

  const updateUserProfile = async () => {
    if (!userData) return;
    setProfileUpdating(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/user-update/${userData.id}`, { Nome: editProfile.name, Bio: editProfile.bio });
      if (response.data.success) {
        const updatedUserData = { ...userData, Nome: editProfile.name, Bio: editProfile.bio };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setSnackbar({ open: true, message: 'Perfil atualizado!', severity: 'success' });
        setOpenSettingsDialog(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      setSnackbar({ open: true, message: 'Erro ao atualizar perfil', severity: 'error' });
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleInvest = async () => {
    const amount = Number(investAmount);
    if (amount <= 0) {
      setSnackbar({ open: true, message: 'Valor inválido', severity: 'error' });
      return;
    }
    setInvesting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/investimentos/create`, {
        projectId: selectedProject.id,
        investorId: userData.id,
        amount: amount,
        paymentMethod: 'Transferência Bancária'
      });
      if (response.data.success) {
        setSnackbar({ open: true, message: response.data.message, severity: 'success' });
        setOpenInvestDialog(false);
        setInvestAmount('');
        await fetchInvestments();
        await fetchProjects();
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Erro ao realizar investimento', severity: 'error' });
    } finally {
      setInvesting(false);
    }
  };

  const handleOpenInvestDialog = (project) => {
    const valorArrecadado = project.ValorArrecadado || 0;
    const valorMeta = project.ValorProjecto || 0;
    
    if (valorArrecadado >= valorMeta) {
      setSnackbar({ 
        open: true, 
        message: 'Este projeto já atingiu a meta de arrecadação e não aceita mais investimentos.', 
        severity: 'warning' 
      });
      return;
    }
    
    setSelectedProject(project);
    setInvestAmount('10000');
    setOpenInvestDialog(true);
  };

  const handleViewProjectDetail = (project) => {
    if (!project) return;
    setSelectedProjectDetail(project);
    setOpenProjectDialog(true);
  };

  const handleOpenChat = (project) => {
    if (!project) return;
    setSelectedChatProject({
      id: project.id,
      Nome: project.Nome,
      Iduser: project.Iduser || project.iduser
    });
  };

  const handleOpenSettings = () => {
    if (investor) setEditProfile({ name: investor.name, bio: investor.bio });
    setOpenSettingsDialog(true);
  };

  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleApplyFilter = (type, value) => {
    setFilters({ ...filters, [type]: value });
    handleFilterClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/auth/login';
  };

  useEffect(() => {
    setMounted(true);
    const user = checkAuth();
    if (user) setUserData(user);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userData) {
      fetchProjects();
      fetchInvestments();
      fetchUnreadMessages();
      const interval = setInterval(fetchUnreadMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [userData]);

  useEffect(() => {
    if (!projects.length) return;
    let filtered = [...projects];
    if (filters.category !== 'todos') filtered = filtered.filter(p => p.Categ === filters.category);
    setFilteredProjects(filtered);
  }, [filters, projects]);

  const getRiskColor = (probability) => {
    const prob = parseFloat(probability);
    if (prob >= 70) return 'success';
    if (prob >= 40) return 'warning';
    return 'error';
  };

  const getRiskLabel = (probability) => {
    const prob = parseFloat(probability);
    if (prob >= 70) return 'Baixo Risco';
    if (prob >= 40) return 'Médio Risco';
    return 'Alto Risco';
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
  if (!userData || !investor) return null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        
        <Drawer variant="permanent" sx={{ width: 280, flexShrink: 0, '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box', bgcolor: 'background.paper', borderRight: '1px solid', borderColor: 'divider' } }}>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }} variant="rounded"><AccountBalanceWalletIcon /></Avatar>
            <Box><Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>KAMBABUSINESS</Typography><Typography variant="caption" color="text.secondary">INVESTIDOR</Typography></Box>
          </Box>

          <List sx={{ px: 2, flex: 1 }}>
            {[
              { text: 'Dashboard', icon: DashboardIcon, index: 0 },
              { text: 'Projetos', icon: StorefrontIcon, index: 1 },
              { text: 'Meus Investimentos', icon: ReceiptIcon, index: 2 },
            ].map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton selected={currentTab === item.index} onClick={() => setCurrentTab(item.index)} sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: alpha('#0D8ABC', 0.1), '& .MuiListItemIcon-root': { color: 'primary.main' } } }}>
                  <ListItemIcon><item.icon /></ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={investor.avatar} sx={{ width: 48, height: 48 }} />
              <Box sx={{ flex: 1 }}><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{investor.name}</Typography><Chip size="small" label={investor.status} color={investor.status === 'Ativo' ? 'success' : 'warning'} /></Box>
              <Tooltip title="Sair"><IconButton size="small" onClick={handleLogout}><LogoutIcon fontSize="small" /></IconButton></Tooltip>
            </Paper>
          </Box>
        </Drawer>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar>
              <Typography variant="h5" sx={{ flex: 1, fontWeight: 700 }}>Painel do Investidor</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Tooltip title="Atualizar"><IconButton onClick={() => { fetchProjects(); fetchInvestments(); fetchUnreadMessages(); }}><RefreshIcon /></IconButton></Tooltip>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><Badge badgeContent={totalUnreadMessages} color="error"><AccountCircleIcon /></Badge></IconButton>
              </Stack>
            </Toolbar>
          </AppBar>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleOpenSettings}><ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon><ListItemText>Configurações</ListItemText></MenuItem>
            <Divider /><MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon><ListItemText>Sair</ListItemText></MenuItem>
          </Menu>

          <Box sx={{ p: 4, overflow: 'auto' }}>
            
            {currentTab === 0 && (
              <Zoom in={true}>
                <Box>
                  <Paper sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar src={investor.avatar} sx={{ width: 80, height: 80, border: '3px solid white' }} />
                      <Box><Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Olá, {investor.name.split(' ')[0]}</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Chip size="small" icon={<VerifiedIcon />} label="Verificado" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} /><Chip size="small" label={`Membro desde ${investor.memberSince}`} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} /></Box></Box>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 3, opacity: 0.9 }}>{investor.bio}</Typography>
                    <Button variant="contained" startIcon={<EditIcon />} onClick={handleOpenSettings} sx={{ mt: 3, bgcolor: 'white', color: 'primary.main' }}>Editar Perfil</Button>
                  </Paper>

                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}><Card><CardContent><Typography color="text.secondary">Total Investido</Typography><Typography variant="h4">Kz {formatCurrency(investorStats.totalInvestido)}</Typography></CardContent></Card></Grid>
                    <Grid item xs={12} md={4}><Card><CardContent><Typography color="text.secondary">Projetos Investidos</Typography><Typography variant="h4">{investorStats.totalProjetos}</Typography></CardContent></Card></Grid>
                    <Grid item xs={12} md={4}><Card><CardContent><Typography color="text.secondary">Projetos Ativos</Typography><Typography variant="h4">{investorStats.projetosAtivos}</Typography></CardContent></Card></Grid>
                  </Grid>

                  <Typography variant="h6" sx={{ mb: 3 }}>Últimos Investimentos</Typography>
                  {investmentsLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box> : investments.length === 0 ? <Paper sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">Você ainda não fez nenhum investimento</Typography><Button variant="contained" onClick={() => setCurrentTab(1)} sx={{ mt: 2 }}>Explorar Projetos</Button></Paper> : (
                    <TableContainer component={Paper}>
                      <Table><TableHead><TableRow><TableCell>Projeto</TableCell><TableCell align="right">Valor</TableCell><TableCell align="right">Data</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                      <TableBody>{investments.slice(0, 5).map((inv) => (<TableRow key={inv.id} hover><TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Avatar src={inv.project?.Img} variant="rounded" sx={{ width: 40, height: 40 }} /><Typography variant="subtitle2">{inv.project?.Nome}</Typography></Box></TableCell><TableCell align="right">Kz {formatCurrency(inv.amount)}</TableCell><TableCell align="right">{new Date(inv.createdAt).toLocaleDateString('pt-AO')}</TableCell><TableCell><Chip size="small" label={inv.status} color="success" /></TableCell></TableRow>))}</TableBody></Table>
                    </TableContainer>
                  )}
                </Box>
              </Zoom>
            )}

            {currentTab === 1 && (
              <Fade in={true}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Projetos Disponíveis</Typography>
                    <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleFilterClick}>Filtrar</Button>
                  </Box>
                  <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}><MenuItem disabled>Categoria</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'todos')}>Todos</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Agrotech')}>Agrotech</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Healthtech')}>Healthtech</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Energia')}>Energia</MenuItem><MenuItem onClick={() => handleApplyFilter('category', 'Edtech')}>Edtech</MenuItem></Menu>

                  {projectsLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box> : filteredProjects.length === 0 ? <Paper sx={{ p: 6, textAlign: 'center' }}><StorefrontIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} /><Typography variant="h5">Nenhum projeto disponível</Typography></Paper> : (
                    <Grid container spacing={3}>
                      {filteredProjects.map((project) => {
                        const probability = parseFloat(project.ProbalidadeAi) || 0;
                        const roi = project.ReceitaEstimada || 0;
                        const valorArrecadado = project.ValorArrecadado || 0;
                        const valorMeta = project.ValorProjecto || 1;
                        const progress = (valorArrecadado / valorMeta) * 100;
                        const metaAtingida = valorArrecadado >= valorMeta;
                        const unreadCount = unreadMessagesByProject[project.id] || 0;
                        
                        return (
                          <Grid item xs={12} key={project.id}>
                            <Card sx={{ opacity: metaAtingida ? 0.9 : 1 }}>
                              <Grid container>
                                <Grid item xs={12} md={4}>
                                  <Box sx={{ position: 'relative', height: '100%' }}>
                                    <CardMedia component="img" image={project.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} sx={{ height: '100%', minHeight: 240, objectFit: 'cover', filter: metaAtingida ? 'grayscale(0.3)' : 'none' }} />
                                    {metaAtingida && (
                                      <Chip label="META ATINGIDA" color="success" sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 700, bgcolor: 'success.main', color: 'white' }} />
                                    )}
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                  <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                                      <Typography variant="h6">{project.Nome}</Typography>
                                      <Stack direction="row" spacing={1}>
                                        {metaAtingida && <Chip size="small" icon={<CheckCircleIcon />} label="Meta Atingida" color="success" />}
                                        <Chip size="small" label={getRiskLabel(probability)} color={getRiskColor(probability)} />
                                      </Stack>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>{project.Resumo || project.Content?.substring(0, 120)}</Typography>
                                    
                                    {(project.Problematica || project.PublicoAlvo || project.Publico || project.Solucao) && (
                                      <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'grey.50' }}>
                                        <Grid container spacing={1}>
                                          {project.Problematica && (
                                            <Grid item xs={12}>
                                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                <ErrorOutlineIcon color="error" sx={{ fontSize: 16, mt: 0.2 }} />
                                                <Typography variant="caption">{project.Problematica.substring(0, 80)}...</Typography>
                                              </Box>
                                            </Grid>
                                          )}
                                          {(project.PublicoAlvo || project.Publico) && (
                                            <Grid item xs={12} sm={6}>
                                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                <GroupsIcon2 color="primary" sx={{ fontSize: 16, mt: 0.2 }} />
                                                <Typography variant="caption">{(project.PublicoAlvo || project.Publico).substring(0, 60)}...</Typography>
                                              </Box>
                                            </Grid>
                                          )}
                                          {project.Solucao && (
                                            <Grid item xs={12} sm={6}>
                                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                <LightbulbIcon sx={{ color: '#f59e0b', fontSize: 16, mt: 0.2 }} />
                                                <Typography variant="caption">{project.Solucao.substring(0, 60)}...</Typography>
                                              </Box>
                                            </Grid>
                                          )}
                                        </Grid>
                                      </Paper>
                                    )}
                                    
                                    <Box sx={{ mb: 2 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption">Arrecadado: Kz {formatCurrency(valorArrecadado)} / Kz {formatCurrency(valorMeta)}</Typography>
                                        <Typography variant="caption" fontWeight={600} color={metaAtingida ? 'success.main' : 'text.secondary'}>
                                          {progress.toFixed(1)}%
                                        </Typography>
                                      </Box>
                                      <LinearProgress variant="determinate" value={Math.min(progress, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { bgcolor: metaAtingida ? 'success.main' : 'primary.main' } }} />
                                    </Box>
                                    
                                    <Box sx={{ mb: 2 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="caption">Probabilidade de Sucesso (IA)</Typography>
                                        <Typography variant="caption" fontWeight={600}>{probability}%</Typography>
                                      </Box>
                                      <LinearProgress variant="determinate" value={probability} sx={{ height: 6, borderRadius: 3 }} />
                                    </Box>
                                    
                                    <Grid container spacing={2}>
                                      <Grid item xs={6} sm={3}><Typography variant="caption">Meta</Typography><Typography variant="subtitle2">Kz {formatCurrency(valorMeta)}</Typography></Grid>
                                      <Grid item xs={6} sm={3}><Typography variant="caption">ROI</Typography><Typography variant="subtitle2" color="success.main">{roi}%</Typography></Grid>
                                      <Grid item xs={6} sm={3}><Typography variant="caption">Arrecadado</Typography><Typography variant="subtitle2" color={metaAtingida ? 'success.main' : 'text.primary'}>{progress.toFixed(0)}%</Typography></Grid>
                                      <Grid item xs={6} sm={3}><Typography variant="caption">Categoria</Typography><Typography variant="subtitle2">{project.Categ}</Typography></Grid>
                                    </Grid>
                                    
                                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                                      <Button variant="outlined" startIcon={<VisibilityIcon />} onClick={() => handleViewProjectDetail(project)}>Ver Detalhes</Button>
                                      
                                      {metaAtingida ? (
                                        <Tooltip title="Este projeto já atingiu a meta de arrecadação e não aceita mais investimentos">
                                          <span style={{ flex: 1 }}>
                                            <Button variant="contained" fullWidth disabled startIcon={<CheckCircleIcon />} sx={{ bgcolor: 'success.main', '&.Mui-disabled': { bgcolor: 'success.light', color: 'white' } }}>
                                              Meta Atingida
                                            </Button>
                                          </span>
                                        </Tooltip>
                                      ) : (
                                        <Button variant="contained" startIcon={<AttachMoneyIcon />} onClick={() => handleOpenInvestDialog(project)}>Investir</Button>
                                      )}
                                      
                                      <ChatButton projectId={project.id} currentUserId={userData.id} projectOwnerId={project.Iduser || project.iduser} projectTitle={project.Nome} unreadCount={unreadCount} onUnreadCountChange={(count) => handleUnreadCountChange(project.id, count)} />
                                    </Box>
                                  </CardContent>
                                </Grid>
                              </Grid>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Box>
              </Fade>
            )}

            {currentTab === 2 && (
              <Fade in={true}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>Meus Investimentos</Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}><Card><CardContent><Typography color="text.secondary">Total Investido</Typography><Typography variant="h4">Kz {formatCurrency(investorStats.totalInvestido)}</Typography></CardContent></Card></Grid>
                    <Grid item xs={12} md={4}><Card><CardContent><Typography color="text.secondary">Projetos Investidos</Typography><Typography variant="h4">{investorStats.totalProjetos}</Typography></CardContent></Card></Grid>
                    <Grid item xs={12} md={4}><Card><CardContent><Typography color="text.secondary">Projetos Ativos</Typography><Typography variant="h4">{investorStats.projetosAtivos}</Typography></CardContent></Card></Grid>
                  </Grid>
                  {investmentsLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box> : investments.length === 0 ? <Paper sx={{ p: 6, textAlign: 'center' }}><ReceiptIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} /><Typography variant="h5">Nenhum investimento realizado</Typography><Button variant="contained" onClick={() => setCurrentTab(1)} sx={{ mt: 2 }}>Explorar Projetos</Button></Paper> : (
                    <Grid container spacing={3}>
                      {investments.map((inv) => (
                        <Grid item xs={12} md={6} key={inv.id}>
                          <Card>
                            <CardMedia component="img" height="180" image={inv.project?.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} />
                            <CardContent>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{inv.project?.Nome}</Typography>
                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Valor Investido</Typography><Typography variant="subtitle1" fontWeight={600} color="success.main">Kz {formatCurrency(inv.amount)}</Typography></Grid>
                                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Data</Typography><Typography variant="body2">{new Date(inv.createdAt).toLocaleDateString('pt-AO')}</Typography></Grid>
                                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip size="small" label={inv.status} color="success" sx={{ mt: 0.5 }} /></Grid>
                                <Grid item xs={6}><Typography variant="caption" color="text.secondary">ROI</Typography><Typography variant="body2" color="success.main" fontWeight={600}>{inv.project?.ReceitaEstimada || 0}%</Typography></Grid>
                              </Grid>
                              {inv.project?.ValorArrecadado && inv.project?.ValorProjecto && (<Box sx={{ mt: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}><Typography variant="caption" color="text.secondary">Progresso do Projeto</Typography><Typography variant="caption" fontWeight={600}>{((inv.project.ValorArrecadado / inv.project.ValorProjecto) * 100).toFixed(0)}%</Typography></Box><LinearProgress variant="determinate" value={(inv.project.ValorArrecadado / inv.project.ValorProjecto) * 100} sx={{ height: 6, borderRadius: 3 }} /></Box>)}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Fade>
            )}
          </Box>
        </Box>

        <Dialog open={openProjectDialog} onClose={() => setOpenProjectDialog(false)} maxWidth="md" fullWidth>
          {selectedProjectDetail && (
            <>
              <DialogTitle><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h6">Detalhes do Projeto</Typography><IconButton onClick={() => setOpenProjectDialog(false)}><CloseIcon /></IconButton></Box></DialogTitle>
              <DialogContent dividers>
                <Box sx={{ position: 'relative' }}>
                  <Box component="img" src={selectedProjectDetail.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 2, mb: 2 }} />
                  {(selectedProjectDetail.ValorArrecadado >= selectedProjectDetail.ValorProjecto) && (
                    <Chip label="META ATINGIDA" color="success" sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 700 }} />
                  )}
                </Box>
                <Typography variant="h5">{selectedProjectDetail.Nome}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>Categoria: {selectedProjectDetail.Categ}</Typography>
                
                {(selectedProjectDetail.Problematica || selectedProjectDetail.PublicoAlvo || selectedProjectDetail.Publico || selectedProjectDetail.Solucao) && (
                  <Paper variant="outlined" sx={{ p: 2, my: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={2}>
                      {selectedProjectDetail.Problematica && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <ErrorOutlineIcon color="error" sx={{ mt: 0.3 }} />
                            <Box><Typography variant="subtitle2" fontWeight={600}>Problemática</Typography><Typography variant="body2">{selectedProjectDetail.Problematica}</Typography></Box>
                          </Box>
                        </Grid>
                      )}
                      {(selectedProjectDetail.PublicoAlvo || selectedProjectDetail.Publico) && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <GroupsIcon2 color="primary" sx={{ mt: 0.3 }} />
                            <Box><Typography variant="subtitle2" fontWeight={600}>Público-Alvo</Typography><Typography variant="body2">{selectedProjectDetail.PublicoAlvo || selectedProjectDetail.Publico}</Typography></Box>
                          </Box>
                        </Grid>
                      )}
                      {selectedProjectDetail.Solucao && (
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <LightbulbIcon sx={{ color: '#f59e0b', mt: 0.3 }} />
                            <Box><Typography variant="subtitle2" fontWeight={600}>Solução Proposta</Typography><Typography variant="body2">{selectedProjectDetail.Solucao}</Typography></Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                )}
                
                <Typography variant="body1" paragraph>{selectedProjectDetail.Content || selectedProjectDetail.Resumo}</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Informações Financeiras</Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Meta</Typography><Typography variant="body2">Kz {formatCurrency(selectedProjectDetail.ValorProjecto)}</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Arrecadado</Typography><Typography variant="body2" color="success.main">Kz {formatCurrency(selectedProjectDetail.ValorArrecadado || 0)}</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Progresso</Typography><Typography variant="body2" color={(selectedProjectDetail.ValorArrecadado >= selectedProjectDetail.ValorProjecto) ? 'success.main' : 'text.primary'}>{((selectedProjectDetail.ValorArrecadado || 0) / selectedProjectDetail.ValorProjecto * 100).toFixed(1)}%</Typography></Box>
                        <LinearProgress variant="determinate" value={Math.min(((selectedProjectDetail.ValorArrecadado || 0) / selectedProjectDetail.ValorProjecto) * 100, 100)} sx={{ height: 8, borderRadius: 4 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">ROI</Typography><Typography variant="body2" color="success.main">{selectedProjectDetail.ReceitaEstimada || 0}%</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Duração</Typography><Typography variant="body2">{selectedProjectDetail.DuracaoProjecto || 0} dias</Typography></Box>
                      </Stack>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Análise de IA</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><Typography variant="h3" color="primary">{selectedProjectDetail.ProbalidadeAi || 0}%</Typography><Typography variant="body2">Probabilidade de Sucesso</Typography></Box>
                      <LinearProgress variant="determinate" value={parseFloat(selectedProjectDetail.ProbalidadeAi) || 0} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
                      <Typography variant="caption" color="text.secondary">{parseFloat(selectedProjectDetail.ProbalidadeAi) >= 70 ? 'Alta probabilidade de sucesso' : parseFloat(selectedProjectDetail.ProbalidadeAi) >= 40 ? 'Probabilidade moderada' : 'Baixa probabilidade. Avalie com cuidado'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenProjectDialog(false)}>Fechar</Button>
                {selectedProjectDetail.ValorArrecadado >= selectedProjectDetail.ValorProjecto ? (
                  <Tooltip title="Este projeto já atingiu a meta de arrecadação">
                    <span>
                      <Button variant="contained" disabled startIcon={<CheckCircleIcon />} sx={{ bgcolor: 'success.main', '&.Mui-disabled': { bgcolor: 'success.light', color: 'white' } }}>
                        Meta Atingida
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button variant="contained" startIcon={<AttachMoneyIcon />} onClick={() => { setOpenProjectDialog(false); handleOpenInvestDialog(selectedProjectDetail); }}>
                    Investir
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog open={openInvestDialog} onClose={() => setOpenInvestDialog(false)} maxWidth="sm" fullWidth>
          {selectedProject && (
            <>
              <DialogTitle><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h6">Investir em {selectedProject.Nome}</Typography><IconButton onClick={() => setOpenInvestDialog(false)}><CloseIcon /></IconButton></Box></DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField fullWidth type="number" label="Valor do Investimento" value={investAmount} onChange={(e) => setInvestAmount(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">Kz</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle2" gutterBottom>Resumo</Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Valor:</Typography><Typography variant="body2">Kz {formatCurrency(Number(investAmount) || 0)}</Typography></Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">ROI Estimado:</Typography><Typography variant="body2" color="success.main">{selectedProject.ReceitaEstimada || 0}%</Typography></Box>
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="body2">Probabilidade IA:</Typography><Typography variant="body2">{selectedProject.ProbalidadeAi || 0}%</Typography></Box>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenInvestDialog(false)}>Cancelar</Button>
                <Button variant="contained" onClick={handleInvest} disabled={investing}>{investing ? <CircularProgress size={24} /> : 'Confirmar'}</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography variant="h6">Editar Perfil</Typography><IconButton onClick={() => setOpenSettingsDialog(false)}><CloseIcon /></IconButton></Box></DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ textAlign: 'center' }}><Avatar src={investor.avatar} sx={{ width: 100, height: 100 }} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Nome" value={editProfile.name} onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })} /></Grid>
              <Grid item xs={12}><TextField fullWidth label="Biografia" value={editProfile.bio} onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })} multiline rows={4} /></Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSettingsDialog(false)}>Cancelar</Button>
            <Button variant="contained" onClick={updateUserProfile} disabled={profileUpdating}>{profileUpdating ? <CircularProgress size={24} /> : 'Salvar'}</Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>

        {selectedChatProject && (
          <ChatButton
            projectId={selectedChatProject.id}
            currentUserId={userData.id}
            projectOwnerId={selectedChatProject.Iduser}
            projectTitle={selectedChatProject.Nome}
            unreadCount={unreadMessagesByProject[selectedChatProject.id] || 0}
            onUnreadCountChange={(count) => handleUnreadCountChange(selectedChatProject.id, count)}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
