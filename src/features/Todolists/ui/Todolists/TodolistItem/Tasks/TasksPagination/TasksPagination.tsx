import {ChangeEvent} from "react"
import {PAGE_SIZE} from "@/common/constants"
import Pagination from "@mui/material/Pagination"
import {
    TasksPaginationProps
} from "@/features/Todolists/ui/Todolists/TodolistItem/Tasks/TasksPagination/TasksPagination.types.ts";
import Typography from "@mui/material/Typography";
import s from "./TasksPagination.module.css"

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
            <div className={s.totalCountBlock}>
                <Typography variant="caption" className={s.totalCounter}>Total: {totalCount}</Typography>
                {/*<TasksCounter tasksQuantity={totalCount}/>*/}
            </div>
        </>
    )
}