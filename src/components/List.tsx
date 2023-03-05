import type { Repo, User } from "@/lib/types/github";
import { ListProps } from "@/lib/types/list";
import styles from "@/styles/List.module.css";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";

export default function List({keyword, list, page, pageCount, handlePageChange, handleItemClick, handleUserFavorite, favorites}: ListProps) {
    const highlightKeyword = ((value: string) => {
        if(keyword) {
            const splitstr = 
                value.slice(0, value.indexOf(keyword)) + `<b>${value.slice(value.indexOf(keyword), keyword.length)}</b>` + 
                value.slice(value.indexOf(keyword) + keyword.length, value.length);
            return { __html: splitstr };
        }

        return { __html: value };
    });

    const items = Array.isArray(list) ? list : list.items;

    const itemIsUser = (item: User | Repo) => (item as User).login !== undefined;

    const itemIsFavorite = (id: number) => favorites ? favorites.some(favorite => favorite.id === id) : false;

    const UserCard = ({item, favorite}: {item: User, favorite: boolean}) => {
        const [liked, setLiked] = useState(favorite);

        const handleLikedUser = (e: SyntheticEvent) => {
            e.preventDefault();
            setLiked(l => !l);
            handleUserFavorite && handleUserFavorite(item);
        }

        return (<div className={styles.user} >
            <div className={styles.action} onClick={handleLikedUser}>
                {liked ? <Favorite /> : <FavoriteBorder />}
            </div>
            <div className={styles.card} onClick={() => handleItemClick && handleItemClick(item.login)}>
                <Image src={item.avatar_url} alt={item.login} width={64} height={64}/>
                <div className={styles.details}>
                    <span className={styles.name} dangerouslySetInnerHTML={highlightKeyword(item.login)}></span>
                    <span>{item.followers} followers</span>
                    <span>{item.following} following</span>
                </div>
            </div>
        </div>)
    };

    const RepoCard = ({item}: {item: Repo}) => (
        <div key={item.id} className={styles.card}>
            <div className={styles.details}>
                <span className={styles.name}>{item.name}</span>
                <span>{item.stargazers_count} stars</span>
                <span>{item.forks_count} forks</span>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.list}> 
                {items.map((item) => (
                    (itemIsUser(item)) ? 
                        <UserCard key={item.id} item={item as User} favorite={itemIsFavorite(item.id)}/> :
                        <RepoCard key={item.id} item={item as Repo} />
                    
                ))}
            </div>
            {pageCount > 0 && 
                <Pagination 
                    color="primary" 
                    className={styles.pagination} 
                    shape="rounded" 
                    page={page} count={pageCount} 
                    onChange={handlePageChange}/>
            }
        </div>
    )
}