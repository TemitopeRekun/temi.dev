import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromOverride?: string;
};

/**
 * Escapes the five HTML-significant characters so user-supplied values (e.g. a
 * lead's name) cannot inject markup or break out of an attribute when
 * interpolated into an email body.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly apiKey: string;
  private readonly fromDefault: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>("RESEND_API_KEY") ?? "";
    this.fromDefault =
      this.config.get<string>("EMAIL_FROM") ?? "Temitope <hello@temitope.live>";
  }

  async sendEmail(input: SendEmailInput): Promise<void> {
    if (!this.apiKey) {
      this.logger.error("RESEND_API_KEY is not configured");
      return;
    }
    const from = input.fromOverride ?? this.fromDefault;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [input.to],
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        this.logger.error(
          `Resend error: ${res.status} ${res.statusText} ${body}`,
        );
      }
    } catch (err) {
      this.logger.error(
        "Resend request failed",
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  async sendLeadConfirmation(to: string, name: string): Promise<void> {
    const subject = "We received your inquiry";
    // Escape the name for the HTML body; the plain-text part needs no escaping.
    const safeName = escapeHtml(name);
    const html = `<p>Hi ${safeName},</p><p>Thanks for reaching out. I received your message and will respond shortly.</p><p>– Temitope</p>`;
    const text = `Hi ${name},\n\nThanks for reaching out. I received your message and will respond shortly.\n\n– Temitope`;
    await this.sendEmail({ to, subject, html, text });
  }
}
