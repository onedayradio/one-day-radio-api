import Mailgun, { Mailgun as MailgunType } from 'mailgun-js'

import { getValue } from './config'
import { errorsLogger, generalLogger } from '../logs'
import { User, MailgunEmailData } from '../../types'
import { welcomeEmailTemplate } from './email-templates/welcomeEmail'

const emailsData = {
  welcome: {
    getData: (user: User): MailgunEmailData => {
      let fullName = user.firstname
      if (user.lastname) {
        fullName = `${user.firstname} ${user.lastname}`
      }
      return {
        from: getValue('support_email'),
        to: [user.email || ''],
        subject: `Hey, ${fullName}! Welcome to OneDayRadio!`,
        html: welcomeEmailTemplate.replace('%recipient.name%', fullName || ''),
      }
    },
  },
}

const getNewMailgunInstance = (): MailgunType => {
  const mailgun = new Mailgun({
    domain: getValue('mailgun_domain'),
    apiKey: getValue('mailgun_apikey'),
  })
  return mailgun
}

const sendEmail = (dataToSend: MailgunEmailData): Promise<void> => {
  const promise = async (resolve: any, reject: any): Promise<void> => {
    try {
      generalLogger.info('Sending mail with Mailgun', dataToSend.to)
      const mailgun = getNewMailgunInstance()
      void mailgun.messages().send(dataToSend, function (sendError: any, body: any) {
        if (sendError) {
          reject(sendError)
        } else {
          console.log('Email sent ! ', body) // eslint-disable-line no-console
          resolve()
        }
      })
    } catch (error) {
      reject(error)
    }
  }
  return new Promise(promise)
}

export const sendWelcomeEmail = async (user: User): Promise<boolean> => {
  try {
    const emailData = emailsData.welcome.getData(user)
    await sendEmail(emailData)
    return true
  } catch (error) {
    errorsLogger.error('Error on: MailgunUtil -> sendWelcomeEmail', error)
    return false
  }
}
