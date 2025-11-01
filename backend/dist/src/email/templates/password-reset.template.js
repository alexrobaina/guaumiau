"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetTemplate = void 0;
const passwordResetTemplate = (data) => {
    const { resetUrl } = data;
    return {
        html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contraseña - Guaumiau</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo { font-size: 32px; font-weight: bold; color: #fff; }
    .logo-icon { font-size: 48px; margin-bottom: 10px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 20px; }
    .message { font-size: 16px; color: #4B5563; line-height: 1.8; margin-bottom: 20px; }
    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .alternative-link {
      margin-top: 30px;
      padding: 20px;
      background-color: #F3F4F6;
      border-radius: 8px;
      border-left: 4px solid #EF4444;
    }
    .link-text {
      font-size: 12px;
      color: #EF4444;
      word-break: break-all;
      font-family: monospace;
      background-color: #fff;
      padding: 8px;
      border-radius: 4px;
    }
    .warning {
      margin-top: 30px;
      padding: 15px;
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      border-radius: 4px;
      font-size: 14px;
      color: #92400E;
    }
    .footer {
      background-color: #F9FAFB;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
      font-size: 14px;
      color: #6B7280;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo-icon">🔐</div>
      <div class="logo">Guaumiau</div>
    </div>
    <div class="content">
      <h1 class="greeting">Restablecimiento de Contraseña</h1>
      <p class="message">
        Recibimos una solicitud para restablecer la contraseña de tu cuenta Guaumiau.
      </p>
      <p class="message">
        Haz clic en el botón de abajo para crear una nueva contraseña:
      </p>
      <center>
        <a href="${resetUrl}" class="cta-button">🔑 Restablecer Contraseña</a>
      </center>
      <div class="alternative-link">
        <p><strong>¿El botón no funciona?</strong></p>
        <p>Copia y pega este enlace en tu navegador:</p>
        <div class="link-text">${resetUrl}</div>
      </div>
      <div class="warning">
        <p>⏰ <strong>Este enlace expirará en 1 hora.</strong></p>
        <p style="margin-top: 10px;">
          Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu contraseña no será modificada.
        </p>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Guaumiau. Todos los derechos reservados.</p>
      <p style="margin-top: 10px;">
        Si necesitas ayuda, contáctanos en <a href="mailto:soporte@guaumiau.com" style="color: #10B981;">soporte@guaumiau.com</a>
      </p>
    </div>
  </div>
</body>
</html>
    `,
        text: `
Restablecimiento de Contraseña - Guaumiau

Recibimos una solicitud para restablecer la contraseña de tu cuenta Guaumiau.

Haz clic en el siguiente enlace para crear una nueva contraseña:
${resetUrl}

⏰ IMPORTANTE: Este enlace expirará en 1 hora.

Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu contraseña no será modificada.

---

© ${new Date().getFullYear()} Guaumiau. Todos los derechos reservados.
Si necesitas ayuda, contáctanos en soporte@guaumiau.com
    `,
    };
};
exports.passwordResetTemplate = passwordResetTemplate;
//# sourceMappingURL=password-reset.template.js.map