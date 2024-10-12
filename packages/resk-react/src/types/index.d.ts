declare module "@reskit/core" {
    type IResourcesNamesExtends = "users" |"roles"
    interface IFieldMapExtends {
        select : IFieldBase<"select"> & {
            items : string[]
        }
    }
}