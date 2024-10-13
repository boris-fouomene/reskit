import { IFieldBase } from "@resk/core"

declare module "@reskit/core" {
    type IResourcesNamesExtends1 = "users" |"roles"
    interface IFieldMapExtends1 {
        select : IFieldBase<"select"> & {
            items : string[]
        }
    }
}