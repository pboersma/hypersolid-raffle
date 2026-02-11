import { Injectable, Logger } from '@nestjs/common';

export type EmailMeta = {
  entryId: number;
  type: 'winner' | 'non-winner' | 'confirmation';
};

export type SentEmail = {
  to: string;
  subject: string;
  body: string;
  meta?: EmailMeta;
  sentAt: Date;
};

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly sent: SentEmail[] = [];

  /**
   * Send an email
   *
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} body - Email body content
   * @param {EmailMeta} meta - Optional metadata
   *
   * @returns {void}
   */
  send(to: string, subject: string, body: string, meta?: EmailMeta): void {
    const email: SentEmail = { to, subject, body, meta, sentAt: new Date() };
    this.sent.push(email);

    this.logger.log(
      `[EMAIL] to=${to} subject="${subject}" meta=${JSON.stringify(meta ?? {})}`,
    );
  }

  /**
   * Get sent emails
   *
   * @returns {SentEmail[]}
   */
  getSentEmails(): SentEmail[] {
    return [...this.sent];
  }

  /**
   * Clear sent emails
   *
   * @returns {void}
   */
  clear() {
    this.sent.length = 0;
  }
}
