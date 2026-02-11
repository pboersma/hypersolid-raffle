import { Injectable, Logger } from '@nestjs/common';

export type SentEmail = {
  to: string;
  subject: string;
  body: string;
  meta?: Record<string, any>;
  sentAt: Date;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly sent: SentEmail[] = [];

  /**
   * Send an email
   * 
   * @param to recipient
   * @param subject 
   * @param body 
   * @param meta metadata
   */
  send(to: string, subject: string, body: string, meta?: Record<string, any>) {
    const email: SentEmail = { to, subject, body, meta, sentAt: new Date() };
    this.sent.push(email);

    this.logger.log(`[EMAIL] to=${to} subject="${subject}" meta=${JSON.stringify(meta ?? {})}`);
  }

  /**
   * Get sent emails
   * 
   * @returns sent emails
   */
  getSentEmails(): SentEmail[] {
    return [...this.sent];
  }

  /**
   * Clear sent emails
   * 
   * @returns void
   */
  clear() {
    this.sent.length = 0;
  }
}
