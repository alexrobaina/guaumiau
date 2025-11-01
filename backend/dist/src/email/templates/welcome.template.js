"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcomeEmailTemplate = void 0;
const welcomeEmailTemplate = (data) => {
    const { username } = data;
    return {
        html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a Guaumiau</title>
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
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo { font-size: 32px; font-weight: bold; color: #fff; }
    .logo-icon { font-size: 48px; margin-bottom: 10px; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 20px; }
    .message { font-size: 16px; color: #4B5563; line-height: 1.8; margin-bottom: 20px; }
    .feature-list { margin: 30px 0; }
    .feature { padding: 15px; margin: 10px 0; background-color: #F3F4F6; border-radius: 8px; }
    .feature-icon { font-size: 24px; margin-right: 10px; }
    .cta-button {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
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
      <div class="logo-icon">🐾</div>
      <div class="logo">Guaumiau</div>
    </div>
    <div class="content">
      <h1 class="greeting">¡Bienvenido, ${username}!</h1>
      <p class="message">Gracias por unirte a Guaumiau, la plataforma que conecta a dueños de mascotas con cuidadores profesionales.</p>

      <div class="feature-list">
        <div class="feature">
          <span class="feature-icon">🔍</span>
          <strong>Encuentra cuidadores verificados</strong> en tu área
        </div>
        <div class="feature">
          <span class="feature-icon">📅</span>
          <strong>Programa servicios</strong> de paseos, cuidado y más
        </div>
        <div class="feature">
          <span class="feature-icon">💬</span>
          <strong>Comunícate directamente</strong> con los cuidadores
        </div>
        <div class="feature">
          <span class="feature-icon">⭐</span>
          <strong>Lee reseñas</strong> de otros dueños de mascotas
        </div>
      </div>

      <p class="message">¡Comienza hoy mismo a cuidar mejor de tu mascota!</p>
      <center>
        <a href="https://guaumiau.com/app" class="cta-button">Explorar Servicios</a>
      </center>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Guaumiau. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
    `,
        text: `
¡Bienvenido, ${username}!

Gracias por unirte a Guaumiau, la plataforma que conecta a dueños de mascotas con cuidadores profesionales.

Con Guaumiau puedes:
- 🔍 Encontrar cuidadores verificados en tu área
- 📅 Programar servicios de paseos, cuidado y más
- 💬 Comunicarte directamente con los cuidadores
- ⭐ Leer reseñas de otros dueños de mascotas

¡Comienza hoy mismo!
Visita: https://guaumiau.com/app

© ${new Date().getFullYear()} Guaumiau. Todos los derechos reservados.
    `,
    };
};
exports.welcomeEmailTemplate = welcomeEmailTemplate;
//# sourceMappingURL=welcome.template.js.map