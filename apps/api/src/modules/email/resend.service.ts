import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromOverride?: string;
};

@Injectable()
export class ResendService {
  private readonly apiKey: string;
  private readonly fromDefault: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>("RESEND_API_KEY") ?? "";
    this.fromDefault = this.config.get<string>("EMAIL_FROM") ?? "Temitope <hello@temi.dev>";
  }

  async sendEmail(input: SendEmailInput): Promise<void> {
    if (!this.apiKey) {
      console.error("RESEND_API_KEY is not configured");
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
        console.error(`Resend error: ${res.status} ${res.statusText} ${body}`);
      }
    } catch (err) {
      console.error("Resend request failed", err);
    }
  }

  async sendLeadConfirmation(to: string, name: string): Promise<void> {
    const subject = "We received your inquiry";
    const html = `<p>Hi ${name},</p><p>Thanks for reaching out. I received your message and will respond shortly.</p><p>– Temitope</p>`;
    const text = `Hi ${name},\n\nThanks for reaching out. I received your message and will respond shortly.\n\n– Temitope`;
    await this.sendEmail({ to, subject, html, text });
  }
}
