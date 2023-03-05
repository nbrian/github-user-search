import UserList from "@/components/UserList";
import { User, Users } from "@/lib/types/github";
import { addFavorite, removeFavorite, selectFavorites } from "@/store/favoriteSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import styles from "@/styles/Home.module.css";
import { Cancel } from "@mui/icons-material";
import { Input } from "@mui/joy";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { Octokit } from "octokit";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UrlObject } from "url";

export default function Home({users, search}: {users: Users, search: string}) {
  const router = useRouter();
  
  const favorites = useAppSelector(selectFavorites);
  const dispatch = useAppDispatch();
  
  const searchInput = useRef<HTMLInputElement | null>(null);
  
  const [keyword, setKeyword] = useState<string | null>(search);
  const [page, setPage] = useState(router.query && Number(router.query.page) ? Number(router.query.page) : 1);

  useEffect(() => {
    if(Object.keys(router.query).length > 0) {
      setPage(Number(router.query.page))
    }
  }, [router.query]);

  useEffect(() => {
    pageQuery(keyword, page);
  }, [keyword, page]);
  
  // The Search API will return up to 1000 results per query 
  // (ref: https://developer.github.com/v3/search/#about-the-search-api)
  const pageCount = users && users.total_count < 1000 ? Math.floor(users.total_count/10) : 100; 
  
  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleClearSearch = () => {
    setKeyword(null)
    pageQuery(null, page);
  }

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

  // NOTE: add delay implementation?
  const pageQuery = (q: string | null, pageNumber: number) => {
    let url: UrlObject = {pathname: '/'}
    if(q) {
      url = { ...url, query: {q, page: pageNumber} }
    }
    Router.push(url);
  }

  return (
    <div className={styles.container}>
      <Input
        className={styles.searchBar}
        ref={searchInput}
        placeholder="Enter GitHub username, i.e. gaearon" variant="outlined" 
        onChange={e => setKeyword(e.target.value)}
        value={keyword || ''}
        endDecorator={keyword ? <Cancel className={styles.clearSearch} onClick={handleClearSearch} /> : <></>}/>

      {users ?
        <UserList 
          keyword={search} 
          list={users} 
          page={page} 
          pageCount={pageCount} 
          favorites={favorites}
          handlePageChange={handlePageChange} 
          handleItemClick={handleUserClick} 
          handleUserFavorite={handleUserFavorite}
        /> 
        : 
        <div className={styles.noSearch}>
          {/* <GitHub /> */}
          <Image src='/GitHub_Logo.svg' alt="Logo" width={120} height={120} className={styles.image}/>
          <Image src='/GitHub_Text.svg' alt="Logo" width={139} height={57} className={styles.image}/>
          <p className={styles.text}>
            Enter GitHub username and search users matching the input like Google Search, click avatars to view more details, including repositories, followers and following.
          </p>
        </div>
      }
      
      
    </div>
  )
}

export async function getServerSideProps({query, res}: GetServerSidePropsContext) {
  const keyword = query && query.q as string;
  const page = query && query.page as unknown as number || 1;

  if(keyword) {
      const octokit = new Octokit({
        auth: process.env.TOKEN
      });
      const users =  await octokit.request('GET /search/users', {q: keyword.toString(), per_page: 10, page : page})
      
      if(users.data) {
        await Promise.all(users.data.items.map(async user => {
          const u = await octokit.request(`GET /users/${user.login}`, {username: user.login}); 
          // add other variables from user api
          user.followers = u.data.followers;
          user.following = u.data.following;
          user.public_repos = u.data.public_repos;
          return user;
        }));

        res.setHeader(
          'Cache-Control',
          'public, s-maxage=10, stale-while-revalidate=59'
        );
        return {
            props: {
              users: users.data,
              search: keyword
            },
        }
      }
  
  }

  return {
      props: {users: null, search: null}
  }

}