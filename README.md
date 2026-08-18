# Lume Cloud

Servidor público do Lume com chat, presença, chamadas P2P e compartilhamento de tela.

## Publicar gratuitamente

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/GabrielSchlengman/concordo)

1. Clique no botão **Deploy to Render** acima.
2. Entre ou crie uma conta gratuita no Render.
3. Autorize o acesso ao GitHub, caso seja solicitado.
4. Confirme o serviço `lume-app` no plano **Free**.
5. Aguarde a publicação terminar.

O Render mostrará um endereço parecido com `https://lume-app.onrender.com`. Esse será o link público para compartilhar.

## Plano gratuito

- O serviço pode adormecer depois de um período sem uso.
- A primeira abertura pode levar cerca de um minuto quando ele estiver adormecido.
- O histórico desta versão fica na memória e pode desaparecer quando o serviço reinicia.

## Diagnóstico

Depois da publicação, o endereço `/api/health` deve responder com:

```json
{"ok":true,"name":"Lume"}
```

