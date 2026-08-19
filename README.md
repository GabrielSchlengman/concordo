# Concord

Comunidade em tempo real inspirada na experiência de aplicativos como o Discord. Inclui canais, chat com anexos e mensagens de voz, presença global e chamadas hospedadas com câmera, microfone e compartilhamento de tela. O projeto pode ser usado no navegador ou como aplicativo desktop.

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
- Uma única guia ativa por instalação do navegador, evitando visitantes duplicados, eco e disputa pelo microfone sem usar identificação do hardware.
- Envio de fotos, áudios, mensagens de voz e arquivos de até 8 MB por clique, colagem ou arrastar e soltar.
- Imagens, vídeos, áudios, PDF e texto podem ser visualizados no Concord; todos os anexos têm opção de download.
- Exclusão das próprias mensagens e anexos, rolagem livre do histórico e aviso de novas mensagens sem puxar a tela à força.
- Lista de pessoas conectadas no texto e em cada canal de voz.
- Áudio, vídeo e compartilhamento de tela incorporados pelo Jitsi Meet, evitando a dependência do Open Relay público que deixava a tela preta e o áudio preso entre redes diferentes.
- Microfone, câmera, grade, foco, tela cheia, escolha de dispositivos e qualidade pelos controles integrados da chamada.
- Ensurdecimento geral no Concord e controles de cada participante pelo painel da chamada.
- Botão para reabrir a mídia e alternativa para abrir a mesma sala em uma janela separada caso o navegador bloqueie o quadro incorporado.
- O código do modo direto e das anotações sincronizadas foi preservado para evolução futura, mas as anotações ficam desativadas no modo hospedado porque o navegador isola a transmissão externa.
- Indicador visual de quem está falando, medidor ao vivo com linha de sensibilidade e teste real de retorno do microfone.
- Supressão de ruído acionada na chamada hospedada; cancelamento de eco e ganho ficam sob responsabilidade do navegador e do mecanismo de mídia do Jitsi.
- Foto de perfil e configurações de entrada, saída, câmera e qualidade de transmissão.
- Sons suaves e diferentes para entrada, saída, compartilhamento, microfone e fone.
- Interface responsiva, com o Jitsi Meet usado somente dentro do painel de chamada.

## Limitações intencionais do MVP

- Contas, servidores e mensagens não são salvos em banco de dados.
- Os anexos ficam temporariamente na memória do serviço, podem expirar em até 24 horas e somam no máximo 64 MB nesta versão gratuita.
- As chamadas usam a instância pública `meet.jit.si`, que não exige chave, conta nem hospedagem na máquina do usuário. O serviço é externo, não oferece garantia de disponibilidade e segue os limites de uso publicados pelo Jitsi.
- O nome interno de cada sala é aleatório por execução do servidor, reduzindo a chance de alguém adivinhar uma chamada. Quando o Render reinicia, as salas também são renovadas.
- O sistema direto antigo continua aceitando `TURN_URLS`, `TURN_USERNAME`, `TURN_CREDENTIAL`, `METERED_TURN_URL`, `CLOUDFLARE_TURN_KEY_ID` e `CLOUDFLARE_TURN_API_TOKEN`, mas não é usado como padrão na versão 0.9.

## Próximas etapas sugeridas

1. Autenticação e banco de dados persistente.
2. Servidores criados pelo usuário, convites e permissões.
3. Reações, respostas e mensagens privadas.
4. Infraestrutura de mídia SFU para chamadas maiores.
5. Empacotamento desktop e notificações do sistema.
