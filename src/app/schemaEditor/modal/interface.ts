export interface Record {
    type: string;
    fields: Array<any>;

}



export interface GMS { 
    "type": string, 
    "namespace"?: string,
    "name": string, 
    "fields": Array<any>
}


export const totalTypes = [
    "string",
    "boolean",
    "int",
    "long",
    "double",
    "float",
    "record",
    "enum",
    "array",
    "map",
    "bytes",
    ""
];