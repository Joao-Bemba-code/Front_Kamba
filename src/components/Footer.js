// components/Footer.js
"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.8rem',
  letterSpacing: '-0.02em',
  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(2),
  '& span': {
    WebkitTextFillColor: theme.palette.primary.main,
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  '& .MuiSvgIcon-root': {
    fontSize: 20,
    color: theme.palette.primary.main,
  },
  '& .MuiTypography-root': {
    fontSize: '0.9rem',
  },
}));

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer component="footer">
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: 4,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          {/* Logo e Descrição */}
          <Box sx={{ flex: 1 }}>
            <LogoText variant="h4" sx={{ justifyContent: { xs: 'center', md: 'flex-start' }, display: 'flex' }}>
              KAMBA<span>BUSINESS</span>
            </LogoText>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, lineHeight: 1.8, maxWidth: 400 }}
            >
              A primeira plataforma de equity crowdfunding focada exclusivamente 
              no mercado angolano. Excelência, transparência e retorno.
            </Typography>
          </Box>

          {/* Contactos */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Contactos
            </Typography>
            <ContactInfo>
              <LocationOnIcon />
              <Typography>Luanda, Angola</Typography>
            </ContactInfo>
            <ContactInfo>
              <EmailIcon />
              <Typography>contacto@kambabusiness.ao</Typography>
            </ContactInfo>
            <ContactInfo>
              <PhoneIcon />
              <Typography>+244 923 456 789</Typography>
            </ContactInfo>
          </Box>

          {/* Links Legais */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: theme.palette.text.primary,
              }}
            >
              Legal
            </Typography>
            <FooterLink href="/termos-e-privacidade" sx={{ display: 'block', mb: 1 }}>
              Termos e Privacidade
            </FooterLink>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.1) }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.disabled">
            © {currentYear} Kamba Business. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>

      {/* Elementos Decorativos */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
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
          top: '20%',
          left: 0,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.03)} 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    </FooterContainer>
  );
};

export default Footer;