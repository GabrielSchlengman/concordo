# Publicar o Lume gratuitamente

Este projeto já está configurado para o plano gratuito do Render.

## O que você precisa

- Uma conta gratuita no GitHub.
- Uma conta gratuita no Render.
- O pacote `Lume-Cloud-Render.zip`.

## Publicação

1. Extraia `Lume-Cloud-Render.zip`.
2. Crie um repositório novo no GitHub chamado `lume-cloud`.
3. Envie todos os arquivos extraídos para a raiz desse repositório.
4. No Render, escolha **New → Blueprint**.
5. Conecte o repositório `lume-cloud`.
6. Confirme a criação do serviço `lume-app` no plano **Free**.
7. Aguarde o deploy terminar e abra o endereço `https://...onrender.com` mostrado pelo Render.

Não é necessário configurar variáveis secretas nesta versão.

## Comportamento do plano gratuito

- O serviço pode adormecer após ficar sem uso.
- A primeira abertura depois desse período pode demorar cerca de um minuto.
- Enquanto houver pessoas usando o Lume, o aplicativo envia verificações periódicas para manter o serviço ativo.
- O histórico atual fica apenas na memória e pode desaparecer quando o serviço reinicia.

## Depois de publicar

Guarde o endereço `https://...onrender.com`. Ele é o link que você compartilhará com outras pessoas. Também será usado para configurar a próxima versão do aplicativo desktop.

