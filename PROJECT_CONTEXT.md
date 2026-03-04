# CrewForce - Project Context

## Regras de Workflow (Anti-Vibe Coding Protocol)
1. **GitHub Always On:** Sempre que uma alteração funcional ou correção de bug for concluída e validada localmente com sucesso, o agente DEVE imedatamente executar o envio para o GitHub (`git add .`, `git commit` com mensagem descritiva e `git push`) para garantir a integração contínua (CI/CD) com o Coolify. Nunca encerrar uma sessão de sucesso sem o push.
2. **Scan Before Suggest:** ANTES de propor ou iniciar a construção de qualquer funcionalidade, módulo ou tela, o agente é explicitamente OBRIGADO a vasculhar o código base (`src`, `prisma`, rotas e componentes) para verificar se a funcionalidade ou a base dela já não existe no projeto. É terminantemente proibido propor features redundantes.

## Status do Projeto
- Framework: Next.js App Router, TailwindCSS.
- Auth: Custom / JWT (Manager/Admin Roles).
- Database: PostgreSQL (Prisma).
- Funcionalidades Ativas: Timecard tracker, Criação e Gestão de Crews, Diretório de Workers, Relatórios Diários via Webhook do Telegram (com IA do Gemini) e renderização de projetos no Mapa (Latitude/Longitude).

## Próximas Etapas e Restrições
- Seguir estritamente o protocolo Docs-First.
- Manter o padrão visual Glassmorphism estabelecido na UI.

## Modificações Recentes & Tech Debt / Hand-Off
- **UI Overflow / Grid Blowout**: Implementado sistema defensivo em elementos Flex/Grid (`min-w-0`, `min-h-0`, `shrink-0`) pelo painel para segurar responsividade. Em novas construções flex/grid complexas, lembrar previamente desta limitação de contêineres filhos.
- **Form Validation & Server Actions**: Modificado tipagem restrita do Zod para aceitar Strings Vazias `""` provindas do frontend como `null` nativo, alocando a validação para o escopo interno das "Try/Catch Actions" para capturar exceções sem tela vermelha `500`.
- Removidos CTA Buttons redundantes que quebravam a hierarquia da tela.
