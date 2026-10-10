# Popcult Links

Plataforma de links para criadores com estética pop cult. Cada usuário autenticado administra seu perfil, links, temas, imagens e estatísticas; visitantes acessam `/{username}`.

## Stack e arquitetura

| Camada | Tecnologia | Papel |
| --- | --- | --- |
| Interface | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS | Páginas públicas e painel |
| Interação | Framer Motion, Lucide React, dnd-kit | Animações, ícones e ordenação |
| Dados e login | Supabase PostgreSQL, Auth, Storage, RLS | Persistência, login e políticas por usuário |
| Hospedagem | Cloudflare Workers, OpenNext | Execução full stack sem R2 ou Durable Objects |
| CI/CD | Cloudflare Workers Builds + GitHub | Deploy a cada push na branch de produção |

O endereço principal `/` redireciona para o perfil cadastrado no Supabase. O perfil público usa Server Components e consulta o Supabase a cada visita para mostrar dados atualizados sem cache persistente. O painel usa cookies de sessão, middleware para rotas privadas e Server Actions para alterações. `GET /go/{id}` contabiliza o clique antes de redirecionar. `POST /api/view/{username}` registra uma visualização por navegador/perfil a cada 30 minutos. A localização é o código de país informado pela Cloudflare, e o dispositivo é inferido do User-Agent; IPs não são salvos. CTR = cliques ÷ visualizações.

### Portfólio

O perfil público `javertt` destaca o [HelpDesk TI](https://helpdesk-ti-web.samy-vgomes.workers.dev) e o **NetBalancer** em uma seção de projetos. O cartão HelpDesk oferece uma [demonstração interativa](https://helpdesk-ti-web.samy-vgomes.workers.dev/login?demo=1) e acesso ao sistema online. O cartão NetBalancer abre `/projetos/netbalancer`, uma página de estudo de caso com simulação didática de Round-Robin e failover. O serviço TCP Python roda separadamente do Worker do Popcult; a página não se conecta ao serviço local. A integração pública entre os projetos é feita por links.

### Estrutura

```text
app/                  Rotas públicas, login, painel, ações e endpoints
components/           Cards, perfil e componentes do painel
lib/                  Tipos, temas, validação e clientes Supabase
supabase/schema.sql   Tabelas, índices, políticas RLS, funções e Storage
wrangler.jsonc        Worker e assets estáticos
open-next.config.ts   Adaptador Next.js → Cloudflare
```

## Instalação local

Requisitos: Node.js 20 ou superior, npm e um projeto Supabase.

```bash
npm install
cp .env.example .env.local
npm run dev
```

No PowerShell, copie com `Copy-Item .env.example .env.local`. Abra `http://localhost:3000` e acesse `/admin/login`.

Preencha `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use a **publishable key** (ou chave `anon` legada) do Supabase. Nunca coloque a `service_role` em uma variável `NEXT_PUBLIC_*`. A aplicação usa somente a chave pública; o acesso sensível é limitado por RLS.

## Configurar Supabase

1. Crie um projeto no [Supabase Dashboard](https://supabase.com/dashboard).
2. Em **SQL Editor**, cole e execute todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Execute em um projeto novo; o script cria as políticas e funções necessárias.
3. Em **Project Settings → API**, copie a URL do projeto e a publishable/anon key para `.env.local`.
4. Em **Authentication → Providers → Email**, habilite e-mail/senha. Crie o primeiro usuário em **Authentication → Users → Add user**. Se a confirmação de e-mail estiver habilitada, confirme o usuário antes do primeiro login.
5. O bucket público `profile-assets` é criado pelo SQL. Os uploads são limitados a PNG/JPG/WebP de até 5 MB e ficam em uma pasta com o ID do usuário.
6. Entre em `/admin/login`. Na primeira visita, salve o perfil antes de adicionar links.

O SQL permite leitura pública de perfis e de links ativos dentro do período agendado. Cada usuário autenticado só insere, altera e exclui o próprio perfil e os próprios links. Analytics só pode ser lido pelo dono; a gravação pública passa pela função `record_event`, que verifica perfil, link e agenda. Para tráfego real, configure [rate limiting na Cloudflare](https://developers.cloudflare.com/waf/rate-limiting-rules/) para `/api/view/*`, `/go/*` e para a API Supabase caso ela fique exposta diretamente: eventos públicos podem ser enviados em excesso por terceiros.

## Publicação na Cloudflare com GitHub

**Por que Workers?** A [documentação atual da Cloudflare para Next.js em Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/) indica Pages para exportação estática e Workers para aplicações full stack com Server Components, autenticação e rotas de servidor. O antigo `@cloudflare/next-on-pages` foi [descontinuado](https://github.com/cloudflare/next-on-pages). Este projeto usa [OpenNext para Workers](https://opennext.js.org/cloudflare/get-started); um deploy estático em Pages não executaria o painel e os endpoints.

1. Crie um repositório GitHub e envie este projeto. Não envie `.env.local`.
2. No Dashboard Cloudflare, abra **Workers & Pages → Create application → Import a repository**, autorize GitHub e escolha o repositório. Selecione **Workers**.
3. Confirme que o nome do Worker é `popcult-links`, igual ao campo `name` de `wrangler.jsonc`, ou ajuste esse campo para o nome escolhido.
4. Em **Settings → Builds**, use **Build command** `npm run build` e **Deploy command** `npx wrangler deploy`. O script `build` gera o artefato OpenNext exigido pelo Worker; `next build` sozinho não é suficiente. Use Node.js 20+ no ambiente de build. A branch de produção deve ser a desejada (por exemplo, `main`).
5. Em **Settings → Variables and Secrets**, adicione `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL` com a URL final do Worker ou domínio personalizado. Como variáveis `NEXT_PUBLIC_*` são incorporadas ao bundle, também as configure no ambiente de **build**, caso o painel as separe entre build e runtime.
6. Faça o primeiro deploy. Em Supabase **Authentication → URL Configuration**, ajuste **Site URL** para a URL publicada. O projeto usa e-mail/senha, então não exige callback OAuth.
7. Abra a URL publicada, entre em `/admin/login`, salve o perfil e confira `/{username}`. Novos pushes na branch configurada disparam build e deploy automáticos pelo [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/).

O perfil público é renderizado sob demanda. Alterações salvas no Supabase ficam disponíveis na próxima visita, sem esperar revalidação de cache. Cada visita faz leituras ao Supabase e conta para os limites do plano utilizado. Em desenvolvimento, `npm run dev` usa o runtime Next.js; `npm run cf:build` e `npm run cf:preview` verificam o Worker. Esta configuração não requer R2 nem Durable Objects.

## Comandos úteis

```bash
npm run typecheck
npm run build
npm run cf:build
npm run cf:preview
```

## Funcionalidades

- Perfil responsivo com avatar, bio, selo opcional, redes sociais e cinco presets visuais.
- Links com estado ativo, destaque, início/fim agendado e ordenação por arrastar.
- Players expansíveis de YouTube, Spotify, SoundCloud e Apple Music quando a URL é compatível.
- Upload de avatar e favicon no Supabase Storage.
- Visão geral com visualizações, cliques, CTR, evolução diária, links populares, dispositivo e país.

## Notas operacionais

- Datas de agendamento são informadas no horário local do navegador e gravadas em UTC.
- A contagem de visualizações é aproximada: bloqueadores, cookies e navegadores privados alteram os números. Cliques são registrados antes do redirecionamento, mas uma indisponibilidade temporária do Supabase não impede o visitante de abrir o destino.
- Títulos, URLs e cores são validados no servidor. URLs de embeds só são criadas para domínios permitidos.
- A interface de login oferece e-mail/senha. OAuth pode ser adicionado posteriormente pelo Supabase Auth com callback dedicado.
