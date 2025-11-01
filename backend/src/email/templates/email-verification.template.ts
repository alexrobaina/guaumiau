export interface EmailVerificationData {
  username: string;
  verificationUrl: string;
}

export const emailVerificationTemplate = (data: EmailVerificationData): {html: string; text: string} => {
  const {username, verificationUrl} = data;

  return {
    html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifica tu correo electrónico - Guaumiau</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f4f4f4;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 10px;
    }
    .logo-icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .header-subtitle {
      color: #ffffff;
      font-size: 16px;
      opacity: 0.95;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 600;
      color: #1F2937;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #4B5563;
      line-height: 1.8;
      margin-bottom: 30px;
    }
    .cta-container {
      text-align: center;
      margin: 40px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
    }
    .alternative-link {
      margin-top: 30px;
      padding: 20px;
      background-color: #F3F4F6;
      border-radius: 8px;
      border-left: 4px solid #10B981;
    }
    .alternative-link p {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 10px;
    }
    .link-text {
      font-size: 12px;
      color: #10B981;
      word-break: break-all;
      font-family: monospace;
      background-color: #ffffff;
      padding: 8px;
      border-radius: 4px;
    }
    .expiry-notice {
      margin-top: 30px;
      padding: 15px;
      background-color: #FEF3C7;
      border-left: 4px solid #F59E0B;
      border-radius: 4px;
    }
    .expiry-notice p {
      font-size: 14px;
      color: #92400E;
      margin: 0;
    }
    .footer {
      background-color: #F9FAFB;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E5E7EB;
    }
    .footer-text {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 15px;
    }
    .footer-links {
      margin: 20px 0;
    }
    .footer-link {
      color: #10B981;
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    .social-icons {
      margin-top: 20px;
    }
    .social-icon {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin: 0 5px;
      background-color: #10B981;
      border-radius: 50%;
      text-align: center;
      line-height: 32px;
      color: #ffffff;
      text-decoration: none;
    }
    .copyright {
      font-size: 12px;
      color: #9CA3AF;
      margin-top: 20px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .header, .content, .footer {
        padding: 20px;
      }
      .greeting {
        font-size: 20px;
      }
      .message {
        font-size: 14px;
      }
      .cta-button {
        padding: 14px 30px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo-icon">🐾</div>
      <div class="logo">Guaumiau</div>
      <div class="header-subtitle">Cuidado de mascotas con amor</div>
    </div>

    <!-- Content -->
    <div class="content">
      <h1 class="greeting">¡Hola ${username}!</h1>

      <p class="message">
        ¡Bienvenido a Guaumiau! Estamos emocionados de tenerte en nuestra comunidad de amantes de las mascotas.
      </p>

      <p class="message">
        Para comenzar a usar tu cuenta y acceder a todos los servicios de cuidado de mascotas, necesitamos verificar tu dirección de correo electrónico.
      </p>

      <!-- CTA Button -->
      <div class="cta-container">
        <a href="${verificationUrl}" class="cta-button">
          ✓ Verificar mi correo electrónico
        </a>
      </div>

      <!-- Alternative Link -->
      <div class="alternative-link">
        <p><strong>¿El botón no funciona?</strong></p>
        <p>Copia y pega este enlace en tu navegador:</p>
        <div class="link-text">${verificationUrl}</div>
      </div>

      <!-- Expiry Notice -->
      <div class="expiry-notice">
        <p>⏰ <strong>Este enlace expirará en 24 horas.</strong> Si no verificas tu correo antes de ese tiempo, deberás solicitar un nuevo enlace de verificación.</p>
      </div>

      <p class="message" style="margin-top: 30px;">
        Si no creaste una cuenta en Guaumiau, puedes ignorar este correo de forma segura.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        ¿Necesitas ayuda? Contáctanos en
        <a href="mailto:soporte@guaumiau.com" style="color: #10B981; text-decoration: none;">soporte@guaumiau.com</a>
      </p>

      <div class="footer-links">
        <a href="https://guaumiau.com/terminos" class="footer-link">Términos de Servicio</a>
        <span style="color: #D1D5DB;">|</span>
        <a href="https://guaumiau.com/privacidad" class="footer-link">Política de Privacidad</a>
        <span style="color: #D1D5DB;">|</span>
        <a href="https://guaumiau.com/ayuda" class="footer-link">Centro de Ayuda</a>
      </div>

      <div class="social-icons">
        <a href="https://facebook.com/guaumiau" class="social-icon">f</a>
        <a href="https://instagram.com/guaumiau" class="social-icon">📷</a>
        <a href="https://twitter.com/guaumiau" class="social-icon">🐦</a>
      </div>

      <p class="copyright">
        © ${new Date().getFullYear()} Guaumiau. Todos los derechos reservados.
        <br>
        Cuidado de mascotas profesional y confiable
      </p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
¡Hola ${username}!

¡Bienvenido a Guaumiau! 🐾

Estamos emocionados de tenerte en nuestra comunidad de amantes de las mascotas.

Para comenzar a usar tu cuenta y acceder a todos los servicios de cuidado de mascotas, necesitamos verificar tu dirección de correo electrónico.

VERIFICAR CORREO ELECTRÓNICO
Haz clic en el siguiente enlace para verificar tu correo:
${verificationUrl}

⏰ IMPORTANTE: Este enlace expirará en 24 horas.

Si no creaste una cuenta en Guaumiau, puedes ignorar este correo de forma segura.

---

¿Necesitas ayuda?
Contáctanos en soporte@guaumiau.com

Términos de Servicio: https://guaumiau.com/terminos
Política de Privacidad: https://guaumiau.com/privacidad
Centro de Ayuda: https://guaumiau.com/ayuda

© ${new Date().getFullYear()} Guaumiau. Todos los derechos reservados.
Cuidado de mascotas profesional y confiable
    `,
  };
};
