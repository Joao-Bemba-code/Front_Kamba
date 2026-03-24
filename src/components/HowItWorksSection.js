// components/HowItWorksSection.js
"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  alpha,
  Fade,
  Grow,
  Stack,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const SectionContainer = styled(Box)(({ theme }) => ({
  py: 12,
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

const StepCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateX(8px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    borderColor: alpha(theme.palette.primary.main, 0.3),
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`,
    '& .step-number': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      borderColor: theme.palette.primary.main,
      transform: 'scale(1.05)',
    },
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: 28,
  border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: 800,
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  flexShrink: 0,
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: 32,
  overflow: 'hidden',
  boxShadow: `0 30px 60px ${alpha(theme.palette.primary.main, 0.2)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%)`,
    zIndex: 1,
    pointerEvents: 'none',
  },
}));

const FloatingBadge = styled(Box)(({ theme, delay = 0 }) => ({
  position: 'absolute',
  padding: theme.spacing(1.5, 2.5),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: 'blur(12px)',
  borderRadius: 60,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  animationDelay: `${delay}s`,
  zIndex: 2,
}));

const HowItWorksSection = () => {
  const theme = useTheme();

  const steps = [
    {
      title: 'Crie a sua Conta',
      description: 'Registe-se em minutos e complete o seu perfil de investidor para aceder a oportunidades exclusivas.',
    },
    {
      title: 'Analise Projectos',
      description: 'Examine o Business Plan, as projeções financeiras e a equipa por trás de cada empresa na nossa plataforma.',
    },
    {
      title: 'Invista e Acompanhe',
      description: 'Escolha o valor, assine digitalmente e acompanhe o crescimento da sua participação através do seu dashboard.',
    },
  ];

  return (
    <SectionContainer component="section" id="how-it-works">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={8} alignItems="center">
          {/* Conteúdo dos Passos */}
          <Grid item xs={12} lg={6}>
            <Fade in timeout={800}>
              <Box>
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
                  COMO FUNCIONA
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                    mb: 2,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Como Investir na{' '}
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>
                    KambaBusiness
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 5, fontSize: '1.125rem', maxWidth: 500 }}
                >
                  Invista em projetos inovadores em apenas três passos simples
                </Typography>

                <Stack spacing={3}>
                  {steps.map((step, index) => (
                    <Grow in timeout={600 + index * 150} key={index}>
                      <StepCard elevation={0}>
                        <StepNumber className="step-number">
                          {index + 1}
                        </StepNumber>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              mb: 1,
                              fontSize: '1.25rem',
                            }}
                          >
                            {step.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.6 }}
                          >
                            {step.description}
                          </Typography>
                        </Box>
                      </StepCard>
                    </Grow>
                  ))}
                </Stack>
              </Box>
            </Fade>
          </Grid>

          {/* Imagem com elementos flutuantes */}
          <Grid item xs={12} lg={6}>
            <Fade in timeout={1000}>
              <Box sx={{ position: 'relative' }}>
                <ImageWrapper>
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlbdUxkUzpDI6b9Suh5_dKzwzATipDoBfE6NLCE9fQcHqGsP_1uV0MBQuHzwgESfp1KtMyDP-iNJf5uyGMsXoeHj1f6yqTvTllr7zpM2a4RgQ4nCXfcM4lBHcmQfprYl0EAiCmw14QgrOnhDitkiTBu65v4CCvEnDbXUmiXB7VfNVosTySJgV8xA5E4C7KT7k_OKGcnkPKManjvixKpPZ03nirEaQRArcb6DKVr7yvcwiJNSK0zk4PyFLO7z5B6vshgDlCveALOD4"
                    alt="Dashboard Preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 32,
                      display: 'block',
                    }}
                  />
                </ImageWrapper>

                {/* Elementos Flutuantes */}
                <FloatingBadge delay={0} sx={{ top: '10%', left: -20 }}>
                  <CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>
                    Verificação de Projetos
                  </Typography>
                </FloatingBadge>

                <FloatingBadge delay={1.5} sx={{ bottom: '15%', right: -20 }}>
                  <TrendingUpIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>
                    ROI +32% a.a.
                  </Typography>
                </FloatingBadge>

                <FloatingBadge delay={0.8} sx={{ top: '40%', right: '10%' }}>
                  <AnalyticsIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />
                  <Typography variant="body2" fontWeight={600}>
                    Análise por IA
                  </Typography>
                </FloatingBadge>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      {/* Elementos Decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: -50,
          width: 300,
          height: 300,
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
          right: -50,
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

export default HowItWorksSection;