# Publicar o Alpendre no Render

O projeto continua preparado para o plano gratuito do Render. O serviço atual ainda se chama `lume-app` para manter o endereço público funcionando.

## Publicação

1. Envie os arquivos para o repositório do GitHub.
2. No Render, abra o serviço `lume-app`.
3. Use **Manual Deploy → Deploy latest commit** se a publicação automática não começar.
4. Aguarde o status **Live** e abra `https://lume-app-ym0d.onrender.com`.

## Relay recomendado

Para a chamada funcionar entre redes diferentes, adicione no Render as variáveis secretas `CLOUDFLARE_TURN_KEY_ID` e `CLOUDFLARE_TURN_API_TOKEN`. Nunca coloque o token diretamente no código ou no GitHub.

Sem essas variáveis, o Alpendre ainda tenta conexão direta. Ela pode funcionar na mesma rede ou em alguns roteadores, mas não é garantida e não esconde totalmente o IP entre participantes.

## Banco gratuito opcional

Para impedir que espaços e mensagens sumam quando o Render reiniciar, execute `supabase/schema.sql` no SQL Editor do Supabase e adicione no Render:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

A service role é secreta e deve existir somente no ambiente do Render. Sem essas duas variáveis, o Alpendre usa a memória como antes.

## Plano gratuito

- O serviço pode adormecer quando não estiver sendo usado.
- Sem Supabase, espaços e histórico em memória podem desaparecer após reinício.
- Anexos continuam temporários nesta versão, mesmo com o banco configurado.
- O link público não depende do computador do criador ficar ligado.
