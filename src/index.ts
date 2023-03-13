import { Injector, common, webpack } from "replugged";
import { Messages } from "replugged/dist/renderer/modules/webpack/common/messages";
import type { RawModule } from "replugged/dist/types";
import { replaceMostSimilar } from "./helpers";

let lastMessageContent = "";
let lastMessageID = "";

const inject = new Injector();

export async function start(): Promise<void> {
  const messageMod = await webpack.waitForModule<RawModule & Messages>(
    webpack.filters.byProps("sendMessage", "editMessage", "deleteMessage"),
  );

  inject.instead(messageMod, "sendMessage", async (props, fn) => {
    const { content } = props[1];

    if (content.startsWith("*")) {
      const newContent = replaceMostSimilar(lastMessageContent, content.substring(1));
      console.log("Editing '%s' to '%s'", lastMessageContent, newContent);
      common.messages.startEditMessage(props[0], lastMessageID, newContent);
      lastMessageContent = newContent;
      return null;
    } else {
      const result = await fn(...props);
      lastMessageID = result.body.id;
      lastMessageContent = result.body.content;
      return result;
    }
  });
}

export function stop(): void {
  inject.uninjectAll();
}
