import { Users } from "@/lib/types/github";
import { ListProps } from "@/lib/types/list";
import { Search } from "@mui/icons-material";
import List from "./List";

export default function UserList({keyword, list, page, pageCount, handlePageChange, handleItemClick, handleUserFavorite, favorites}: ListProps) {
    const users = list as Users;
    return (
        <>
            {users.total_count > 0 ?
                <>
                    <div>
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
                    
                    {/* <div className={styles.container}>
                        {users.items.map((user) => (
                            user && (
                                <div key={user.id} className={styles.card} onClick={() => handleUserClick(user.login)}>
                                    <Image src={user.avatar_url} alt={user.login} width={64} height={64}/>
                                    <div className={styles.details}>
                                        <span className={styles.name} dangerouslySetInnerHTML={highlightKeyword(user.login)}></span>
                                        <span>{user.followers} followers</span>
                                        <span>{user.following} following</span>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>

                    {pageCount > 0 && 
                        <Pagination page={page} count={pageCount} shape="rounded" onChange={handlePageChange}/>
                    } */}
                </>
                :
                <>
                    <Search />
                    <p>No search result found for <span>{keyword}</span></p>
                </>
            }
            
        </>
    )
}
