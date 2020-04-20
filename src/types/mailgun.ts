export interface MailgunEmailData {
  to: string[]
  from: string
  subject: string
  html?: string
  text?: string
}
