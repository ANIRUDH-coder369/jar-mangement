import { TODO_CREATE, TODO_DELETE, TODO_GET, TODO_UPDATE } from "@/types/todo"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_URL =


    `${process.env.NEXT_PUBLIC_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_LIVE
        : process.env.NEXT_PUBLIC_API_LOCAL}/api/auth` || "http://localhost:5000/api"

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/todo`,
        credentials: "include"
    }),
    endpoints: (builder) => {
        return {
            getTodo: builder.query<TODO_GET, void>({
                query: () => {
                    return {
                        url: "/read",
                        method: "GET"
                    }
                },
            }),
            addTodo: builder.mutation<void, TODO_CREATE>({
                query: userData => {
                    return {
                        url: "/create",
                        method: "POST",
                        body: userData
                    }
                },
            }),
            updateTodo: builder.mutation<void, TODO_UPDATE>({
                query: userData => {
                    return {
                        url: "/update/" + userData._id,
                        method: "PUT",
                        body: userData
                    }
                },
            }),
            deleteTodo: builder.mutation<void, TODO_DELETE>({
                query: userData => {
                    return {
                        url: "/delete/" + userData._id,
                        method: "DELETE",
                    }
                },
            }),

        }
    }
})

export const { useAddTodoMutation, useDeleteTodoMutation, useGetTodoQuery, useUpdateTodoMutation } = todoApi
