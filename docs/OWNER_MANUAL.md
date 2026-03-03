# CrewForce - Manual do Proprietário (Administrador do Sistema)

Este manual é destinado ao dono da infraestrutura ou administrador técnico responsável por manter o CrewForce online.

## 1. Arquitetura e Requisitos
O CrewForce é construído com **Next.js 16 (React 19)**, **Prisma ORM**, e banco de dados **PostgreSQL**.
Foi desenhado para ser alojado num servidor VPS através do gestor **Coolify** (via contentores Docker/Nixpacks).

### Serviços Externos Necessários:
1. **Telegram Bot API:** Para receber relatórios diários (Daily Logs).
2. **MinIO / Amazon S3:** Para armazenar permanentemente as fotos enviadas pelo bot do Telegram (evitando links caducados).
3. **Google Gemini API (Opcional):** Para processamento de linguagem natural e melhoria automática dos relatórios enviados pelos trabalhadores.

## 2. Configuração do Ambiente no Coolify
Na aba "Environment Variables" da sua aplicação Next.js no Coolify, garanta que TODAS as seguintes variáveis estão configuradas com valores sensíveis:

### Variáveis de Base de Dados
- \`DATABASE_URL\`: URL de conexão ao PostgreSQL (ex: \`postgresql://user:pass@ip:5432/db\`).
- \`DIRECT_DATABASE_URL\`: Igual ao DATABASE_URL, utilizado pelo Prisma para migrar o esquema.

### Variáveis de Autenticação (NextAuth)
- \`NEXTAUTH_URL\`: O domínio público completo da sua aplicação (ex: \`https://crewforce.seu-dominio.com\`).
- \`NEXTAUTH_SECRET\`: Chave aleatória em base64 (gerada para assinar tokens JWT).
- \`AUTH_SECRET\`: Igual ao NEXTAUTH_SECRET (necessário na nova versão do Auth.js).
- \`AUTH_TRUST_HOST\`: **Obrigatório definir como \`true\`** no Coolify, para evitar que o NextAuth bloqueie os inícios de sessão sob suspeita de "Host Spoofing" no reverse proxy (Traefik).

### Variáveis do Telegram
- \`TELEGRAM_BOT_TOKEN\`: Token fornecido pelo @BotFather. Se recriado, o webhook tem de ser reinstalado.
- \`TELEGRAM_WEBHOOK_SECRET\`: Código secreto gerado por si no início, atua como "firewall" para impedir que intrusos postem na API do webhook do bot.

### Variáveis de Armazenamento de Mídia (MinIO/S3)
- \`S3_ENDPOINT\`: O URL da API do painel MinIO.
- \`S3_ACCESS_KEY_ID\`: Utilizador/ID da conta do Bucket.
- \`S3_SECRET_ACCESS_KEY\`: Senha de acesso ao S3.
- \`S3_BUCKET_NAME\`: Nome do bucket (ex: \`crewforce-logs\`). Garanta que o bucket tem os privilégios Public/Read configurados!

## 3. Gestão do Bot do Telegram (Webhook)
Se a aplicação mudar de IP ou de Domínio, precisa informar o Telegram para onde deve redirecionar as fotos.
Abra este link no navegador (substituindo <> pelos seus dados reais):

\`\`\`text
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<O_DOMINIO_DA_TUA_APP>/api/webhook/telegram&secret_token=<TELEGRAM_WEBHOOK_SECRET>
\`\`\`
Resposta esperada: \`{"ok":true,"result":true,"description":"Webhook was set"}\`.

## 4. Troubleshooting Diário e Segurança
1. **Falha de Início de Sessão (Login Loop):** Se o login redirecionar de volta para a mesma página, significa que a variável \`AUTH_TRUST_HOST=true\` foi esquecida no painel. Adicione e faça redeploy.
2. **Imagens a aparecer partidas no Relatório:** As fotos geram erro após 1 hora se as credenciais do S3 estiverem erradas (pois faz fallback para o link expirável do Telegram). Valide os logs do sistema à procura do erro \`Error migrating photo to MinIO\`.
3. **Novo Administrador:** Para reiniciar chaves de acesso caso esqueça do login principal, aceda remotamente ao VPS e execute o script na base de código local: \`npx tsx scripts/seed-admin.ts\`.
