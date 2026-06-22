import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromOverride?: string;
  /** Address recipients reply to — e.g. the lead's own email on a notification. */
  replyTo?: string;
};

/** The fields surfaced to the site owner when a new contact-form lead arrives. */
type LeadNotification = {
  name: string;
  email: string;
  company?: string | null;
  message: string;
  service?: string | null;
  score: number;
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
  private readonly notifyTo: string;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>("RESEND_API_KEY") ?? "";
    this.fromDefault =
      this.config.get<string>("EMAIL_FROM") ?? "Temitope <hello@temitope.live>";
    // Where new-lead alerts go. Falls back to the admin login email when the
    // dedicated notify address is unset (`||` so an empty string falls through).
    this.notifyTo =
      this.config.get<string>("LEAD_NOTIFY_EMAIL") ||
      this.config.get<string>("ADMIN_EMAIL") ||
      "";
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
          ...(input.replyTo ? { reply_to: input.replyTo } : {}),
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

  /**
   * Alerts the site owner that a new contact-form lead arrived. Delivered to
   * LEAD_NOTIFY_EMAIL (falling back to ADMIN_EMAIL), with the lead's own address
   * set as reply-to so a reply lands straight in their inbox.
   */
  async sendLeadNotification(lead: LeadNotification): Promise<void> {
    if (!this.notifyTo) {
      this.logger.error(
        "LEAD_NOTIFY_EMAIL / ADMIN_EMAIL not configured; skipping lead notification",
      );
      return;
    }
    // Escape every user-supplied value before interpolating into the HTML body.
    const name = escapeHtml(lead.name);
    const email = escapeHtml(lead.email);
    const company = lead.company ? escapeHtml(lead.company) : "—";
    const serviceLabel = lead.service ? escapeHtml(lead.service) : "—";
    const message = escapeHtml(lead.message).replace(/\n/g, "<br>");
    const subject = `New lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`;
    const html =
      `<h2>New contact-form lead</h2>` +
      `<p><strong>Name:</strong> ${name}</p>` +
      `<p><strong>Email:</strong> ${email}</p>` +
      `<p><strong>Company:</strong> ${company}</p>` +
      `<p><strong>Service:</strong> ${serviceLabel}</p>` +
      `<p><strong>Score:</strong> ${lead.score}</p>` +
      `<p><strong>Message:</strong></p><p>${message}</p>`;
    const text =
      `New contact-form lead\n\n` +
      `Name: ${lead.name}\n` +
      `Email: ${lead.email}\n` +
      `Company: ${lead.company ?? "—"}\n` +
      `Service: ${lead.service ?? "—"}\n` +
      `Score: ${lead.score}\n\n` +
      `Message:\n${lead.message}`;
    await this.sendEmail({
      to: this.notifyTo,
      subject,
      html,
      text,
      replyTo: lead.email,
    });
  }
}
