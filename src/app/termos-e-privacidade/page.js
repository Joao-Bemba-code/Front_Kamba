// app/termos-e-privacidade/page.js
"use client";

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
  alpha,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import PaymentIcon from '@mui/icons-material/Payment';

const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(8),
}));

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4, 2),
  borderRadius: 32,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.75rem',
  marginBottom: theme.spacing(3),
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    borderRadius: 2,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.05)}`,
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  borderRadius: '16px !important',
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
    marginBottom: theme.spacing(2),
  },
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 20,
  textAlign: 'center',
  height: '100%',
  backgroundColor: alpha(theme.palette.primary.main, 0.02),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const LastUpdated = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const TermsPage = () => {
  const theme = useTheme();
  const lastUpdated = "15 de Março de 2026";

  const sections = [
    {
      icon: <GavelIcon />,
      title: "Termos de Uso",
      content: [
        "Ao aceder e utilizar a plataforma KambaBusiness, você concorda integralmente com estes Termos e Condições. A plataforma oferece serviços de equity crowdfunding, conectando investidores a oportunidades de investimento em empresas angolanas.",
        "O investimento em projetos envolve riscos. A KambaBusiness não garante retornos financeiros e recomenda que todos os investidores realizem sua própria análise antes de qualquer decisão de investimento.",
        "A plataforma atua como intermediária, facilitando a conexão entre investidores e empresas. A KambaBusiness não se responsabiliza por decisões de investimento tomadas pelos usuários."
      ]
    },
    {
      icon: <PrivacyTipIcon />,
      title: "Política de Privacidade",
      content: [
        "A KambaBusiness está comprometida com a proteção dos seus dados pessoais. Todas as informações fornecidas são tratadas com rigorosa confidencialidade e segurança.",
        "Coletamos dados necessários para verificação de identidade, processo de investimento e cumprimento de obrigações legais. Seus dados nunca serão compartilhados com terceiros sem seu consentimento explícito.",
        "Você tem direito a acessar, corrigir e solicitar a exclusão dos seus dados pessoais a qualquer momento, através do nosso suporte ao cliente."
      ]
    },
    {
      icon: <SecurityIcon />,
      title: "Segurança e Proteção",
      content: [
        "Utilizamos criptografia de ponta a ponta e tecnologias de segurança avançadas para proteger todas as transações e dados armazenados na plataforma.",
        "A KambaBusiness opera em conformidade com as leis e regulamentos angolanos, incluindo a Lei de Proteção de Dados e normas do Banco Nacional de Angola.",
        "Recomendamos que os usuários mantenham suas credenciais de acesso em segurança e reportem imediatamente qualquer atividade suspeita à nossa equipe."
      ]
    },
    {
      icon: <DataUsageIcon />,
      title: "Uso de Dados",
      content: [
        "Os dados coletados são utilizados exclusivamente para: verificação de identidade, processamento de investimentos, comunicação sobre oportunidades e cumprimento de obrigações regulatórias.",
        "A KambaBusiness utiliza algoritmos de análise de dados para melhorar a experiência do usuário e fornecer recomendações personalizadas de investimento.",
        "Não comercializamos seus dados pessoais. Todas as informações são tratadas com o mais alto nível de confidencialidade."
      ]
    },
    {
      icon: <PaymentIcon />,
      title: "Transações e Investimentos",
      content: [
        "Todos os investimentos realizados através da plataforma são registrados e documentados digitalmente, garantindo segurança jurídica para todas as partes envolvidas.",
        "Os valores investidos são mantidos em contas segregadas até a conclusão do processo de captação, garantindo a proteção dos recursos dos investidores.",
        "A KambaBusiness cobra uma taxa de serviço transparente, que é comunicada previamente aos usuários antes da realização de qualquer investimento."
      ]
    },
    {
      icon: <WarningIcon />,
      title: "Riscos e Responsabilidades",
      content: [
        "Investir em startups e empresas em crescimento envolve riscos, incluindo a possibilidade de perda total do capital investido. A KambaBusiness recomenda diversificação de investimentos.",
        "A plataforma não oferece garantias de rentabilidade ou retorno sobre o investimento. As decisões de investimento são de responsabilidade exclusiva do investidor.",
        "As empresas listadas passam por um processo de due diligence, mas a KambaBusiness não se responsabiliza por eventuais insucessos dos projetos."
      ]
    }
  ];

  const highlights = [
    {
      icon: <CheckCircleIcon />,
      title: "Transparência Total",
      description: "Comunicação clara sobre taxas, riscos e oportunidades"
    },
    {
      icon: <SecurityIcon />,
      title: "Segurança Garantida",
      description: "Criptografia avançada e conformidade regulatória"
    },
    {
      icon: <PrivacyTipIcon />,
      title: "Privacidade Protegida",
      description: "Seus dados são tratados com máxima confidencialidade"
    }
  ];

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <HeroSection>
          <Chip
            label="Documento Legal"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              mb: 3,
              borderRadius: 4,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            Termos e{' '}
            <Box component="span" sx={{ color: theme.palette.primary.main }}>
              Privacidade
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: 'auto',
              fontSize: '1.125rem',
            }}
          >
            Entenda como protegemos seus dados e quais são seus direitos e responsabilidades 
            ao utilizar a plataforma KambaBusiness.
          </Typography>
        </HeroSection>

        {/* Highlights Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {highlights.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <InfoCard elevation={0}>
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </InfoCard>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <StyledPaper elevation={0}>
          <Box sx={{ mb: 4 }}>
            <SectionTitle variant="h2">
              Disposições Gerais
            </SectionTitle>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Este documento estabelece os termos e condições de uso da plataforma KambaBusiness, 
              bem como as políticas de privacidade aplicáveis a todos os usuários.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Accordion Sections */}
          {sections.map((section, index) => (
            <StyledAccordion key={index} elevation={0}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
                sx={{
                  '& .MuiAccordionSummary-content': {
                    alignItems: 'center',
                    gap: 2,
                  },
                }}
              >
                <Box sx={{ color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {section.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {section.content.map((paragraph, idx) => (
                    <Typography key={idx} variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {paragraph}
                    </Typography>
                  ))}
                </Box>
              </AccordionDetails>
            </StyledAccordion>
          ))}

          <Divider sx={{ my: 4 }} />

          {/* Final Notes */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              A KambaBusiness reserva-se o direito de atualizar estes termos periodicamente. 
              Recomendamos que consulte esta página regularmente para se manter informado sobre 
              quaisquer alterações. O uso contínuo da plataforma após modificações constitui 
              aceitação dos novos termos.
            </Typography>
          </Box>

          <LastUpdated variant="caption">
            Última atualização: {lastUpdated}
          </LastUpdated>
        </StyledPaper>

        {/* Contact Section */}
        <Box
          sx={{
            mt: 6,
            p: 4,
            borderRadius: 24,
            textAlign: 'center',
            backgroundColor: alpha(theme.palette.primary.main, 0.02),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Dúvidas sobre estes termos?
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            Entre em contato conosco:{' '}
            <Box
              component="a"
              href="mailto:legal@kambabusiness.ao"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              legal@kambabusiness.ao
            </Box>
          </Typography>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default TermsPage;