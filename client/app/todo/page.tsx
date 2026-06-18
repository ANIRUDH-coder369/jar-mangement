"use client"

import { useAddTodoMutation, useDeleteTodoMutation, useGetTodoQuery, useUpdateTodoMutation } from "@/redux/apis/todo.apis"
import { TODO_CREATE, TODO_DELETE } from "@/types/todo"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z, { ZodType } from "zod"

const todo = () => {

    const [add] = useAddTodoMutation()
    const { data } = useGetTodoQuery()
    const [update] = useUpdateTodoMutation()
    const [remove] = useDeleteTodoMutation()

    const [select, setSelect] = useState<string | null>(null)

    const todoSchema = z.object({
        task: z.string().min(1, "Task is required"),
        desc: z.string().min(1, "Description is required"),
        priority: z.string().min(1, "Priority is required"),
    }) satisfies ZodType<TODO_CREATE>

    const { register, reset, formState: { errors }, handleSubmit } = useForm<TODO_CREATE>({
        defaultValues: {
            task: '',
            desc: '',
            priority: ""
        },
        resolver: zodResolver(todoSchema)
    })

    const handleAdd = async (jack: TODO_CREATE) => {
        try {
            if (select) {
                await update({ ...jack, _id: select }).unwrap()
            } else {
                await add(jack).unwrap()
            }
            reset()
            setSelect(null)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (jack: TODO_DELETE) => {
        try {
            await remove(jack).unwrap()
        } catch (error) {
            console.log(error);
        }
    }

    const populateForm = (item: TODO_CREATE) => {
        reset({
            task: item.task,
            desc: item.desc,
            priority: item.priority,
        })
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8 py-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Todo List</h1>
                <p className="text-muted-foreground text-sm">Manage your tasks with ease</p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-xs">
                <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Task
                        </label>
                        <input
                            type="text"
                            {...register('task')}
                            placeholder="Enter task name"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        {errors.task && <p className="text-destructive text-xs">{errors.task.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Description
                        </label>
                        <input
                            type="text"
                            {...register("desc")}
                            placeholder="Enter description"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                        {errors.desc && <p className="text-destructive text-xs">{errors.desc.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Priority
                        </label>
                        <select
                            {...register('priority')}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                            <option value="">Choose priority</option>
                            <option value="low">Low</option>
                            <option value="high">High</option>
                        </select>
                        {errors.priority && <p className="text-destructive text-xs">{errors.priority.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        {select ? "Update" : "Add"}
                    </button>
                </form>
            </div>

            <div className="rounded-lg border bg-card shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Task</th>
                                <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Description</th>
                                <th className="h-10 px-4 text-left align-middle text-sm font-medium text-muted-foreground">Priority</th>
                                <th className="h-10 px-4 text-right align-middle text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.result.map(item => (
                                <tr key={item._id} className="border-b border-border transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle text-sm">{item.task}</td>
                                    <td className="p-4 align-middle text-sm">{item.desc}</td>
                                    <td className="p-4 align-middle text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            item.priority === "high"
                                                ? "bg-destructive/10 text-destructive"
                                                : "bg-secondary text-secondary-foreground"
                                        }`}>
                                            {item.priority}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                onClick={() => {
                                                    populateForm(item)
                                                    setSelect(item._id)
                                                }}
                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDelete({ _id: item._id })}
                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground shadow-xs transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!data || data.result.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-sm text-muted-foreground">
                                        No todos yet. Add one above!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default todo