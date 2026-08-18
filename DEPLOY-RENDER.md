# Publicar o Concord gratuitamente

Este projeto já está configurado para o plano gratuito do Render.

## O que você precisa

- Uma conta gratuita no GitHub.
- Uma conta gratuita no Render.
- O pacote `Concord-Cloud-Render.zip`.

## Publicação

1. Extraia `Concord-Cloud-Render.zip`.
2. Crie um repositório novo no GitHub chamado `concordo`.
3. Envie todos os arquivos extraídos para a raiz desse repositório.
4. No Render, escolha **New → Blueprint**.
5. Conecte o repositório `concordo`.
6. Confirme a criação do serviço no plano **Free**. O serviço atual ainda se chama `lume-app` apenas para manter o endereço público funcionando.
7. Aguarde o deploy terminar e abra o endereço `https://...onrender.com` mostrado pelo Render.

Não é necessário configurar variáveis secretas nesta versão.

## Comportamento do plano gratuito

- O serviço pode adormecer após ficar sem uso.
- A primeira abertura depois desse período pode demorar cerca de um minuto.
- Enquanto houver pessoas usando o Concord, o aplicativo envia verificações periódicas para manter o serviço ativo.
- O histórico atual fica apenas na memória e pode desaparecer quando o serviço reinicia.
- Fotos, áudios e arquivos também ficam temporariamente na memória e podem expirar em até 24 horas.

## Depois de publicar

Guarde o endereço `https://...onrender.com`. Ele é o link que você compartilhará com outras pessoas. Também será usado para configurar a próxima versão do aplicativo desktop.
