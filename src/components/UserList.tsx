import { Users } from "@/lib/types/github";
import { ListProps } from "@/lib/types/list";
import styles from "@/styles/UserList.module.css";
import { Search } from "@mui/icons-material";
import List from "./List";

export default function UserList({keyword, list, page, pageCount, handlePageChange, handleItemClick, handleUserFavorite, favorites}: ListProps) {
    const users = list as Users;
    return (
        <div className={styles.container}>
            {users.total_count > 0 ?
                <>
                    <div className={styles.totalCount}>
                        {users.total_count} GitHub users found
                    </div>
                    <List 
                        keyword={keyword} 
                        list={list} 
                        page={page} 
                        pageCount={pageCount} 
                        favorites={favorites}
                        handlePageChange={handlePageChange} 
                        handleItemClick={handleItemClick} 
                        handleUserFavorite={handleUserFavorite} 
                    />
                </>
                :
                <div  className={styles.notFound}>
                    <Search className={styles.searchIcon}/>
                    <span>No search result found for</span> <span className={styles.keyword}>{keyword}</span>
                </div>
            }
        </div>
    )
}
