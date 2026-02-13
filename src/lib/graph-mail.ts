interface GraphMailConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  senderUser: string;
  receiverEmail: string;
}

interface ContactEmailPayload {
  name: string;
  email: string;
  subject: string;
  subjectLabel: string;
  message: string;
  ip: string;
  userAgent: string;
  submittedAtIso: string;
  attachment?: File;
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getConfig(): GraphMailConfig {
  return {
    tenantId: getRequiredEnv('MS_TENANT_ID'),
    clientId: getRequiredEnv('MS_CLIENT_ID'),
    clientSecret: getRequiredEnv('MS_CLIENT_SECRET'),
    senderUser: getRequiredEnv('MS_SENDER_USER'),
    receiverEmail: (process.env.CONTACT_RECEIVER_EMAIL ?? 'info@ultraction.ae').trim(),
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function fetchAccessToken(config: GraphMailConfig): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token;
  }

  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: 'https://graph.microsoft.com/.default',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Microsoft token request failed (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token || !data.expires_in) {
    throw new Error('Microsoft token response was missing required fields.');
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return tokenCache.token;
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const config = getConfig();
  const accessToken = await fetchAccessToken(config);

  const emailSubject = `[ULTRACTION Contact] ${payload.subjectLabel} - ${payload.name}`;
  const attachmentInfo = payload.attachment
    ? `<p><strong>Attachment:</strong> ${escapeHtml(payload.attachment.name)} (${(payload.attachment.size / 1024).toFixed(2)} KB)</p>`
    : '';
  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Topic:</strong> ${escapeHtml(payload.subjectLabel)} (${escapeHtml(payload.subject)})</p>
    <p><strong>Submitted At:</strong> ${escapeHtml(payload.submittedAtIso)}</p>
    <p><strong>IP:</strong> ${escapeHtml(payload.ip)}</p>
    <p><strong>User Agent:</strong> ${escapeHtml(payload.userAgent)}</p>
    ${attachmentInfo}
    <hr />
    <p><strong>Message</strong></p>
    <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${escapeHtml(payload.message)}</pre>
  `;

  // Build attachments array for Microsoft Graph
  const attachments = payload.attachment
    ? [
        {
          '@odata.type': '#microsoft.graph.fileAttachment',
          name: payload.attachment.name,
          contentType: payload.attachment.type || 'application/octet-stream',
          contentBytes: await payload.attachment
            .arrayBuffer()
            .then((buffer) => Buffer.from(buffer).toString('base64')),
          size: payload.attachment.size,
        },
      ]
    : [];

  const graphBody: Record<string, unknown> = {
    message: {
      subject: emailSubject,
      body: {
        contentType: 'HTML',
        content: htmlContent,
      },
      toRecipients: [
        {
          emailAddress: {
            address: config.receiverEmail,
          },
        },
      ],
      replyTo: [
        {
          emailAddress: {
            address: payload.email,
            name: payload.name,
          },
        },
      ],
      hasAttachments: attachments.length > 0,
    },
    saveToSentItems: true,
  };

  // Add attachments if present
  if (attachments.length > 0) {
    (graphBody.message as Record<string, unknown>).attachments = attachments;
  }

  const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.senderUser)}/sendMail`;
  const response = await fetch(sendMailUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Microsoft Graph sendMail failed (${response.status}): ${errorText}`);
  }
}
