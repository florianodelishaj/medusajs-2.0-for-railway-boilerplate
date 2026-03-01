import {
  INotificationModuleService,
  IUserModuleService,
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { BACKEND_URL } from "../lib/constants";
import { EmailTemplates } from "../modules/email-notifications/templates";

export default async function userInviteHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION);
  const userModuleService: IUserModuleService = container.resolve(Modules.USER);
  const invite = await userModuleService.retrieveInvite(data.id);

  try {
    await notificationModuleService.createNotifications({
      to: invite.email,
      channel: "email",
      template: EmailTemplates.INVITE_USER,
      data: {
        emailOptions: {
          replyTo: "ordini@ilcovodixur.com",
          subject: "Il Covo di Xur — Invito come amministratore",
        },
        inviteLink: `${BACKEND_URL}/app/invite?token=${invite.token}`,
        preview: "Sei stato invitato come amministratore su Il Covo di Xur",
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export const config: SubscriberConfig = {
  event: ["invite.created", "invite.resent"],
};
