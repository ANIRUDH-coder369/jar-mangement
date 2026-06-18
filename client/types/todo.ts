export type TODO_CREATE = {
    task: string,
    desc: string,
    priority: string,
    _id?: string
}
export type TODO_GET = {
    result: Array<{
        task: string,
        desc: string,
        priority: string,
        _id: string
    }>

}
export type TODO_UPDATE = {
    task: string,
    desc: string,
    priority: string,
    _id: string
}
export type TODO_DELETE = {
    _id: string
}