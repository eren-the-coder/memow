declare module 'dexie' {
    export class Table<T = any> {
        toArray(): Promise<T[]>
        where(key: string): this
        equals(value: any): this
        update(id: string, updates: Partial<T>): Promise<number>
        delete(id: string): Promise<void>
        add(value: T): Promise<void>
        bulkAdd(values: T[]): Promise<void>
        get(id: string): Promise<T | undefined>
    }

    export default class Dexie {
        constructor(databaseName: string)
        version(versionNumber: number): { stores(schema: Record<string, string>): void }
    }
}
