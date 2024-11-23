import { Session } from "@resk/core";
import { packageName } from "@utils/index";

Session.SessionManager.allKeyPrefix = `${packageName}-session`;

type ISession = typeof Session & {
    storage: typeof Session.SessionManager.storage;
    Manager: typeof Session.SessionManager;
};

const SessionExported = Session as ISession;
SessionExported.storage = Session.SessionManager.storage;
SessionExported.Manager = Session.SessionManager;

export default SessionExported;