import { resend } from "@/lib/email";

interface EmailTemplateReplacements {
  [key: string]: string;
}

/**
 * Envia um e-mail usando um template HTML
 * @param to - Endereço de e-mail do destinatário
 * @param subject - Assunto do e-mail
 * @param templatePath - Caminho para o arquivo de template HTML (ou URL)
 * @param replacements - Objeto com as substituições a serem feitas no template
 * @returns Promise com o resultado do envio
 */
export async function sendEmailWithTemplate(
  to: string,
  subject: string,
  templatePath: string,
  replacements: EmailTemplateReplacements
) {
  try {
    let templateHtml: string;

    if (
      templatePath.startsWith("http://") ||
      templatePath.startsWith("https://")
    ) {
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch template from URL: ${templatePath}`);
      }
      templateHtml = await response.text();
    } else {
      const fs = await import("fs/promises");
      const path = await import("path");
      const fullPath = path.resolve(process.cwd(), templatePath);
      templateHtml = await fs.readFile(fullPath, "utf-8");
    }

    let processedHtml = templateHtml;
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${key}}}|{${key}}`, "g");
      processedHtml = processedHtml.replace(regex, value);
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>",
      to,
      subject,
      html: processedHtml,
    });

    return result;
  } catch (error) {
    console.error("Error sending email with template:", error);
    throw error;
  }
}

export const defaultVerificationTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>{{heading}}</h1>
    <p>{{message}}</p>
    <a href="{{url}}" class="button">{{buttonText}}</a>
    <p style="font-size: 14px; color: #666;">
      Se o botão não funcionar, copie e cole este link no seu navegador:<br>
      {{url}}
    </p>
  </div>
  <div class="footer">
    <p>Este é um e-mail automático, por favor não responda.</p>
    <p>&copy; {{year}} {{appName}}. Todos os direitos reservados.</p>
  </div>
</body>
</html>
`;

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string,
  userName?: string
) {
  const replacements = {
    title: "Verificação de E-mail",
    heading: `Olá${userName ? ` ${userName}` : ""}!`,
    message:
      "Obrigado por se registrar. Por favor, clique no botão abaixo para verificar seu endereço de e-mail.",
    url: verificationUrl,
    buttonText: "Verificar E-mail",
    year: new Date().getFullYear().toString(),
    appName: "Pass Red Seal",
  };

  const fs = await import("fs/promises");
  const path = await import("path");
  const templateDir = path.join(process.cwd(), "src", "templates");
  const templatePath = path.join(templateDir, "verification-email.html");

  try {
    await fs.mkdir(templateDir, { recursive: true });

    try {
      await fs.access(templatePath);
    } catch {
      await fs.writeFile(templatePath, defaultVerificationTemplate, "utf-8");
    }

    return await sendEmailWithTemplate(
      email,
      "Verificação de E-mail - Pass Red Seal",
      templatePath,
      replacements
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}
