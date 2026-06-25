import {PAGE_SIZE} from "@/common/constants"
import Pagination from "@mui/material/Pagination"
import {ChangeEvent} from "react"
import s from "./TasksPagination.module.css"
import {
    TasksPaginationProps
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.types.ts";
import {TasksCounter} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks";

export const TasksPagination = ({ totalCount, page, setPage }: TasksPaginationProps) => {
    const changePage = (_: ChangeEvent<unknown>, page: number) => {
        setPage(page)
    }

    return (
        <>
            <Pagination
                count={Math.ceil(totalCount / PAGE_SIZE)}
                page={page}
                onChange={changePage}
                shape="rounded"
                color="primary"
                className={s.pagination}
            />
            <div className={s.totalCount}>
                {/*<Typography variant="caption">Total: {totalCount}</Typography>*/}
                <TasksCounter tasksQuantity={totalCount}/>
            </div>
        </>
    )
}