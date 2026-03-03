# CrewForce - Project Context

## Regras de Workflow (Anti-Vibe Coding Protocol)
1. **GitHub Always On:** Sempre que uma alteração funcional ou correção de bug for concluída e validada localmente com sucesso, o agente DEVE imedatamente executar o envio para o GitHub (`git add .`, `git commit` com mensagem descritiva e `git push`) para garantir a integração contínua (CI/CD) com o Coolify. Nunca encerrar uma sessão de sucesso sem o push.

## Status do Projeto
- Framework: Next.js App Router, TailwindCSS.
- Auth: Custom / JWT (Manager/Admin Roles).
- Database: PostgreSQL (Prisma).
- Funcionalidades Ativas: Timecard tracker, Criação e Gestão de Crews, Diretório de Workers, Relatórios Diários via Webhook do Telegram (com IA do Gemini) e renderização de projetos no Mapa (Latitude/Longitude).

## Próximas Etapas e Restrições
- Seguir estritamente o protocolo Docs-First.
- Manter o padrão visual Glassmorphism estabelecido na UI.
