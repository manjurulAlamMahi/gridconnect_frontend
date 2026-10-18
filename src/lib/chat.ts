import type { ConversationAttachment, MessageAttachment } from "@/types/chat";

type ChatAttachment =
  | ConversationAttachment
  | MessageAttachment
  | null
  | undefined;

const IMAGE_EXTENSION_PATTERN = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(?:$|[?#])/i;

export const getChatAttachmentUrl = (attachment: ChatAttachment) => {
  if (!attachment) {
    return null;
  }

  if (typeof attachment === "string") {
    return attachment;
  }

  return attachment.url || null;
};

export const getChatAttachmentName = (attachment: ChatAttachment) => {
  if (!attachment || typeof attachment === "string") {
    return null;
  }

  return attachment.name || null;
};

export const isChatAttachmentImage = (attachment: ChatAttachment) => {
  if (!attachment) {
    return false;
  }

  if (typeof attachment !== "string" && attachment.type) {
    return attachment.type.toLowerCase().startsWith("image");
  }

  const url = getChatAttachmentUrl(attachment);
  return url ? IMAGE_EXTENSION_PATTERN.test(url) : false;
};
