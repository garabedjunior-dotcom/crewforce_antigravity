# CrewForce - Manual do Utilizador (Gestores e Funcionários)

O CrewForce é um sistema para empresas de construção em campo que necessitam de fazer a ponte entre as operações (Relatórios Diários via Telegram) e a contabilidade (cálculo de folhas de pagamento W2 e 1099 usando métricas mistas, como Piece-Rate, Hour e Diárias).

## 1. Módulo: Administração Geral (Managers)

Aceda à plataforma web utilizando as suas credenciais (`admin@crewforce.app`).
A interface do sistema possui um menu lateral de navegação com quatro abas principais.

### 1.1 Gerir Funcionários (Workers & Crews)
Adicione todos os trabalhadores (W2 e independentes 1099) no ecrã de **Crews**.
A cada trabalhador deve ser atribuído:
*   Nome Completo;
*   **Chat ID do Telegram** (Fornecido pelo operário ao interagir pela primeira vez com o bot). Sem isto, as imagens e logs enviados no WhatsApp/Telegram serão perdidos.
*   Tipo de Contrato: **W2** (regime horário clássico, que beneficia do "Make-Whole Guarantee") ou **1099** (regime Subcontractor).
*   Taxas Globais: *Hourly (Taxa por Hora)* ou *Daily (Taxa por Dia)*.
(Opcionalmente, pode ser adicionada compensação de Overtime, se W2).

### 1.2 Gerir Projetos e Estaleiros (Projects)
Crie um novo projeto, e atribua um budget (orçamento estimado) e equipas a esse projeto.
Após criar a Obra, terá a secção vital de **Rates & Team** através do botão correspondente no card do projeto:
*   **Piece Rates (Preços por Peça/Atividade):** Os trabalhadores geram o seu valor consoante a produtividade (ex: $2/mtr Puxar Cabo; $5/und Poste de Telefone). Adicione-as nesta página específica da obra.
*   **Rates por Funcionário:** Alguns supervisores ou "Foreman" ganham extra em determinadas obras (ex: Per Diem de $100 pelo alojamento na Flórida). Adicione as taxas exclusivas de forma a substituir temporariamente a tarifa Global durante a duração do Projeto.

---

## 2. Módulo: O Processo Diário (Daily Logs pelo Telegram)

O trabalhador que se desloca para as obras não precisa de descarregar aplicações nativas para smartphones.

1.  **Ligar-se ao Batente:** O funcionário deve procurar no Telegram o nome do nosso Bot e escrever: `/start`.
2.  **Associação:** O gestor pede ao funcionário o ID que o Bot imprimiu no seu ecrã, e associa esse ID no painel **Crews** sob o nome desse trabalhador.
3.  **Relatório (Log):** Ao final do dia ou ao mudar de obra, tudo o que o funcionário precisa é interagir no Telegram como o faria para um amigo:
    *   Tira e anexa fotografias do asfalto, painel ou trincheira finalizada;
    *   Na caixa de texto escreve: *"Trabalhei em Puxar 15 Metros de Cabo FTTH, e 1 poste."*
4.  A IA inteligente da aplicação interpretará a ação e validará para o encarregado, anexando o Log, o horário de submissão, e as viabilidades métricas na página oficial do Projeto em tempo real.

---

## 3. Módulo: Contabilidade e Folhas de Pagamento (Payroll Engine)

Vá à secção de **Payroll** para compilar as faturas dos subempreiteiros independentes (1099) e dos assalariados (W2).

 O motor efetuará cálculos em três dimensões de forma massiva com 1-clique:
A.  Identifica todos os **Piece Rates** (o trabalho que cada funcionário fez vs. preço por unidade em toda a semana).
B.  Identifica o **Guaranteed Wage** (Número de logs submetidos x Rate Diária ou Rate Horária do trabalhador).
C.  Ganha quem tiver o número Superior **(Make-Whole Provision para o W2)**.

Exemplo de W2: O funcionário "Maria" ganha $15/hr (Total 5x8=$600) na sua garantia da semana legal.
Porém, ela e a sua equipa finalizaram atividades em obra valendo um *Piece Rate* de $850. O *Payroll* ignorará a base global, e vai processar a semana da Maria baseada na excelência da produção ($850). Se faltasse à obra e produzisse apenas $400 em peças, o Crewforce garantir-lhe-ia os $600 acordados, emitindo Alertas Vermelhos ao administrador do sistema para baixa produtividade da Maria na semana.

### Exportações
A partir da plataforma, poderá efetuar a extração nativa em `.CSV` para entregar os blocos ao vosso banco ou contador (ex: QuickBooks, ADP, Ceridian, Workday, etc).
