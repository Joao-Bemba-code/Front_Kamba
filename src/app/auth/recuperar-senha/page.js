// src/app/auth/recuperar-senha/page.js
"use client";

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Alert,
  CircularProgress,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockResetIcon from '@mui/icons-material/LockReset';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE_URL = 'http://localhost:8080';

const PasswordReset = () => {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [touched, setTouched] = useState({
    email: false,
    newPassword: false,
    confirmPassword: false
  });

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateAngolanPhone = (phone) => {
    const re = /^9[0-9]{8}$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const getFieldError = (field) => {
    if (!touched[field]) return '';

    switch (field) {
      case 'email':
        if (!email) return 'Email ou telefone é obrigatório';
        if (!validateEmail(email) && !validateAngolanPhone(email)) {
          return 'Digite um email válido ou telefone angolano (9 dígitos)';
        }
        return '';

      case 'newPassword':
        if (!newPassword) return 'Nova senha é obrigatória';
        if (!validatePassword(newPassword)) return 'A senha deve ter no mínimo 6 caracteres';
        return '';

      case 'confirmPassword':
        if (!confirmPassword) return 'Confirme sua nova senha';
        if (confirmPassword !== newPassword) return 'As senhas não coincidem';
        return '';

      default:
        return '';
    }
  };

  const isEmailValid = () => {
    return email && (validateEmail(email) || validateAngolanPhone(email));
  };

  const isPasswordValid = () => {
    return newPassword && validatePassword(newPassword) && confirmPassword === newPassword;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setTouched({ ...touched, email: true });

    if (!isEmailValid()) {
      setMessage({
        text: 'Por favor, insira um email ou telefone válido',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      setActiveStep(1);
      setMessage({
        text: 'Email verificado! Agora defina sua nova senha.',
        type: 'success'
      });
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      
    } catch (error) {
      setMessage({
        text: 'Erro ao verificar email. Tente novamente.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setTouched({
      newPassword: true,
      confirmPassword: true
    });

    if (!isPasswordValid()) {
      setMessage({
        text: 'Por favor, verifique se as senhas são iguais e têm no mínimo 6 caracteres',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await axios.put(`${API_BASE_URL}/auth/changePassword`, {
        Email: email,
        NewPassword: newPassword
      });

      if (response.data.success === true) {
        setMessage({
          text: response.data.msg || 'Senha alterada com sucesso!',
          type: 'success'
        });

        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        throw new Error(response.data.msg || 'Erro ao alterar senha');
      }

    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setMessage({
        text: 'Erro ao redefinir senha. Tente novamente.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = ['Verificar Identidade', 'Nova Senha'];

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 3, md: 6 } }}>
          <Box sx={{ mb: 4, textAlign: { xs: 'center', lg: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', lg: 'flex-start' }, gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LockResetIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                KAMBABUSINESS
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Recuperar Senha
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Redefina sua senha em poucos passos
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {message.text && (
            <Alert
              severity={message.type}
              icon={message.type === 'success' ? <CheckCircleIcon /> : undefined}
              sx={{ mb: 3 }}
            >
              {message.text}
              {message.type === 'success' && activeStep === 1 && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Redirecionando para o login...
                </Typography>
              )}
            </Alert>
          )}

          {activeStep === 0 && (
            <form onSubmit={handleEmailSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Email ou Telefone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  error={!!getFieldError('email')}
                  helperText={getFieldError('email') || "Use seu email ou telefone angolano (9 dígitos)"}
                  disabled={isLoading}
                  placeholder="exemplo@email.com ou 923456789"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading || !email}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      <span>Verificando...</span>
                    </Box>
                  ) : (
                    'Continuar'
                  )}
                </Button>
              </Box>
            </form>
          )}

          {activeStep === 1 && (
            <form onSubmit={handlePasswordReset}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Nova Senha"
                  type={isPasswordVisible ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => handleBlur('newPassword')}
                  error={!!getFieldError('newPassword')}
                  helperText={getFieldError('newPassword') || "Mínimo de 6 caracteres"}
                  disabled={isLoading}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirmar Nova Senha"
                  type={isConfirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  error={!!getFieldError('confirmPassword')}
                  helperText={getFieldError('confirmPassword')}
                  disabled={isLoading}
                  placeholder="••••••••"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKeyIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                          edge="end"
                          disabled={isLoading}
                        >
                          {isConfirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading || !newPassword || !confirmPassword}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      <span>Alterando senha...</span>
                    </Box>
                  ) : (
                    'Redefinir Senha'
                  )}
                </Button>

                <Button
                  variant="text"
                  onClick={() => setActiveStep(0)}
                  disabled={isLoading}
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Voltar
                </Button>
              </Box>
            </form>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Lembrou sua senha?{' '}
              <MuiLink
                href="/auth/login"
                underline="hover"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                }}
              >
                Fazer Login
              </MuiLink>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            p: 6,
            bgcolor: 'primary.main',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
              Recuperação de Senha
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
              Siga as instruções para redefinir sua senha com segurança
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  1. Verifique seu email
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Informe o email ou telefone cadastrado na plataforma
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  2. Crie uma nova senha
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Escolha uma senha forte e segura (mínimo 6 caracteres)
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  3. Confirme e acesse
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Após redefinir, você será redirecionado para fazer login
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 6,
                p: 3,
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                <strong>Dica:</strong> Use uma senha única. Combine letras maiúsculas, 
                minúsculas, números e caracteres especiais.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PasswordReset;