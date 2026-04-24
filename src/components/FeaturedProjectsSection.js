// components/FeaturedProjectsSection.js
"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  useTheme,
  alpha,
  Fade,
  Grow,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Styled Components
const SectionContainer = styled(Box)(({ theme }) => ({
  py: 12,
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  marginBottom: theme.spacing(6),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
    '&::before': {
      opacity: 1,
    },
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
  },
}));

const ProjectImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  position: 'relative',
  transition: 'transform 0.5s ease',
}));

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: alpha(theme.palette.primary.main, 0.9),
  color: theme.palette.common.white,
  fontWeight: 600,
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  backdropFilter: 'blur(4px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
}));

const ProjectMetric = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
}));

// Função para calcular ROI (mesma do backend)
const calculateROI = (valorMeta, receitaEstimada) => {
  const meta = parseFloat(valorMeta) || 0;
  const receita = parseFloat(receitaEstimada) || 0;
  
  if (meta <= 0) return 0;
  
  const lucro = receita - meta;
  const roi = (lucro / meta) * 100;
  
  return Math.round(roi * 10) / 10;
};

// Função para obter a cor do ROI
const getROIColor = (roi) => {
  if (roi >= 30) return 'success';
  if (roi >= 20) return 'info';
  if (roi >= 10) return 'warning';
  return 'error';
};

// Função para formatar ROI
const formatROI = (roi) => {
  if (roi === 0) return 'N/A';
  if (roi > 0) return `+${roi}%`;
  return `${roi}%`;
};

const FeaturedProjectsSection = () => {
  const theme = useTheme();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const API_BASE_URL = 'http://localhost:8080';

  const fetchProjects = async () => {
    setLoading(true);
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
      
      // Filtrar apenas projetos com status "Ativo" e calcular ROI
      const activeProjects = projetosData
        .filter(p => p.Status === 'Ativo')
        .map(p => ({
          ...p,
          Problematica: p.Problematica || '',
          PublicoAlvo: p.PublicoAlvo || p.Publico || '',
          Solucao: p.Solucao || '',
          userId: p.userId || p.UserId || p.user_id || 'N/A',
          roi: calculateROI(p.ValorProjecto, p.ReceitaEstimada)
        }));
      
      setProjects(activeProjects);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const formatCurrency = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleInvestClick = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  if (loading) {
    return (
      <SectionContainer>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography>Carregando projetos...</Typography>
          </Box>
        </Container>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer component="section" id="projects">
      <Container maxWidth="lg">
        {/* Cabeçalho */}
        <Fade in timeout={1000}>
          <SectionHeader>
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  letterSpacing: 2,
                  mb: 1,
                  display: 'block',
                }}
              >
                OPORTUNIDADES
              </Typography>
              <SectionTitle variant="h3" gutterBottom>
                Projetos em Destaque
              </SectionTitle>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600 }}
              >
                Projetos selecionados para investidores que procuram impacto e retorno.
              </Typography>
            </Box>
          </SectionHeader>
        </Fade>

        {/* Grid de Projetos */}
        {projects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum projeto ativo no momento.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Volte em breve para novas oportunidades de investimento.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project, index) => {
              const successProbability = project.ProbalidadeAi ? parseFloat(project.ProbalidadeAi) : 0;
              const roi = project.roi;
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={project.id}>
                  <Grow in timeout={1000 + index * 150}>
                    <StyledCard>
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <ProjectImage
                          image={project.Img || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'}
                          title={project.Nome}
                        />
                        <CategoryChip
                          label={project.Categ || 'Geral'}
                          size="small"
                        />
                      </Box>

                      <CardContent sx={{ flex: 1, p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight={700}>
                          {project.Nome}
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, minHeight: 40 }}
                        >
                          {project.Resumo || project.Content?.substring(0, 100) || 'Sem descrição'}
                        </Typography>

                        {/* Progresso IA */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                              Probabilidade de Sucesso
                            </Typography>
                            <Typography variant="caption" fontWeight={700} color="primary">
                              {successProbability}%
                            </Typography>
                          </Box>
                          <ProgressBar variant="determinate" value={successProbability} />
                        </Box>

                        {/* Métricas */}
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Meta
                            </Typography>
                            <Typography variant="subtitle2" fontWeight={700}>
                              Kz {formatCurrency(project.ValorProjecto)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              ROI Estimado
                            </Typography>
                            <Typography 
                              variant="subtitle2" 
                              fontWeight={700} 
                              color={`${getROIColor(roi)}.main`}
                            >
                              {formatROI(roi)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {project.DuracaoProjecto || 0} dias
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
                              <Typography variant="caption" color="success.main" fontWeight={600}>
                                IA: {successProbability}%
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Informações extras - Problemática/Solução (opcional) */}
                        {project.Problematica && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Problemática
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {project.Problematica.substring(0, 80)}...
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={() => handleInvestClick(project)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                            },
                          }}
                        >
                          Quero Investir
                        </Button>
                      </CardActions>
                    </StyledCard>
                  </Grow>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Dialog de Investimento */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2,
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight={700}>
                {selectedProject?.Nome}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Para investir neste projeto, você precisa estar cadastrado como investidor.
            </Alert>
            
            {/* Informações do Projeto no Dialog */}
            {selectedProject && (
              <>
                <Typography variant="body2" paragraph>
                  {selectedProject.Resumo || selectedProject.Content?.substring(0, 200) || 'Sem descrição detalhada.'}
                </Typography>

                <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), p: 2, borderRadius: 2, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Meta do Projeto
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        Kz {formatCurrency(selectedProject.ValorProjecto)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        ROI Estimado
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        color={`${getROIColor(selectedProject.roi)}.main`}
                      >
                        {formatROI(selectedProject.roi)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Duração
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedProject.DuracaoProjecto || 0} dias
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Probabilidade IA
                      </Typography>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {selectedProject.ProbalidadeAi || '0'}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
            
            <Typography variant="body2" color="text.secondary" paragraph>
              A KambaBusiness conecta investidores a oportunidades reais de negócio em Angola.
              Ao se cadastrar, você terá acesso a:
            </Typography>
            
            <Stack spacing={1.5} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceWalletIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="body2">Dashboard completo de investimentos</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="body2">Análise detalhada de cada projeto</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="body2">Acompanhamento de investimentos</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                <Typography variant="body2">Suporte exclusivo e atualizações</Typography>
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{ borderRadius: 2 }}
            >
              Fazer Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              onClick={handleRegister}
              sx={{ 
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
            >
              Criar Conta
            </Button>
          </DialogActions>
        </Dialog>

        {/* Elementos Decorativos */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: 0,
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: 0,
            width: 500,
            height: 500,
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.05)} 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      </Container>
    </SectionContainer>
  );
};

export default FeaturedProjectsSection;