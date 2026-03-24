// src/app/auth/register/page.js
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
  FormControl,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import VerifiedIcon from '@mui/icons-material/Verified';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `2px solid transparent`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const Register = () => {
  const [mounted, setMounted] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipoUsuario: '',
    termosAceitos: false
  });

  // Estados de UI
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });
  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    senha: false,
    confirmarSenha: false,
    tipoUsuario: false
  });

  // Se não estiver montado, renderiza null para evitar erro de hidratação
  if (!mounted) {
    return null;
  }

  // Funções de manipulação
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'senha') {
      analyzePasswordStrength(value);
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  // Análise de força da senha
  const analyzePasswordStrength = (password) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Muito fraca';
        break;
      case 2:
        feedback = 'Fraca';
        break;
      case 3:
        feedback = 'Média';
        break;
      case 4:
        feedback = 'Forte';
        break;
      case 5:
        feedback = 'Muito forte';
        break;
    }

    setPasswordStrength({ score, feedback });
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
      case 'nome':
        if (!formData.nome) return 'Nome é obrigatório';
        if (formData.nome.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
        return '';

      case 'email':
        if (!formData.email) return 'Email é obrigatório';
        if (!validateEmail(formData.email) && !validateAngolanPhone(formData.email)) {
          return 'Digite um email válido ou telefone angolano (9 dígitos)';
        }
        return '';

      case 'senha':
        if (!formData.senha) return 'Senha é obrigatória';
        if (formData.senha.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
        return '';

      case 'confirmarSenha':
        if (!formData.confirmarSenha) return 'Confirme sua senha';
        if (formData.senha !== formData.confirmarSenha) return 'As senhas não coincidem';
        return '';

      case 'tipoUsuario':
        if (!formData.tipoUsuario) return 'Selecione o tipo de usuário';
        return '';

      default:
        return '';
    }
  };

  const isFormValid = () => {
    return (
      formData.nome &&
      formData.email &&
      formData.senha &&
      formData.confirmarSenha &&
      formData.tipoUsuario &&
      formData.termosAceitos &&
      formData.senha === formData.confirmarSenha &&
      formData.senha.length >= 6
    );
  };

  // Submit do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      nome: true,
      email: true,
      senha: true,
      confirmarSenha: true,
      tipoUsuario: true
    });

    if (!isFormValid()) {
      setMessage({
        text: 'Por favor, preencha todos os campos corretamente.',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Mapear tipo de usuário para o formato do backend (entrepreneur/investor)
      const userTypeMap = {
        'investidor': 'investor',
        'empreendedor': 'entrepreneur'
      };

      const response = await axios.post("http://localhost:8080/auth/register", {
        Nome: formData.nome,
        Email: formData.email,
        Senha: formData.senha,
        Type_user: userTypeMap[formData.tipoUsuario]
      });

      setMessage({
        text: response.data.msg || 'Registro realizado com sucesso!',
        type: 'success'
      });

      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipoUsuario: '',
        termosAceitos: false
      });

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (error) {
      console.error('Erro detalhado:', error);

      let mensagemErro = 'Erro ao registrar. Tente novamente.';

      if (error.response) {
        mensagemErro = error.response.data?.msg ||
          error.response.data?.error ||
          `Erro ${error.response.status}`;
      }

      setMessage({
        text: mensagemErro,
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar indicador de força da senha
  const renderPasswordStrength = () => {
    if (!formData.senha || formData.senha.length === 0) return null;

    const colors = {
      1: theme.palette.error.main,
      2: theme.palette.warning.main,
      3: theme.palette.info.main,
      4: theme.palette.success.main,
      5: theme.palette.success.dark,
    };

    return (
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ flex: 1, height: 4, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2, overflow: 'hidden' }}>
            <Box
              sx={{
                width: `${(passwordStrength.score / 5) * 100}%`,
                height: '100%',
                bgcolor: colors[passwordStrength.score] || theme.palette.grey[400],
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70 }}>
            {passwordStrength.feedback}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              color: formData.senha.length >= 6 ? 'success.main' : 'text.secondary',
            }}
          >
            • Mínimo 6 caracteres
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: /[a-z]/.test(formData.senha) && /[A-Z]/.test(formData.senha) ? 'success.main' : 'text.secondary',
            }}
          >
            • Letras maiúsculas e minúsculas
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: /[0-9]/.test(formData.senha) ? 'success.main' : 'text.secondary',
            }}
          >
            • Pelo menos um número
          </Typography>
        </Box>
      </Box>
    );
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
                <PersonAddIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                KAMBABUSINESS
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Criar nova conta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Junte-se à plataforma de investimentos de Angola
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
                  Redirecionando para o login...
                </Typography>
              )}
            </Alert>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Nome Completo */}
              <TextField
                fullWidth
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                onBlur={() => handleBlur('nome')}
                error={!!getFieldError('nome')}
                helperText={getFieldError('nome')}
                disabled={isLoading}
                placeholder="Digite seu nome completo"
              />

              {/* Email/Telefone */}
              <TextField
                fullWidth
                label="Email ou Telefone"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="senha"
                type={isPasswordVisible ? 'text' : 'password'}
                value={formData.senha}
                onChange={handleChange}
                onBlur={() => handleBlur('senha')}
                error={!!getFieldError('senha')}
                helperText={getFieldError('senha')}
                disabled={isLoading}
                placeholder="••••••••"
                InputProps={{
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
              {renderPasswordStrength()}

              {/* Confirmar Senha */}
              <TextField
                fullWidth
                label="Confirmar Palavra-passe"
                name="confirmarSenha"
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                value={formData.confirmarSenha}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmarSenha')}
                error={!!getFieldError('confirmarSenha')}
                helperText={getFieldError('confirmarSenha')}
                disabled={isLoading}
                placeholder="••••••••"
                InputProps={{
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

              {/* Tipo de Usuário */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Tipo de Conta
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <StyledCard
                      className={formData.tipoUsuario === 'investidor' ? 'selected' : ''}
                      onClick={() => !isLoading && setFormData(prev => ({ ...prev, tipoUsuario: 'investidor' }))}
                    >
                      <Box sx={{ fontSize: 40, mb: 1 }}>💰</Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Investidor
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center">
                        Invista em projetos
                      </Typography>
                    </StyledCard>
                  </Grid>
                  <Grid item xs={6}>
                    <StyledCard
                      className={formData.tipoUsuario === 'empreendedor' ? 'selected' : ''}
                      onClick={() => !isLoading && setFormData(prev => ({ ...prev, tipoUsuario: 'empreendedor' }))}
                    >
                      <Box sx={{ fontSize: 40, mb: 1 }}>🚀</Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Empreendedor
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center">
                        Crie e gerencie projetos
                      </Typography>
                    </StyledCard>
                  </Grid>
                </Grid>
                {getFieldError('tipoUsuario') && (
                  <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    {getFieldError('tipoUsuario')}
                  </Typography>
                )}
              </Box>

              {/* Termos e Condições - CORRIGIDO sem âncora dentro de âncora */}
              <FormControlLabel
                control={
                  <Checkbox
                    name="termosAceitos"
                    checked={formData.termosAceitos}
                    onChange={handleChange}
                    disabled={isLoading}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Li e aceito os{' '}
                    <MuiLink
                      href="/termos"
                      underline="hover"
                      color="primary.main"
                      sx={{ fontWeight: 600, cursor: 'pointer' }}
                    >
                      Termos e Condições
                    </MuiLink>{' '}
                    e a{' '}
                    <MuiLink
                      href="/privacidade"
                      underline="hover"
                      color="primary.main"
                      sx={{ fontWeight: 600, cursor: 'pointer' }}
                    >
                      Política de Privacidade
                    </MuiLink>
                  </Typography>
                }
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              />

              {/* Botão de Submit */}
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
                    <span>Processando...</span>
                  </Box>
                ) : (
                  'Criar Conta'
                )}
              </Button>

              {/* Mensagem de validação */}
              {!isFormValid() && !isLoading && Object.values(touched).some(Boolean) && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Preencha todos os campos e aceite os termos para criar sua conta
                </Alert>
              )}
            </Box>
          </form>

          {/* Link para Login */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <MuiLink
                href="/auth/login"
                underline="hover"
                sx={{
                  color: 'primary.main',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Entrar
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
                  <BusinessCenterIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Oportunidades de Negócio
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Descubra projetos promissores para investir
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

export default Register;