import { ChangeEvent } from "react"
import { Repo, User, Users } from "./github"

export type ListProps = {
    keyword: string | null, 
    list: Users | Array<Repo | User>, 
    page: number, 
    pageCount: number, 
    handlePageChange: (_event: ChangeEvent<unknown>, value: number) => void, 
    handleItemClick?: (username: string) => void,
    handleUserFavorite?: (user: User) => void,
    favorites?: Array<User>
}