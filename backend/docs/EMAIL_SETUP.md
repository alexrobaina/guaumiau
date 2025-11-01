# Email Configuration Guide

This guide explains how to configure email sending in the Guaumiau application using Nodemailer.

## Overview

The application uses **Nodemailer** to send transactional emails including:
- Email verification on user registration
- Password reset requests
- Welcome emails (optional)

## Email Templates

Professional HTML email templates are located in `src/email/templates/`:
- `email-verification.template.ts` - Email verification with clickable link
- `password-reset.template.ts` - Password reset with secure link
- `welcome.template.ts` - Welcome message for new users

All templates include:
- Responsive design (mobile-friendly)
- Professional Guaumiau branding (gradient header, pet paw icon)
- Both HTML and plain text versions
- Security warnings and expiration notices
- Social media links and footer

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```bash
# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Guaumiau <noreply@guaumiau.com>

# Frontend URL for email links
# For mobile app deep links (recommended): guaumiau://
# For web app: http://localhost:8081 or https://yourdomain.com
FRONTEND_URL=guaumiau://

# JWT Secrets (required for token generation)
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=refresh-secret-change-in-production
```

**Important**: Set `FRONTEND_URL=guaumiau://` to use deep links that open the mobile app directly. This creates URLs like:
- `guaumiau://verify-email?token=abc123` (opens mobile app)
- `guaumiau://reset-password?token=xyz789` (opens mobile app)

For web applications, use: `FRONTEND_URL=http://localhost:8081` (development) or `https://yourdomain.com` (production).

The email service automatically detects deep link schemes and formats URLs correctly.

### Gmail Setup

If using Gmail, you need to create an **App Password**:

1. Go to your Google Account settings
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App passwords** under "Signing in to Google"
5. Generate a new app password for "Mail"
6. Use this 16-character password in `EMAIL_PASSWORD`

**Important**: Never use your actual Gmail password. Always use an App Password.

### Other SMTP Providers

#### SendGrid
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASSWORD=your-mailgun-smtp-password
```

#### Amazon SES
```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
```

## Development Mode

If email credentials are not configured, the application will run in **development mode**:
- Emails will not be sent
- Email content and verification links will be logged to the console
- Tokens will be displayed in logs for testing

Example console output:
```
[EmailService] WARN [DEV MODE] Verification email would be sent to: user@example.com
[EmailService] WARN [DEV MODE] Verification URL: http://localhost:3000/verify-email?token=abc123...
[EmailService] WARN [DEV MODE] Verification Token: abc123...
```

## Testing Email Sending

### Using MailHog (Local Development)

MailHog is a fake SMTP server for testing emails locally:

1. Install MailHog:
   ```bash
   # macOS
   brew install mailhog

   # Or use Docker
   docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
   ```

2. Configure `.env`:
   ```bash
   EMAIL_HOST=localhost
   EMAIL_PORT=1025
   EMAIL_SECURE=false
   EMAIL_USER=
   EMAIL_PASSWORD=
   ```

3. Access MailHog UI at `http://localhost:8025` to see sent emails

### Using Mailtrap

Mailtrap is another email testing service:

1. Sign up at https://mailtrap.io
2. Get SMTP credentials from your inbox
3. Configure `.env`:
   ```bash
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   ```

## Email Service API

### Methods

```typescript
// Send email verification
await emailService.sendEmailVerification(
  email: string,
  verificationToken: string,
  username: string
);

// Send password reset
await emailService.sendPasswordResetEmail(
  email: string,
  resetToken: string
);

// Send welcome email (optional)
await emailService.sendWelcomeEmail(
  email: string,
  username: string
);
```

## Security Best Practices

1. **Never commit credentials**: Keep `.env` file in `.gitignore`
2. **Use App Passwords**: Don't use your actual email password
3. **Rotate secrets**: Change JWT secrets in production
4. **Enable TLS**: Use `EMAIL_SECURE=true` with port 465 for TLS
5. **Rate limiting**: Email endpoints have throttling enabled
6. **Token expiration**:
   - Email verification: 24 hours
   - Password reset: 1 hour

## Troubleshooting

### Emails not sending

1. **Check configuration**:
   ```bash
   # Verify email service is configured
   grep "Email service configured successfully" logs
   ```

2. **Check SMTP credentials**:
   - Verify `EMAIL_USER` and `EMAIL_PASSWORD`
   - For Gmail, ensure App Password is correct
   - Check if 2FA is enabled (required for Gmail App Passwords)

3. **Check firewall/network**:
   - Ensure port 587 (or 465) is not blocked
   - Try different SMTP ports

4. **Check logs**:
   ```bash
   # Look for email-related errors
   grep "EmailService" logs
   ```

### Gmail "Less secure app access" error

Gmail no longer supports "less secure apps". You must:
1. Enable 2-Step Verification
2. Generate an App Password
3. Use the App Password in `EMAIL_PASSWORD`

### Invalid credentials error

```
Failed to send email: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Solution**: Verify your SMTP credentials are correct and that you're using an App Password (for Gmail).

## Production Checklist

Before deploying to production:

- [ ] Configure production SMTP server (not Gmail)
- [ ] Set `EMAIL_FROM` to your domain (e.g., `noreply@guaumiau.com`)
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Generate strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Test email delivery end-to-end
- [ ] Monitor email delivery logs
- [ ] Set up SPF, DKIM, and DMARC records for your domain
- [ ] Configure email rate limiting if needed
- [ ] Set up email bounce handling

## Template Customization

To customize email templates:

1. Edit template files in `src/email/templates/`
2. Modify HTML structure, colors, or content
3. Test in multiple email clients
4. Ensure both HTML and plain text versions are updated

Example:
```typescript
// src/email/templates/email-verification.template.ts
export const emailVerificationTemplate = (data: EmailVerificationData) => {
  return {
    html: `<!-- Your custom HTML -->`,
    text: `Your custom plain text`
  };
};
```

## Support

For email configuration issues, check:
- NestJS Mailer documentation: https://docs.nestjs.com/recipes/mailer
- Nodemailer documentation: https://nodemailer.com
- SMTP provider documentation
