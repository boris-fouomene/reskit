import { IDict } from "@resk/core";

export interface IAuthUser {
    id: string | number;
    authSessionCreatedAt?: number;
}

export interface IAuthSessionStorage {
    /**** retourne la valeur de session dont la clé est passée en paramètre 
    @param {string} key, la clé de la valeur à récupérer  
  */
    get: (key?: string) => any;
    /***
      persiste une valeur de session
      @param {string} key | IDict, la clé de la valeur à persister ou un objet contenant les données de session
      @param {value} any, la valeur à persister   
    */
    set: (key?: string | IDict, value?: any) => any;

    /****
      retourne les données de sessions liées au paramètre sessionName du datatable
      @return {IDict}
    */
    getData: () => IDict;

    /***
      retourne la clé de session associée au nom de session sessionName
    */
    getKey: () => string;

    /*** le nom de session utilisé par le manager */
    sessionName?: string;
}