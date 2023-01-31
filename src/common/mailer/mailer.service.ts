import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import type * as Mail from 'nodemailer/lib/mailer';

import {
  changeMail,
  changePasswordInfo,
  confirmMail,
  resetPassword,
} from '@common/mailer/templates';

// todo move this somewhere else
const emailTemplateConfig = {
  project: {
    name: '__YOUR_PROJECT_NAME__',
    address: '__YOUR_PROJECT_ADDRESS__',
    logoUrl: 'https://__YOUR_PROJECT_LOGO_URL__',
    slogan: 'Made with ❤️ in Istanbul',
    color: '#123456',
    socials: [
      ['GitHub', '__Project_GitHub_URL__'],
      ['__Social_Media_1__', '__Social_Media_1_URL__'],
      ['__Social_Media_2__', '__Social_Media_2_URL__'],
    ],
    url: 'http://localhost:4200',
    mailVerificationUrl: 'http://localhost:3000/auth/verify',
    mailChangeUrl: 'http://localhost:3000/auth/change-email',
    resetPasswordUrl: 'http://localhost:4200/reset-password',
    termsOfServiceUrl: 'http://localhost:4200/legal/terms',
  },
};

@Injectable()
export class MailerService {
  private transporter: Mail;

  private socials: string;

  private logger = new Logger('Mailer Service');

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      auth: {
        user: configService.getOrThrow('smtp.auth.user'),
        pass: configService.getOrThrow('smtp.auth.pass'),
      },
      //todo
      // host: configService.getOrThrow('smtp.host'),
      // port: configService.getOrThrow('smtp.port'),
      // secure: configService.getOrThrow('smtp.secure'),
      // host: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
    });

    this.socials = emailTemplateConfig.project.socials
      .map(
        (social) =>
          // eslint-disable-next-line max-len
          `<a href="${social[1]}" style="box-sizing:border-box;color:${emailTemplateConfig.project.color};font-weight:400;text-decoration:none;font-size:12px;padding:0 5px" target="_blank">${social[0]}</a>`
      )
      .join('');
  }

  async sendVerifyEmailMail(
    name: string,
    email: string,
    token: string
  ): Promise<boolean> {
    const buttonLink = `${emailTemplateConfig.project.mailVerificationUrl}?token=${token}`;

    const mail = confirmMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        emailTemplateConfig.project.name
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        emailTemplateConfig.project.address
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        emailTemplateConfig.project.logoUrl
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        emailTemplateConfig.project.slogan
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        emailTemplateConfig.project.color
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        emailTemplateConfig.project.url
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink)
      .replace(
        new RegExp('--TermsOfServiceLink--', 'g'),
        emailTemplateConfig.project.termsOfServiceUrl
      );

    const mailOptions = {
      from: `"${this.configService.getOrThrow(
        'mail.sender.email'
      )}" <${this.configService.getOrThrow('mail.sender.name')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Welcome to ${emailTemplateConfig.project.name} ${name}! Confirm Your Email`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.'
          );
          resolve(false);
        }

        resolve(true);
      })
    );
  }

  async sendChangeEmailMail(
    name: string,
    email: string,
    token: string
  ): Promise<boolean> {
    const buttonLink = `${emailTemplateConfig.project.mailChangeUrl}?token=${token}`;

    const mail = changeMail
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        emailTemplateConfig.project.name
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        emailTemplateConfig.project.address
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        emailTemplateConfig.project.logoUrl
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        emailTemplateConfig.project.slogan
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        emailTemplateConfig.project.color
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        emailTemplateConfig.project.url
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);

    const mailOptions = {
      from: `"${this.configService.getOrThrow(
        'mail.sender.name'
      )}" <${this.configService.getOrThrow('mail.sender.name')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Change Your ${emailTemplateConfig.project.name} Account's Email`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.'
          );
          resolve(false);
        }

        resolve(true);
      })
    );
  }

  async sendResetPasswordMail(
    name: string,
    email: string,
    token: string
  ): Promise<boolean> {
    const buttonLink = `${emailTemplateConfig.project.resetPasswordUrl}?token=${token}`;

    const mail = resetPassword
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        emailTemplateConfig.project.name
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        emailTemplateConfig.project.address
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        emailTemplateConfig.project.logoUrl
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        emailTemplateConfig.project.slogan
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        emailTemplateConfig.project.color
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        emailTemplateConfig.project.url
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);

    const mailOptions = {
      from: `"${this.configService.getOrThrow(
        'mail.sender.name'
      )}" <${this.configService.getOrThrow('mail.sender.email')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Reset Your ${emailTemplateConfig.project.name} Account's Password`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          console.log(error);
          this.logger.warn(
            'Mail sending failed, check your service credentials.'
          );
          resolve(false);
        }

        resolve(true);
      })
    );
  }

  async sendPasswordChangeInfoMail(
    name: string,
    email: string
  ): Promise<boolean> {
    const buttonLink = emailTemplateConfig.project.url;
    const mail = changePasswordInfo
      .replace(new RegExp('--PersonName--', 'g'), name)
      .replace(
        new RegExp('--ProjectName--', 'g'),
        emailTemplateConfig.project.name
      )
      .replace(
        new RegExp('--ProjectAddress--', 'g'),
        emailTemplateConfig.project.address
      )
      .replace(
        new RegExp('--ProjectLogo--', 'g'),
        emailTemplateConfig.project.logoUrl
      )
      .replace(
        new RegExp('--ProjectSlogan--', 'g'),
        emailTemplateConfig.project.slogan
      )
      .replace(
        new RegExp('--ProjectColor--', 'g'),
        emailTemplateConfig.project.color
      )
      .replace(
        new RegExp('--ProjectLink--', 'g'),
        emailTemplateConfig.project.url
      )
      .replace(new RegExp('--Socials--', 'g'), this.socials)
      .replace(new RegExp('--ButtonLink--', 'g'), buttonLink);

    const mailOptions = {
      from: `"${this.configService.getOrThrow(
        'mail.sender.name'
      )}" <${this.configService.getOrThrow('mail.sender.email')}>`,
      to: email, // list of receivers (separated by ,)
      subject: `Your ${emailTemplateConfig.project.name} Account's Password is Changed`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          this.logger.warn(
            'Mail sending failed, check your service credentials.'
          );
          resolve(false);
        }

        resolve(true);
      })
    );
  }
}
