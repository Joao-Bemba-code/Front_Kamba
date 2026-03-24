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
  FormHelperText,
  CircularProgress,
  Skeleton,
  Grow,
  alpha,
} from '@mui/material';

// Importações de ícones
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
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
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import VerifiedIcon from '@mui/icons-material/Verified';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorefrontIcon from '@mui/icons-material/Storefront';

import axios from 'axios';

// Aliases
const WalletIcon = AccountBalanceWalletIcon;
const RocketIcon = RocketLaunchIcon;
const HealthIcon = HealthAndSafetyIcon;

// URL da API
const API_BASE_URL = 'http://localhost:8080';

// Função para formatar nome corretamente
const formatName = (name) => {
  if (!name) return 'Admin';
  try {
    return decodeURIComponent(escape(name));
  } catch {
    return name;
  }
};

// Função segura para formatar números
const formatCurrency = (value) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Tema moderno
const theme = createTheme({
  palette: {
    primary: {
      main: '#0D8ABC',
      light: '#4FC3F7',
      dark: '#0A6B94',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FF8A5C',
      dark: '#E54B1F',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [analyzingProject, setAnalyzingProject] = useState(false);
  
  const [adminData, setAdminData] = useState({ nome: 'Admin', isAdmin: false });

  // Função para testar conexão com o backend
  const testBackendConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/project/projectos-all`, { timeout: 5000 });
      console.log('Backend OK:', response.status);
      return true;
    } catch (error) {
      console.error('Erro ao conectar ao backend:', error.message);
      setSnackbar({
        open: true,
        message: 'Erro de conexão com o servidor. Verifique se o backend está rodando.',
        severity: 'error'
      });
      return false;
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.users) {
        const formattedUsers = response.data.users.map(user => ({
          id: user.id,
          name: formatName(user.Nome),
          email: user.Email,
          type: user.Type_user === 'entrepreneur' ? 'Empreendedor' : 
                 user.Type_user === 'investor' ? 'Investidor' : 'Admin',
          status: user.Status || 'Ativo',
          registrationDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '2023-01-01',
          projectsCount: user.projectsCount || 0,
          totalInvestments: user.totalInvestments || 0,
          bio: user.Bio || '',
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/project/projectos-all`, { timeout: 10000 });
      if (response.data && response.data.projets) {
        setProjects(response.data.projets);
        setFilteredProjects(response.data.projets);
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar projetos',
        severity: 'error'
      });
    } finally {
      setProjectsLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${API_BASE_URL}/auth/update/${userId}`,
        {
          Nome: userData.name,
          Email: userData.email,
          Bio: userData.bio || '',
          Status: userData.status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Usuário atualizado com sucesso!',
          severity: 'success'
        });
        fetchUsers();
        return true;
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar usuário',
        severity: 'error'
      });
      return false;
    }
  };

  // Função para analisar projeto usando a API do backend
  const analyzeProjectWithBackend = async (projectId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${API_BASE_URL}/api/ai/analyze/${projectId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Erro ao chamar API de análise:', error);
      throw error;
    }
  };

  const handleApproveProject = async (project) => {
    setAnalyzingProject(true);
    
    try {
      const result = await analyzeProjectWithBackend(project.id);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'success'
        });
        
        await fetchProjects();
        setOpenProjectDialog(false);
        setSelectedProject(null);
      } else {
        throw new Error(result.message || 'Erro ao analisar projeto');
      }
      
    } catch (error) {
      console.error('Erro ao analisar projeto:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.message || 'Erro ao analisar projeto',
        severity: 'error'
      });
    } finally {
      setAnalyzingProject(false);
    }
  };

  const handleAnalyzeProject = (project) => {
    setSelectedProject(project);
    setOpenProjectDialog(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user, bio: user.bio || '' });
    setOpenEditUserDialog(true);
  };

  const handleSaveUser = async () => {
    const success = await updateUser(editingUser.id, editingUser);
    if (success) {
      setOpenEditUserDialog(false);
      setEditingUser(null);
    }
  };

  const handleBlockUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    const success = await updateUser(userId, { ...user, status: 'Bloqueado' });
    if (success) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'Bloqueado' } : u
      ));
    }
  };

  const handleActivateUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    const success = await updateUser(userId, { ...user, status: 'Ativo' });
    if (success) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'Ativo' } : u
      ));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo':
        return 'success';
      case 'Em análise':
      case 'Pendente':
        return 'warning';
      case 'Bloqueado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Ativo':
        return <CheckCircleIcon fontSize="small" />;
      case 'Em análise':
      case 'Pendente':
        return <PendingIcon fontSize="small" />;
      case 'Bloqueado':
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/auth/login';
  };

  useEffect(() => {
    if (!projects.length && !users.length) return;

    if (projects.length) {
      const filtered = projects.filter(project => 
        project.Nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.Categ?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.Content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }

    if (users.length) {
      const filtered = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, projects, users]);

  useEffect(() => {
    setMounted(true);
    
    const token = localStorage.getItem('authToken');
    const userDataStr = localStorage.getItem('userData');
    
    if (!token || !userDataStr) {
      window.location.href = '/auth/login';
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      
      if (userData.IsAdmin !== true && userData.IsAdmin !== 1 && userData.IsAdmin !== 'true') {
        window.location.href = '/';
        return;
      }

      setAdminData({
        nome: formatName(userData.Nome || 'Admin'),
        isAdmin: true
      });

      testBackendConnection();
      fetchUsers();
      fetchProjects();

    } catch (error) {
      console.error('Erro ao processar dados do admin:', error);
      window.location.href = '/auth/login';
    }
  }, []);

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.Status === 'Ativo').length;
  const pendingProjects = projects.filter(p => p.Status === 'Em análise').length;
  const totalUsers = users.length;
  const pendingUsers = users.filter(u => u.status === 'Pendente').length;

  const metrics = [
    { 
      title: 'Total de Projetos', 
      value: totalProjects.toString(), 
      trend: `${pendingProjects} em análise`,
      icon: RocketIcon, 
      color: '#0D8ABC',
      bgColor: '#e6f3fa',
    },
    { 
      title: 'Projetos Ativos', 
      value: activeProjects.toString(), 
      trend: 'Em andamento',
      icon: StorefrontIcon, 
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    { 
      title: 'Usuários Totais', 
      value: totalUsers.toString(), 
      trend: `${pendingUsers} pendentes`,
      icon: PeopleIcon, 
      color: '#FF6B35',
      bgColor: '#fff3e6',
    },
    { 
      title: 'Saúde da Plataforma', 
      value: '99.9%', 
      trend: 'Estável',
      icon: HealthIcon, 
      color: '#8b5cf6',
      bgColor: '#ede9fe',
    },
  ];

  const validTab = Math.min(Math.max(currentTab, 0), 2);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              borderRight: 'none',
            },
          }}
        >
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }} variant="rounded">
              <WalletIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                KAMBABUSINESS
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ADMINISTRAÇÃO
              </Typography>
            </Box>
          </Box>

          <List sx={{ px: 2, flex: 1 }}>
            {[
              { text: 'Painel Principal', icon: DashboardIcon, index: 0 },
              { text: 'Gestão de Usuários', icon: PeopleIcon, index: 1 },
              { text: 'Projetos', icon: RocketIcon, index: 2 },
            ].map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  selected={currentTab === item.index}
                  onClick={() => setCurrentTab(item.index)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Box sx={{ p: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminData.nome)}&background=0D8ABC&color=fff&bold=true&format=svg`}
                sx={{ width: 48, height: 48, border: '2px solid', borderColor: 'primary.main' }} 
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {adminData.nome}
                </Typography>
                <Chip size="small" label="Super Admin" color="primary" sx={{ height: 20 }} />
              </Box>
              <Tooltip title="Sair">
                <IconButton size="small" onClick={handleLogout}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Toolbar>
              <Typography variant="h5" sx={{ flex: 1, fontWeight: 600 }}>
                Painel Administrativo
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: 'grey.50', width: 300 }
                  }}
                />
                
                <Tooltip title="Atualizar">
                  <IconButton onClick={() => { fetchUsers(); fetchProjects(); }}>
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <AccountCircleIcon />
                </IconButton>
              </Stack>
            </Toolbar>
          </AppBar>

          {/* Profile Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>

          {/* Content Area */}
          <Box sx={{ p: 4, overflow: 'auto' }}>
            
            {/* Metrics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {metrics.map((metric, index) => (
                <Grow in={true} timeout={800 + index * 200} key={index}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography color="text.secondary" variant="body2">{metric.title}</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{metric.value}</Typography>
                            <Typography variant="body2" color="success.main">{metric.trend}</Typography>
                          </Box>
                          <Avatar sx={{ bgcolor: metric.bgColor, color: metric.color, width: 56, height: 56 }}>
                            <metric.icon />
                          </Avatar>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={validTab} onChange={(e, v) => setCurrentTab(v)}>
                <Tab label="Dashboard" />
                <Tab label="Usuários" />
                <Tab label="Projetos" />
              </Tabs>
            </Box>

            {/* Dashboard View */}
            {validTab === 0 && (
              <Zoom in={true}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Projetos em Destaque
                  </Typography>
                  {projectsLoading ? (
                    <Grid container spacing={3}>
                      {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} md={6} key={item}>
                          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : filteredProjects.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                      <StorefrontIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                      <Typography variant="h5" color="text.secondary">Nenhum projeto encontrado</Typography>
                    </Paper>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredProjects.slice(0, 4).map((project, index) => (
                        <Grow in={true} timeout={600 + index * 100} key={project.id}>
                          <Grid item xs={12} md={6}>
                            <Card>
                              <CardMedia component="img" height="220" image={project.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} />
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                  <Typography variant="h6">{project.Nome}</Typography>
                                  <Chip size="small" icon={getStatusIcon(project.Status)} label={project.Status} color={getStatusColor(project.Status)} />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {project.Content?.substring(0, 120)}...
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Probabilidade IA</Typography>
                                    <Typography variant="body2" fontWeight={600} color="primary">
                                      {project.ProbalidadeAi || '0'}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress variant="determinate" value={parseFloat(project.ProbalidadeAi) || 0} sx={{ height: 6, borderRadius: 3 }} />
                                </Box>
                              </CardContent>
                              <CardActions sx={{ p: 3, pt: 0 }}>
                                <Button variant="outlined" fullWidth startIcon={<VisibilityIcon />} onClick={() => handleAnalyzeProject(project)}>
                                  Ver Detalhes
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        </Grow>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Zoom>
            )}

            {/* Users View */}
            {validTab === 1 && (
              <Fade in={true}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Gestão de Usuários
                  </Typography>

                  {usersLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress />
                    </Box>
                  ) : filteredUsers.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center' }}>
                      <PeopleIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                      <Typography variant="h5" color="text.secondary">Nenhum usuário encontrado</Typography>
                    </Paper>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Usuário</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Registro</TableCell>
                            <TableCell align="right">Ações</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                                    {user.name?.charAt(0) || 'U'}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2">{user.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip label={user.type} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell>
                                <Chip icon={getStatusIcon(user.status)} label={user.status} size="small" color={getStatusColor(user.status)} />
                              </TableCell>
                              <TableCell>{new Date(user.registrationDate).toLocaleDateString('pt-AO')}</TableCell>
                              <TableCell align="right">
                                <Tooltip title="Ver detalhes">
                                  <IconButton size="small" onClick={() => handleViewUser(user)}>
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Editar">
                                  <IconButton size="small" onClick={() => handleEditUser(user)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {user.status === 'Bloqueado' ? (
                                  <Tooltip title="Ativar">
                                    <IconButton size="small" color="success" onClick={() => handleActivateUser(user.id)}>
                                      <CheckCircleIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Bloquear">
                                    <IconButton size="small" color="error" onClick={() => handleBlockUser(user.id)}>
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Fade>
            )}

            {/* Projects View */}
            {validTab === 2 && (
              <Fade in={true}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Gestão de Projetos
                  </Typography>

                  {projectsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress />
                    </Box>
                  ) : filteredProjects.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center' }}>
                      <StorefrontIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                      <Typography variant="h5" color="text.secondary">Nenhum projeto encontrado</Typography>
                    </Paper>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredProjects.map((project, index) => (
                        <Grow in={true} timeout={600 + index * 100} key={project.id}>
                          <Grid item xs={12}>
                            <Card>
                              <CardContent sx={{ p: 3 }}>
                                <Grid container spacing={3}>
                                  <Grid item xs={12} md={3}>
                                    <Box component="img" src={project.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 2 }} />
                                  </Grid>
                                  <Grid item xs={12} md={9}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                      <Box>
                                        <Typography variant="h6">{project.Nome}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          ID: {project.id} • Criado em: {new Date(project.createdAt).toLocaleDateString('pt-AO')}
                                        </Typography>
                                      </Box>
                                      <Chip icon={getStatusIcon(project.Status)} label={project.Status} color={getStatusColor(project.Status)} />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                                      {project.Content || project.Resumo}
                                    </Typography>

                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Meta</Typography>
                                        <Typography variant="subtitle2">Kz {formatCurrency(project.ValorProjecto)}</Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Probabilidade IA</Typography>
                                        <Typography variant="subtitle2" color="primary">{project.ProbalidadeAi || 'Aguardando'}%</Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Categoria</Typography>
                                        <Typography variant="subtitle2">{project.Categ}</Typography>
                                      </Grid>
                                      <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Duração</Typography>
                                        <Typography variant="subtitle2">{project.DuracaoProjecto} dias</Typography>
                                      </Grid>
                                    </Grid>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      <Button variant="contained" startIcon={<VisibilityIcon />} onClick={() => handleAnalyzeProject(project)}>
                                        Analisar
                                      </Button>
                                      {project.Status === 'Em análise' && (
                                        <Button 
                                          variant="contained" 
                                          color="success" 
                                          startIcon={<SmartToyIcon />} 
                                          onClick={() => handleApproveProject(project)}
                                          disabled={analyzingProject}
                                        >
                                          {analyzingProject ? 'Analisando...' : 'Analisar com IA'}
                                        </Button>
                                      )}
                                    </Box>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grow>
                      ))}
                    </Grid>
                  )}
                </Box>
              </Fade>
            )}
          </Box>
        </Box>

        {/* Project Details Dialog */}
        <Dialog open={openProjectDialog} onClose={() => setOpenProjectDialog(false)} maxWidth="md" fullWidth>
          {selectedProject && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Detalhes do Projeto</Typography>
                  <IconButton onClick={() => setOpenProjectDialog(false)}><CloseIcon /></IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Box component="img" src={selectedProject.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'} sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 2, mb: 2 }} />
                <Typography variant="h5">{selectedProject.Nome}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>Categoria: {selectedProject.Categ}</Typography>
                <Typography variant="body1" paragraph>{selectedProject.Content || selectedProject.Resumo}</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Informações Financeiras</Typography>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Meta</Typography>
                          <Typography variant="body2">Kz {formatCurrency(selectedProject.ValorProjecto)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Duração</Typography>
                          <Typography variant="body2">{selectedProject.DuracaoProjecto} dias</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Análise de IA</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h3" color="primary">{selectedProject.ProbalidadeAi || '0'}%</Typography>
                        <Typography variant="body2">Probabilidade de Sucesso</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={parseFloat(selectedProject.ProbalidadeAi) || 0} sx={{ height: 8, borderRadius: 4 }} />
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenProjectDialog(false)}>Fechar</Button>
                {selectedProject.Status === 'Em análise' && (
                  <Button variant="contained" color="success" onClick={() => handleApproveProject(selectedProject)} disabled={analyzingProject} startIcon={<SmartToyIcon />}>
                    {analyzingProject ? 'Analisando...' : 'Analisar com IA'}
                  </Button>
                )}
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* User Details Dialog */}
        <Dialog open={openUserDialog} onClose={() => setOpenUserDialog(false)} maxWidth="sm" fullWidth>
          {selectedUser && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Detalhes do Usuário</Typography>
                  <IconButton onClick={() => setOpenUserDialog(false)}><CloseIcon /></IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 100, height: 100, mb: 2, fontSize: 40, bgcolor: 'primary.main' }}>
                    {selectedUser.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                  <Chip label={selectedUser.type} color="primary" size="small" sx={{ mt: 1 }} />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Chip icon={getStatusIcon(selectedUser.status)} label={selectedUser.status} color={getStatusColor(selectedUser.status)} size="small" sx={{ mt: 1 }} />
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">Registro</Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>{new Date(selectedUser.registrationDate).toLocaleDateString('pt-AO')}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenUserDialog(false)}>Fechar</Button>
                <Button variant="contained" color={selectedUser.status === 'Bloqueado' ? 'success' : 'error'} onClick={() => {
                  if (selectedUser.status === 'Bloqueado') {
                    handleActivateUser(selectedUser.id);
                  } else {
                    handleBlockUser(selectedUser.id);
                  }
                  setOpenUserDialog(false);
                }}>
                  {selectedUser.status === 'Bloqueado' ? 'Ativar Usuário' : 'Bloquear Usuário'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={openEditUserDialog} onClose={() => setOpenEditUserDialog(false)} maxWidth="sm" fullWidth>
          {editingUser && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Editar Usuário</Typography>
                  <IconButton onClick={() => setOpenEditUserDialog(false)}><CloseIcon /></IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'primary.main' }}>
                      {editingUser.name?.charAt(0) || 'U'}
                    </Avatar>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Nome" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} type="email" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Bio" value={editingUser.bio || ''} onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })} multiline rows={3} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select value={editingUser.status} label="Status" onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}>
                        <MenuItem value="Ativo">Ativo</MenuItem>
                        <MenuItem value="Pendente">Pendente</MenuItem>
                        <MenuItem value="Bloqueado">Bloqueado</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEditUserDialog(false)} startIcon={<CancelIcon />}>Cancelar</Button>
                <Button variant="contained" onClick={handleSaveUser} startIcon={<SaveIcon />}>Salvar</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* FAB */}
        <Fab color="primary" sx={{ position: 'fixed', bottom: 32, right: 32 }}>
          <AddIcon />
        </Fab>
      </Box>
    </ThemeProvider>
  );
}