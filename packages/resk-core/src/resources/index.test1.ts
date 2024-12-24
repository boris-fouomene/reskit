
import { IResourceDataProvider, IResourceName } from "../types";;
import { i18n } from "../i18n";
import "../translations";
import { Resource, ResourceBase, ResourcesManager } from "./index";

describe("ResourceBase", () => {
    beforeAll(() => {
        i18n.setLocale("en");
    });

    describe("ResourceBase Constructor", () => {
        it("should initialize with provided options", () => {
            const resource = new ResourceBase({
                name: "test" as IResourceName,
                label: "Test Resource",
                title: "Test Title",
                tooltip: "Test Tooltip"
            });

            expect(resource.getName()).toBe("test");
            expect(resource.getLabel()).toBe("Test Resource");
            expect(resource.getTitle()).toBe("Test Title");
            expect(resource.getTooltip()).toBe("Test Tooltip");
        });
    });

    describe("Resource Actions", () => {
        let resource: ResourceBase;

        beforeEach(() => {
            resource = new ResourceBase({
                name: "test" as IResourceName,
                actions: {
                    read: { label: "Read {name}", title: "Read Title" },
                    create: { label: "Create", tooltip: "Create New" }
                }
            });
        });

        it("should get action label with parameters", () => {
            const label = resource.getActionLabel("read", { name: "Test" });
            expect(label).toBe("Read Test");
        });

        it("should return empty object for non-existent action", () => {
            const action = resource.getAction("nonexistent" as IResourceName);
            expect(action).toEqual({});
        });
    });

    describe("ResourcesManager", () => {
        it("should manage multiple resources", () => {
            const resource1 = new ResourceBase({ name: "test1" as IResourceName });
            const resource2 = new ResourceBase({ name: "test2" as IResourceName });

            ResourcesManager.addResource("test1" as IResourceName, resource1);
            ResourcesManager.addResource("test2" as IResourceName, resource2);

            expect(ResourcesManager.getResourceNames()).toContain("test1");
            expect(ResourcesManager.getResourceNames()).toContain("test2");

            ResourcesManager.removeResource("test1" as IResourceName);
            expect(ResourcesManager.getResourceNames()).not.toContain("test1");
        });
    });

    describe("Resource Decorator", () => {
        @Resource({
            name: "decoratedTest" as IResourceName,
            label: "Decorated Test"
        })
        class TestResource extends ResourceBase { }

        it("should register resource via decorator", () => {
            const resource = ResourcesManager.getResource("decoratedTest" as IResourceName);
            expect(resource).toBeTruthy();
            expect(resource?.getLabel()).toBe("Decorated Test");
        });
    });

    describe("Data Provider Operations", () => {
        let resource: ResourceBase;

        beforeEach(() => {
            class TestResource extends ResourceBase {
                dataProvider: IResourceDataProvider<any, any> = {
                    create: jest.fn().mockResolvedValue({ data: "created" }),
                    read: jest.fn().mockResolvedValue({ data: "read" }),
                    update: jest.fn().mockResolvedValue({ data: "updated" }),
                    delete: jest.fn().mockResolvedValue({ data: "deleted" }),
                    list: jest.fn().mockResolvedValue({ data: [] }),
                    details: jest.fn().mockResolvedValue({ data: "details" })
                }
            }
            resource = new TestResource({
                name: "test" as IResourceName,
            });
        });

        it("should handle CRUD operations with data provider", async () => {
            await expect(resource.create({ test: true })).resolves.toEqual({ data: "created" });
            await expect(resource.read(1)).resolves.toEqual({ data: "read" });
            await expect(resource.update(1, { test: true })).resolves.toEqual({ data: "updated" });
            await expect(resource.delete(1)).resolves.toEqual({ data: "deleted" });
        });

        it("should reject operations when data provider is missing", async () => {
            resource.dataProvider = null as any;
            await expect(resource.create({ test: true })).rejects.toThrow();
            await expect(resource.read(1)).rejects.toThrow();
            await expect(resource.update(1, { test: true })).rejects.toThrow();
            await expect(resource.delete(1)).rejects.toThrow();
        });
    });

    describe("Translation Support", () => {
        let resource: ResourceBase;

        beforeEach(() => {
            resource = new ResourceBase({
                name: "test" as IResourceName,
                label: "resources.test.label",
                title: "resources.test.title"
            });
        });

        it("should translate properties using i18n", () => {
            const translations = {
                en: {
                    resources: {
                        test: {
                            label: "Translated Label",
                            title: "Translated Title"
                        }
                    }
                }
            };

            i18n.store(translations);
            i18n.setLocale("en");

            expect(resource.getLabel()).toBe("Translated Label");
            expect(resource.getTitle()).toBe("Translated Title");
        });
    });
});
