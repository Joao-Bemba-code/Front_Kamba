// components/AboutSection.js
"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  useTheme,
  alpha,
  Fade,
  Grow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const SectionContainer = styled(Box)(({ theme }) => ({
  py: 12,
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4, 2),
  borderRadius: 24,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
    borderColor: alpha(theme.palette.primary.main, 0.2),
  },
  '&:hover .icon-avatar': {
    transform: 'scale(1.05)',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
}));

const IconAvatar = styled(Avatar)(({ theme }) => ({
  width: 72,
  height: 72,
  marginBottom: theme.spacing(2.5),
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '& .MuiSvgIcon-root': {
    fontSize: 36,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  fontSize: { xs: '2rem', md: '2.5rem' },
  letterSpacing: '-0.02em',
  position: 'relative',
  display: 'inline-block',
}));

const AboutSection = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <TrendingUpIcon />,
      title: 'Alta Performance',
      description: 'Acompanhe seus investimentos em tempo real com métricas avançadas e análises preditivas por IA.',
      color: theme.palette.success.main,
    },
    {
      icon: <SecurityIcon />,
      title: 'Segurança Máxima',
      description: 'Plataforma com criptografia de ponta a ponta e conformidade com as normas bancárias angolanas.',
      color: theme.palette.info.main,
    },
    {
      icon: <Diversity3Icon />,
      title: 'Diversificação Inteligente',
      description: 'Acesso a projetos em diferentes setores: tecnologia, energia, agronegócio e saúde.',
      color: theme.palette.warning.main,
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Análise por IA',
      description: 'Nossa inteligência artificial analisa cada projeto e fornece probabilidade de sucesso.',
      color: theme.palette.secondary.main,
    },
    {
      icon: <RocketLaunchIcon />,
      title: 'Scale-up Angolano',
      description: 'Invista em startups e projetos locais com alto potencial de crescimento.',
      color: theme.palette.error.main,
    },
    {
      icon: <AccountBalanceIcon />,
      title: 'Gestão Profissional',
      description: 'Equipe especializada em avaliação e acompanhamento de investimentos.',
      color: theme.palette.primary.main,
    },
  ];

  return (
    <SectionContainer component="section" id="about">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Cabeçalho */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: '1.5px',
                mb: 2,
                display: 'block',
                fontSize: '0.75rem',
              }}
            >
              PORQUE ESCOLHER A KAMBABUSINESS
            </Typography>
            <SectionTitle variant="h2" gutterBottom>
              Excelência em{' '}
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                Investimentos
              </Box>
            </SectionTitle>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 680,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: '1.125rem',
              }}
            >
              Oferecemos uma plataforma segura e sofisticada para quem procura 
              diversificar o seu portfólio com ativos reais da economia angolana.
            </Typography>
          </Box>
        </Fade>

        {/* Grid de Cards */}
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Grow in timeout={600 + index * 100}>
                <StyledCard elevation={0}>
                  <IconAvatar 
                    className="icon-avatar"
                    sx={{ bgcolor: alpha(feature.color, 0.08), color: feature.color }}
                  >
                    {feature.icon}
                  </IconAvatar>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: '1.25rem',
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </StyledCard>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Elementos Decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: -100,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.03)} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: -100,
          width: 400,
          height: 400,
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </SectionContainer>
  );
};

export default AboutSection;