// components/HeroSection.js
"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Stack,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Link from 'next/link';

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: `radial-gradient(circle at 0% 0%, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${theme.palette.background.default} 100%)`,
}));

const Badge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.75, 2.5),
  borderRadius: 100,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.03)} 100%)`,
  backdropFilter: 'blur(8px)',
  color: theme.palette.primary.main,
  fontSize: '0.8125rem',
  fontWeight: 600,
  letterSpacing: '-0.2px',
  marginBottom: theme.spacing(4),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
  '& svg': {
    fontSize: 16,
    marginRight: 8,
  },
}));

const GradientText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  lineHeight: 1.08,
  marginBottom: theme.spacing(3),
  letterSpacing: '-0.03em',
  '& .highlight': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    position: 'relative',
    display: 'inline-block',
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4.5),
  borderRadius: 60,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: -100,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4.5),
  borderRadius: 60,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  border: `2px solid ${alpha(theme.palette.text.primary, 0.12)}`,
  color: theme.palette.text.primary,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const ScrollIndicator = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 40,
  left: '50%',
  transform: 'translateX(-50%)',
  cursor: 'pointer',
  zIndex: 10,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 0.7,
  },
}));

const HeroSection = () => {
  const theme = useTheme();

  return (
    <HeroContainer component="header">
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={8} lg={7}>
            <Fade in timeout={800}>
              <Box sx={{ textAlign: 'center' }}>
                <Badge sx={{ mx: 'auto' }}>
                  <RocketLaunchIcon />
                  Plataforma Líder em Equity Crowdfunding
                </Badge>

                <GradientText
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.8rem', sm: '3.8rem', md: '4.8rem', lg: '5.2rem' },
                    textAlign: 'center',
                  }}
                >
                  O Futuro do{' '}
                  <span className="highlight">Crescimento</span>
                  <br />
                  é Colectivo.
                </GradientText>

                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 5,
                    maxWidth: 680,
                    mx: 'auto',
                    fontWeight: 450,
                    lineHeight: 1.55,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    textAlign: 'center',
                  }}
                >
                  Conectamos empreendedores ambiciosos com investidores que acreditam 
                  no potencial de Angola. Invista em negócios reais e faça parte 
                  da transformação económica do país.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2.5}
                  sx={{ justifyContent: 'center' }}
                >
                  <CTAButton
                    component={Link}
                    href="#projects"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Explorar Projetos
                  </CTAButton>
                  <SecondaryButton
                    component={Link}
                    href="/auth/register"
                  >
                    Tornar-me Investidor
                  </SecondaryButton>
                </Stack>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>

      <ScrollIndicator
        onClick={() => {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 56,
            border: `2px solid ${alpha(theme.palette.text.primary, 0.2)}`,
            borderRadius: 28,
            display: 'flex',
            justifyContent: 'center',
            pt: 1.5,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 12,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 4,
              animation: `${floatAnimation} 1.2s ease-in-out infinite`,
            }}
          />
        </Box>
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default HeroSection;