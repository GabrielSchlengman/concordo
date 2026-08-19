# Alpendre

Espaço de conversa para amigos com canais de texto e voz, chat com anexos, câmera, compartilhamento de tela e anotações sincronizadas. Funciona no navegador e como aplicativo para Windows.

## O que a versão 1.1 faz

- Servidor público Alpendre sempre disponível e servidores privados acessíveis apenas por código de convite.
- Dono do servidor pode copiar o convite, remover participantes, renomear canais e excluir o servidor; convidados podem sair.
- Isolamento de participantes, mensagens, chamadas, arquivos e desenhos entre espaços.
- Chamada WebRTC dentro do Alpendre, sem abrir Jitsi ou outra página.
- Microfone, câmera, compartilhamento, preview da própria tela, grade, foco e tela cheia.
- Indicador de fala, linha de sensibilidade, retorno do microfone e processamento solicitado ao navegador.
- Anotações com caneta, borracha e texto; cada participante desfaz e apaga apenas o que criou, enquanto quem compartilha pode limpar tudo.
- Chat com fotos, vídeos, áudios, PDF, texto e arquivos de até 8 MB; visualização, download e exclusão.
- Uma guia ativa por navegador para evitar visitantes duplicados e eco.
- Aplicativo desktop com seleção de tela e desenhos sobre a tela real compartilhada.
- Identidade visual própria com o macaco amarelo do Alpendre.

## Rodar localmente

Instale Node.js 18 ou mais recente e execute `npm start`. Depois abra `http://localhost:4173`.

No Windows também é possível abrir `Iniciar Alpendre.cmd`.

## Aplicativo para Windows

- `npm run desktop` abre em modo de desenvolvimento.
- `npm run package:win` gera `Alpendre-desktop-build/Alpendre-win32-x64`.
- O app publicado usa `https://lume-app-ym0d.onrender.com` por enquanto.
- Para servidor local, use `ALPENDRE_USE_LOCAL=1`.

## TURN seguro

O WebRTC tenta conexão direta por STUN. Para funcionar de forma confiável entre redes diferentes e esconder o IP dos participantes, configure um relay TURN no Render. São aceitas estas opções:

- Cloudflare TURN: `CLOUDFLARE_TURN_KEY_ID` e `CLOUDFLARE_TURN_API_TOKEN`.
- TURN próprio: `TURN_URLS`, `TURN_USERNAME` e `TURN_CREDENTIAL`.
- Metered: `METERED_TURN_URL`.

As credenciais permanentes ficam somente no servidor. O navegador recebe credenciais temporárias quando o provedor oferece esse recurso.

## Limitações atuais

- Espaços, perfis e mensagens ficam em memória e podem sumir quando o Render reiniciar.
- Anexos expiram em até 24 horas e o armazenamento temporário total é limitado a 64 MB.
- O plano gratuito do Render pode adormecer e demorar para abrir.
- Chamadas com muitos participantes ainda usam uma conexão por pessoa; uma SFU será necessária para grupos grandes.

Próxima etapa: banco de dados gratuito para persistência, contas e permissões dos espaços.
