// components/Navbar.js
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  alpha,
  Divider,
  useTheme,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LoginIcon from '@mui/icons-material/Login';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(13, 138, 188, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(13, 138, 188, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(13, 138, 188, 0);
  }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  backdropFilter: 'none',
  boxShadow: 'none',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  borderBottom: 'none',
}));

const StyledAppBarScrolled = styled(AppBar)(({ theme }) => ({
  background: alpha(theme.palette.background.default, 0.95),
  backdropFilter: 'blur(20px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
}));

const LogoWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  position: 'relative',
  '&:hover .logo-icon': {
    transform: 'rotate(5deg) scale(1.05)',
  },
}));

const LogoIcon = styled(Box)(({ theme }) => ({
  width: 36,
  height: 36,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '& svg': {
    fontSize: 20,
    color: 'white',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '-0.02em',
  fontSize: '1.5rem',
  background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  '& span': {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '1.25rem',
  },
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: 500,
  fontSize: '0.9375rem',
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: 40,
  position: 'relative',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    color: theme.palette.primary.main,
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 4,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 20,
      height: 2,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 2,
    },
  }),
}));

const CTAButton = styled(Button)(({ theme }) => ({
  borderRadius: 40,
  padding: '8px 28px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  boxShadow: '0 2px 8px rgba(13, 138, 188, 0.25)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(13, 138, 188, 0.35)',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.default,
    borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.08)',
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 20);

      if (pathname !== '/') return;

      const sections = ['about', 'how-it-works', 'projects'];
      const scrollPosition = offset + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleScrollToSection = useCallback((e, href, sectionId) => {
    e.preventDefault();
    handleCloseDrawer();

    if (pathname !== '/') {
      router.push(`/${href}`);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  }, [pathname, router, handleCloseDrawer]);

  const handleNavigate = useCallback((path) => {
    handleCloseDrawer();
    router.push(path);
  }, [router, handleCloseDrawer]);

  const menuItems = [
    { 
      text: 'Início', 
      icon: <HomeIcon fontSize="small" />, 
      href: '/',
      isLink: true,
    },
    { 
      text: 'Sobre Nós', 
      icon: <InfoIcon fontSize="small" />, 
      href: '#about', 
      sectionId: 'about' 
    },
    { 
      text: 'Como Funciona', 
      icon: <HowToRegIcon fontSize="small" />, 
      href: '#how-it-works', 
      sectionId: 'how-it-works' 
    },
    { 
      text: 'Projetos', 
      icon: <BusinessCenterIcon fontSize="small" />, 
      href: '#projects', 
      sectionId: 'projects' 
    },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
      }}>
        <LogoWrapper onClick={() => handleNavigate('/')}>
          <LogoIcon className="logo-icon">
            <TrendingUpIcon />
          </LogoIcon>
          <LogoText>
            KAMBA<span>BUSINESS</span>
          </LogoText>
        </LogoWrapper>
        <IconButton onClick={handleCloseDrawer} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ flex: 1, px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={item.isLink ? Link : 'a'}
              href={item.href}
              onClick={(e) => {
                if (!item.isLink) {
                  handleScrollToSection(e, item.href, item.sectionId);
                } else {
                  handleNavigate(item.href);
                }
              }}
              selected={item.isLink ? pathname === item.href : activeSection === item.sectionId}
              sx={{
                borderRadius: 2,
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.6)}` }}>
        <CTAButton
          fullWidth
          startIcon={<RocketLaunchIcon />}
          onClick={() => handleNavigate('/auth/register')}
          sx={{ mb: 2 }}
        >
          Criar Conta
        </CTAButton>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            © 2026 KAMBABUSINESS
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Todos os direitos reservados
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const isHomePage = pathname === '/';
  const isActive = (sectionId) => isHomePage && activeSection === sectionId;

  // Durante SSR, retorna placeholder sem usar window
  if (!mounted) {
    return <div style={{ height: 80, width: '100%', backgroundColor: 'transparent' }} />;
  }

  const AppBarComponent = scrolled ? StyledAppBarScrolled : StyledAppBar;

  return (
    <>
      <AppBarComponent 
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ height: { xs: 70, md: 80 }, justifyContent: 'space-between' }}>
            {/* Logo Section */}
            <LogoWrapper onClick={() => handleNavigate('/')}>
              <LogoIcon className="logo-icon">
                <TrendingUpIcon />
              </LogoIcon>
              <LogoText>
                KAMBA<span>BUSINESS</span>
              </LogoText>
            </LogoWrapper>

            {/* Desktop Navigation */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 0.5 
              }}
            >
              {menuItems.map((item) => (
                <NavButton
                  key={item.text}
                  component={item.isLink ? Link : 'a'}
                  href={item.href}
                  onClick={(e) => {
                    if (!item.isLink) {
                      e.preventDefault();
                      handleScrollToSection(e, item.href, item.sectionId);
                    }
                  }}
                  active={item.isLink ? (pathname === item.href ? 1 : 0) : (isActive(item.sectionId) ? 1 : 0)}
                >
                  {item.text}
                </NavButton>
              ))}
            </Box>

            {/* Desktop CTA */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                alignItems: 'center', 
                gap: 2 
              }}
            >
              <Button
                variant="text"
                onClick={() => handleNavigate('/auth/login')}
                startIcon={<LoginIcon />}
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Entrar
              </Button>
              <CTAButton
                startIcon={<RocketLaunchIcon />}
                onClick={() => handleNavigate('/auth/register')}
                sx={{
                  animation: scrolled ? 'none' : `${pulseAnimation} 2s infinite`,
                }}
              >
                Criar Conta
              </CTAButton>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                color: scrolled || !isHomePage ? theme.palette.text.primary : theme.palette.common.white,
                backgroundColor: scrolled || !isHomePage ? alpha(theme.palette.background.paper, 0.8) : 'transparent',
                backdropFilter: scrolled || !isHomePage ? 'blur(8px)' : 'none',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                },
                transition: 'all 0.3s ease',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBarComponent>

      {/* Mobile Drawer */}
      <MobileDrawer
        anchor="right"
        open={mobileOpen}
        onClose={handleCloseDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={300}
      >
        {drawerContent}
      </MobileDrawer>

      {/* Spacer for fixed navbar */}
      <Box sx={{ height: { xs: 70, md: 80 } }} />
    </>
  );
};

export default Navbar;