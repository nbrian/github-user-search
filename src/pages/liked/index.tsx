import List from "@/components/List";
import { getPageCount } from "@/lib/helper";
import { User } from "@/lib/types/github";
import { addFavorite, removeFavorite, selectFavorites } from "@/store/favoriteSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { People } from "@mui/icons-material";
import { useRouter } from "next/router";
import { ChangeEvent } from "react";

export default function Liked() {
    const router = useRouter();
    const favorites = useAppSelector(selectFavorites);
    const dispatch = useAppDispatch();

    const handleUserClick = (username: string) => {
        router.push(`/users/${username}`);
      }
    
      const handleUserFavorite = (user: User) => {
        // remove if existing
        if(favorites.some(fav => fav.login === user.login)) {
          dispatch(removeFavorite(user));
        } else {
          dispatch(addFavorite(user));
        }
    }

      
    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        // setPage(value);
    };

    
    return (
        <>
            {favorites && favorites.length > 0 ? 
                <List 
                    keyword={null} 
                    list={favorites} 
                    favorites={favorites}
                    page={1} 
                    pageCount={getPageCount(favorites.length)} 
                    handlePageChange={handlePageChange} 
                    handleItemClick={handleUserClick} 
                    handleUserFavorite={handleUserFavorite}
                /> : <>
                    <People />
                    <span>Once you like people, you&apos;ll see them here.</span>
                </>
            }
        </>
    )
}