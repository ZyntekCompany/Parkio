import { formatToCOP } from "@/utils/format-to-cop";
import {
  TransactionalEmailsApi,
  SendSmtpEmail,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { DateTime } from "luxon";

// Función para formatear la fecha en español en la zona horaria de Colombia
function formatColombianDate(date: Date): string {
  const timeZone = "America/Bogota"; // Zona horaria de Colombia
  // Crear un objeto DateTime y ajustarlo a la zona horaria de Colombia
  const zonedDate = DateTime.fromJSDate(date).setZone(timeZone);

  // Formatear la fecha en el formato deseado
  return zonedDate.toFormat("d 'de' MMMM, yyyy, h:mm a", { locale: "es" });
}

// Instanciar API de correos
const apiInstance = new TransactionalEmailsApi();

// Establecer la clave de la API
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

const smtpEmail = new SendSmtpEmail();

export async function monthlyPaymentEmail(
  email: string,
  name: string,
  startDate: Date,
  endDate: Date,
  totalPaid: number,
  parkingName: string
) {
  const formattedStartDate = formatColombianDate(startDate);
  const formattedEndDate = formatColombianDate(endDate);
  const formattedTotalPaid = formatToCOP(totalPaid);

  smtpEmail.subject = "Confirmación de Pago de Mensualidad";
  smtpEmail.to = [{ email: email, name: name }];
  smtpEmail.htmlContent = `
   <html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Servicio Mensual</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
        body { font-family: 'Open Sans', Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; color: #333; line-height: 1.6; }
        .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #003366; color: #ffffff; padding: 17px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .content { padding: 30px; }
        h1 { margin: 0; font-size: 24px; font-weight: 600; }
        p { margin-bottom: 15px; font-size: 16px; color: #555; }
        .details { margin: 20px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0; }
        .details p { margin: 10px 0; font-size: 15px; color: #444; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; font-size: 14px; color: #777; border-top: 1px solid #e0e0e0; }
        .footer p { margin: 5px 0; }
        .footer a { color: #003366; text-decoration: none; }
        .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Confirmación de Servicio Mensual</h1>
        </div>
        <div class="content">
            <p>Estimado/a ${name},</p>
            <p>Nos complace confirmar que hemos recibido su pago de mensualidad para el servicio de estacionamiento en ${parkingName}. Agradecemos su confianza en nuestros servicios.</p>

            <div class="details">
                <p><strong>Cliente:</strong> ${name}</p>
                <p><strong>Período de Servicio:</strong> ${formattedStartDate} - ${formattedEndDate}</p>
                <p><strong>Monto Total Pagado:</strong> ${formattedTotalPaid}</p>
            </div>

            <p>Si tiene alguna pregunta o requiere información adicional, no dude en ponerse en contacto con nuestro equipo de atención al cliente. Estamos a su disposición para asistirle.</p>

            <div class="footer">
                <p>Atentamente,</p>
                <p><strong>Equipo de ${parkingName}</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
  smtpEmail.sender = { name: parkingName, email: "jamesrgal@gmail.com" };

  try {
    // Enviar el correo transaccional
    await apiInstance.sendTransacEmail(smtpEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export async function sendEmployeeCredentialsEmail(
  email: string,
  name: string,
  temporaryPassword: string,
  parkingName: string
) {
  // Construye la URL base dinámicamente
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.HOST
    ? `https://${process.env.HOST}`
    : 'http://localhost:3000'; // Fallback para desarrollo local

  const loginUrl = `${baseUrl}/login`;

  smtpEmail.subject = `Credenciales de Acceso - ${parkingName}`;
  smtpEmail.to = [{ email: email, name: name }];
  smtpEmail.htmlContent = `
   <html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credenciales de Acceso</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap');
        body { font-family: 'Open Sans', Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; color: #333; line-height: 1.6; }
        .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background-color: #003366; color: #ffffff; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; }
        .content { padding: 30px; }
        h1 { margin: 0; font-size: 24px; font-weight: 600; }
        p { margin-bottom: 15px; font-size: 16px; color: #555; }
        .credentials-box { 
            margin: 25px 0; 
            padding: 20px; 
            background-color: #f8f9fa; 
            border-radius: 8px; 
            border: 1px solid #e0e0e0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .credentials-box p { 
            margin: 12px 0; 
            font-size: 15px; 
            color: #444;
            padding: 8px;
        }
        .security-notice {
            margin: 20px 0;
            padding: 15px;
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            border-radius: 4px;
        }
        .security-notice p {
            margin: 0;
            color: #856404;
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            padding: 20px; 
            font-size: 14px; 
            color: #777; 
            border-top: 1px solid #e0e0e0; 
        }
        .footer p { margin: 5px 0; }
        .footer a { color: #003366; text-decoration: none; }
        .logo { max-width: 150px; height: auto; margin-bottom: 15px; }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #003366;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Credenciales de Acceso</h1>
        </div>
        <div class="content">
            <p>Estimado/a ${name},</p>
            <p>Le damos la bienvenida a ${parkingName}. Hemos creado su cuenta en nuestro sistema de gestión de parqueadero. A continuación encontrará sus credenciales de acceso:</p>

            <div class="credentials-box">
                <p><strong>Correo Electrónico:</strong> ${email}</p>
                <p><strong>Contraseña Temporal:</strong> ${temporaryPassword}</p>
            </div>

            <div class="security-notice">
                <p><strong>Importante:</strong> Por su seguridad, le recomendamos cambiar su contraseña inmediatamente después de iniciar sesión por primera vez en el sistema.</p>
            </div>

            <p>Para acceder, haga clic en el siguiente botón:</p>
            
            <a href="${loginUrl}" class="button">Acceder al Sistema</a>

            <p>Si tiene alguna dificultad para acceder a su cuenta o necesita asistencia adicional, no dude en contactar a nuestro equipo de soporte técnico.</p>

            <div class="footer">
                <p>Atentamente,</p>
                <p><strong>Equipo de ${parkingName}</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
  smtpEmail.sender = { name: parkingName, email: "jamesrgal@gmail.com" };

  try {
    // Enviar el correo transaccional
    await apiInstance.sendTransacEmail(smtpEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
