# Concord

Comunidade em tempo real inspirada na experiência de aplicativos como o Discord. Inclui canais, chat com anexos e mensagens de voz, presença global, chamadas P2P, câmera, microfone, compartilhamento de tela e anotações colaborativas. O projeto pode ser usado no navegador ou como aplicativo desktop.

## Aplicativo desktop

Após instalar as dependências com `pnpm install` ou `npm install`:

- Execute `pnpm desktop` para abrir o aplicativo em modo de desenvolvimento.
- Execute `pnpm package:win` para gerar o aplicativo portátil para Windows.

O executável será criado dentro da pasta vizinha `Concord-desktop-build/Concord-win32-x64`.

Na versão pronta, extraia o arquivo `Concord-Desktop-Windows.zip` inteiro e abra `Concord.exe`. Os arquivos da pasta `resources` devem permanecer junto do executável.

A versão desktop pronta se conecta ao servidor público `https://lume-app-ym0d.onrender.com`. Seu computador não hospeda as salas. Para desenvolvimento local, execute com a variável `CONCORD_USE_LOCAL=1`.

## Como abrir

1. Instale o Node.js 18 ou mais recente.
2. No Windows, dê dois cliques em `Iniciar Concord.cmd`.
3. Como alternativa, abra um terminal nesta pasta e execute `npm start`.
4. Acesse `http://localhost:4173` no Chrome, Edge ou Firefox.

Para testar a conversa e a chamada sozinho, abra o endereço em duas janelas diferentes. Use uma janela normal e outra anônima para definir nomes diferentes.

## Testar em outros computadores da mesma rede

O servidor aceita conexões da rede local. Descubra o endereço IP do computador que está executando o Concord e abra `http://SEU-IP:4173` nos demais dispositivos.

Alguns navegadores só liberam câmera, microfone e compartilhamento de tela em `localhost` ou em uma conexão HTTPS. Para uso fora do computador local, o próximo passo é publicar o projeto com HTTPS.

## O que esta versão já faz

- Canais de texto com histórico recente em memória.
- Envio de fotos, áudios, mensagens de voz e arquivos de até 8 MB por clique, colagem ou arrastar e soltar.
- Lista de pessoas conectadas no texto e em cada canal de voz.
- Áudio e vídeo via WebRTC com STUN/TURN, reconexão e renegociação automáticas, com modo de proteção de IP por retransmissão ativado por padrão.
- Microfone, câmera, ensurdecimento do fone e volume geral ou individual.
- Menu por participante no botão direito para silenciar, ajustar volume, esconder vídeo ou priorizar.
- Compartilhamento de tela com preview local opcional.
- Anotações sincronizadas por cima da tela compartilhada com caneta, borracha, texto, desfazer e apagar tudo.
- Controle do compartilhador para permitir ou bloquear anotações dos participantes.
- Destaque automático de compartilhamentos, visualização em grade, modo foco e tela cheia.
- Indicador visual de quem está falando e teste real de retorno do microfone.
- Supressão de ruído, cancelamento de eco e controle de ganho aplicados às trilhas compatíveis.
- Foto de perfil e configurações de entrada, saída, câmera e qualidade de transmissão.
- Sons suaves e diferentes para entrada, saída, compartilhamento, microfone e fone.
- Interface responsiva sem dependências externas.

## Limitações intencionais do MVP

- Contas, servidores e mensagens não são salvos em banco de dados.
- Os anexos ficam temporariamente na memória do serviço, podem expirar em até 24 horas e somam no máximo 64 MB nesta versão gratuita.
- As chamadas usam conexão P2P, adequada para pequenos grupos.
- O TURN público incluído é um fallback gratuito; para disponibilidade garantida, configure credenciais próprias pelas variáveis `TURN_URLS`, `TURN_USERNAME` e `TURN_CREDENTIAL` no Render.
- Para grupos maiores, a chamada deve migrar de P2P para uma arquitetura SFU.

## Próximas etapas sugeridas

1. Autenticação e banco de dados persistente.
2. Servidores criados pelo usuário, convites e permissões.
3. Reações, respostas e mensagens privadas.
4. Infraestrutura de mídia SFU para chamadas maiores.
5. Empacotamento desktop e notificações do sistema.
