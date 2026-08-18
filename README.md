# Concord

MVP de uma comunidade em tempo real inspirado na experiência de aplicativos como o Discord. Inclui canais, chat, presença, chamadas P2P, câmera, microfone e compartilhamento de tela. O projeto pode ser usado no navegador ou como aplicativo desktop.

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
- Lista de pessoas conectadas em cada sala.
- Salas de voz com áudio e vídeo via WebRTC.
- Ativar/desativar microfone e câmera.
- Compartilhar a tela durante a chamada.
- Destaque automático de compartilhamentos, visualização em grade e tela cheia.
- Indicador visual de quem está falando e medidor de microfone.
- Configurações de entrada, saída, câmera, sensibilidade e qualidade de transmissão.
- Copiar um link de convite.
- Interface responsiva sem dependências externas.

## Limitações intencionais do MVP

- Contas, servidores e mensagens não são salvos em banco de dados.
- As chamadas usam conexão P2P, adequada para pequenos grupos.
- Para funcionar bem pela internet, será necessário adicionar HTTPS e um servidor TURN.
- Para grupos maiores, a chamada deve migrar de P2P para uma arquitetura SFU.

## Próximas etapas sugeridas

1. Autenticação e banco de dados persistente.
2. Servidores criados pelo usuário, convites e permissões.
3. Upload de arquivos, reações e mensagens privadas.
4. Infraestrutura de mídia SFU para chamadas maiores.
5. Empacotamento desktop e notificações do sistema.

