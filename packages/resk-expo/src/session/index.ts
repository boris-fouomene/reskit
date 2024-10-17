import packageJSON from "package.json";
import { Session } from "@resk/core";
import { packageName } from "@utils/index";

Session.SessionManager.allKeyPrefix = `${packageName}-session`;

export default Session;