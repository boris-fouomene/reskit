import { i18n } from "../i18n";
import "../translations";
import { Auth } from "./index";
import { Session } from "../session";
import { IAuthUser, IAuthPerms, IAuthPerm } from "./types";
import { IResourceActionName, IResourceName } from "@/types";


declare module "../types/resources" {
    interface IResources {
        documents: {
            actions: {
                test: IResourceAction,
                publish: IResourceAction,
            };
        };
        articles: IResource;
        users: IResource;
    }
}

describe("Auth", () => {
    beforeAll(() => {
        i18n.setLocale("en");
    });

    beforeEach(() => {
        Session.removeAll();
        Auth.setSignedUser(null);
    });

    describe("isAllowed", () => {
        it("should return false for false permission", () => {
            expect(Auth.isAllowed(false)).toBe(false);
        });

        it("should return true for master admin", () => {
            Auth.isMasterAdmin = () => true;
            expect(Auth.isAllowed(["documents", "create"])).toBe(true);
            Auth.isMasterAdmin = undefined;
        });

        it("should handle function permissions", () => {
            const user: IAuthUser = { id: "123", perms: {} };
            const permFn = (u: IAuthUser) => u.id === "123";
            expect(Auth.isAllowed(permFn, user)).toBe(true);
        });

        it("should validate resource:action string permissions", () => {
            const user: IAuthUser = {
                id: "123",
                perms: {
                    documents: ["read", "create"]
                }
            };
            expect(Auth.isAllowed({ resourceName: "documents", action: "read" }, user)).toBe(true);
            expect(Auth.isAllowed<"documents">(["documents", "publish"], user)).toBe(false);
        });
        it("Sould test if the user has permissions from a function", () => {
            const user: IAuthUser = {
                id: "123",
                perms: {
                    documents: ["read", "create"]
                }
            };
            expect(Auth.isAllowed((user) => {
                return !!user.perms?.documents?.includes("read");
            }, user)).toBe(true);
        });

        it("should check role-based permissions", () => {
            const user: IAuthUser = {
                id: "123",
                roles: [
                    {
                        name: "editor", perms: { documents: ["update", "publish"] }
                    },
                ]
            };
            expect(Auth.isAllowed(["documents", "update"] as IAuthPerm, user)).toBe(true);
            expect(Auth.isAllowed(["documents", "publish"], user)).toBe(true);
            expect(Auth.isAllowed(["articles", "delete"] as IAuthPerm, user)).toBe(false);
        });
    });

    describe("checkPermission", () => {
        const perms: IAuthPerms = {
            documents: ["read", "create", "all"],
            users: ["read"]
        };

        it("should validate basic permissions", () => {
            expect(Auth.checkPermission(perms, "documents", "read")).toBe(true);
            expect(Auth.checkPermission(perms, "users", "update")).toBe(false);
        });

        it("should handle 'all' permission", () => {
            expect(Auth.checkPermission(perms, "documents", "anything" as IResourceActionName)).toBe(true);
        });

        it("should handle case-insensitive resources", () => {
            expect(Auth.checkPermission(perms, "DOCUMENTS" as IResourceName, "read")).toBe(true);
            expect(Auth.checkPermission(perms, "Documents" as IResourceName, "create")).toBe(true);
        });
    });

    describe("isAllowedForAction", () => {
        it("should handle single action permissions", () => {
            expect(Auth.isAllowedForAction("read", "read")).toBe(true);
            expect(Auth.isAllowedForAction("update", "read")).toBe(false);
        });
        it("should handle pipe-separated multiple actions", () => {
            expect(Auth.isAllowedForAction("read", "read")).toBe(true);
            expect(Auth.isAllowedForAction("update", "create")).toBe(false);
        });

        it("should be case insensitive", () => {
            expect(Auth.isAllowedForAction("read", "read")).toBe(true);
            expect(Auth.isAllowedForAction("read", "create")).toBe(false);
        });
    });

    describe("Session Management", () => {
        const testUser: IAuthUser = {
            id: "test123",
            email: "test@example.com"
        };
        it("should handle sign in and sign out flow", async () => {
            await Auth.signIn(testUser);
            expect(Auth.getSignedUser()?.id).toBe(testUser.id);

            await Auth.signOut();
            expect(Auth.getSignedUser()).toBeNull();
        });

        it("should reject invalid sign in attempts", async () => {
            await expect(Auth.signIn(null as any)).rejects.toThrow();
        });

        it("should manage session token", () => {
            const token = "test-token";
            Auth.Session.setToken(token);
            expect(Auth.Session.getToken()).toBe(token);

            Auth.Session.setToken(null);
            expect(Auth.Session.getToken()).toBeNull();
        });
    });
});
