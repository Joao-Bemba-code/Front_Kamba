// src/app/auth/login/page.js
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
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';

const Login = () => {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    senha: false
  });

  // Se não estiver montado, renderiza null para evitar erro de hidratação
  if (!mounted) {
    return null;
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validações
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateAngolanPhone = (phone) => {
    const re = /^9[0-9]{8}$/;
    return re.test(phone);
  };

  const getFieldError = (field) => {
    if (!touched[field]) return '';

    switch (field) {
      case 'email':
        if (!email) return 'Email é obrigatório';
        if (!validateEmail(email) && !validateAngolanPhone(email)) {
          return 'Digite um email válido ou telefone angolano (9 dígitos)';
        }
        return '';

      case 'senha':
        if (!senha) return 'Senha é obrigatória';
        return '';

      default:
        return '';
    }
  };

  const isFormValid = () => {
    return email && senha;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      senha: true
    });

    if (!isFormValid()) {
      setMessage({
        text: 'Preencha todos os campos',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.post("http://localhost:8080/auth/login", {
        Email: email,
        Senha: senha
      });

      // Salvar token no localStorage
      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        
        // Decodificar token para obter dados do usuário
        try {
          const base64Url = res.data.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const userData = JSON.parse(atob(base64));
          
          // Salvar dados do usuário
          localStorage.setItem('userData', JSON.stringify({
            id: userData.id,
            Nome: userData.Nome,
            IsAdmin: userData.IsAdmin,
            Status: userData.Status,
            Type_user: userData.Type_user
          }));

          console.log('Dados do usuário:', userData);

          setMessage({
            text: res.data.msg || "Login realizado com sucesso!",
            type: 'success'
          });

          // Limpar campos
          setEmail("");
          setSenha("");
          
          // Redirecionar baseado no tipo de usuário
          setTimeout(() => {
            // Se for admin, vai para o painel admin
            if (userData.IsAdmin === true || userData.IsAdmin === 1 || userData.IsAdmin === 'true') {
              router.push('/painel/admin');
            } 
            // Se não for admin, verifica o tipo
            else {
              if (userData.Type_user === 'empreendedor' || userData.Type_user === 'entrepreneur') {
                router.push('/painel/emp');
              } else if (userData.Type_user === 'investidor' || userData.Type_user === 'investor') {
                router.push('/painel/investidor');
              } else {
                // Fallback para admin se algo der errado
                router.push('/painel/admin');
              }
            }
          }, 1500);

        } catch (e) {
          console.error('Erro ao decodificar token:', e);
          setMessage({
            text: 'Erro ao processar dados do usuário',
            type: 'error'
          });
        }
      } else {
        throw new Error('Token não recebido');
      }

    } catch (error) {
      console.error('Erro no login:', error);
      
      const mensagemErro = error.response?.data?.msg || 
                          error.response?.data?.error || 
                          "Erro ao fazer login. Verifique suas credenciais.";
      
      setMessage({
        text: mensagemErro,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Left Side - Formulário */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 6 } }}>
          {/* Logo e cabeçalho */}
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
                <AccountBalanceIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                KAMBABUSINESS
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Bem-vindo de volta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Acesse sua conta para continuar
            </Typography>
          </Box>

          {/* Mensagem de feedback */}
          {message.text && (
            <Alert
              severity={message.type}
              icon={<CheckCircleIcon />}
              sx={{ mb: 3 }}
            >
              {message.text}
              {message.type === 'success' && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  Redirecionando...
                </Typography>
              )}
            </Alert>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Email/Telefone */}
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
              />

              {/* Senha */}
              <TextField
                fullWidth
                label="Palavra-passe"
                type={isPasswordVisible ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onBlur={() => handleBlur('senha')}
                error={!!getFieldError('senha')}
                helperText={getFieldError('senha')}
                disabled={isLoading}
                placeholder="••••••••"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Link Esqueceu Senha */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <MuiLink
                  href="/auth/recuperar-senha"
                  underline="hover"
                  sx={{
                    color: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Esqueceu a senha?
                </MuiLink>
              </Box>

              {/* Botão de Login */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  },
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                    <span>Entrando...</span>
                  </Box>
                ) : (
                  'Entrar'
                )}
              </Button>

              {/* Mensagem de validação */}
              {!isFormValid() && !isLoading && Object.values(touched).some(Boolean) && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Preencha todos os campos para continuar
                </Alert>
              )}
            </Box>
          </form>

          {/* Link para Registro */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Ainda não tem conta?{' '}
              <MuiLink
                href="/auth/register"
                underline="hover"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Criar Conta
              </MuiLink>
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Hero Section */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            p: 6,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Padrão de fundo */}
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

          {/* Conteúdo */}
          <Box sx={{ position: 'relative', zIndex: 1, color: 'white' }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
              Invista no futuro de Angola
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
              Conectamos investidores a empreendedores de forma simples e segura
            </Typography>

            {/* Features */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SecurityIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Projetos analisados por IA
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Inteligência artificial avalia o potencial de cada projeto
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <GroupsIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Aprovados por equipe profissional
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Especialistas avaliam e aprovam cada oportunidade
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <WhatsAppIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Pagamentos via WhatsApp
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Receba e faça pagamentos de forma simples e rápida
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VerifiedIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Extratos de Negócios
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Acompanhe seus extratos diretamente no WhatsApp
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;