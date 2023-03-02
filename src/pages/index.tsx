import UserList from "@/components/UserList";
import { User, Users } from "@/lib/types/github";
import { addFavorite, removeFavorite, selectFavorites } from "@/store/favoriteSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Close, GitHub } from "@mui/icons-material";
import { Input } from "@mui/joy";
import { GetServerSidePropsContext } from "next";
import Router, { useRouter } from "next/router";
import { Octokit } from "octokit";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UrlObject } from "url";

export default function Home({users}: {users: Users}) {
  const router = useRouter();
  const favorites = useAppSelector(selectFavorites);
  const dispatch = useAppDispatch();
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // set keyword/page if theres url query
    if(Router.query && (Router.query.q ||  Router.query.page)) {
      const queries = Router.query;
      setKeyword(String(queries.q));
      setPage(Number(queries.page));
    }
  }, []);
  
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

  // add delay implementation ?
  // use shallow?
  const pageQuery = (q: string | null, pageNumber: number) => {
    let url: UrlObject = {pathname: '/'}
    if(q) {
      url = { ...url, query: {q, page: pageNumber} }
    }
    Router.push(url)
  }

  return (
    <>
      <Input
        ref={searchInput}
        placeholder="Enter GitHub username, i.e. gaearon" variant="outlined" 
        onChange={e => setKeyword(e.target.value)}
        value={keyword || ''}
        endDecorator={keyword ? <Close onClick={handleClearSearch} /> : <></>}/>

      {users ?
        <UserList 
          keyword={keyword} 
          list={users} 
          page={page} 
          pageCount={pageCount} 
          favorites={favorites}
          handlePageChange={handlePageChange} 
          handleItemClick={handleUserClick} 
          handleUserFavorite={handleUserFavorite}
        /> 
        : 
        <div>
          <GitHub />
          <p>
          Enter GitHub username and search users matching the input like Google Search, click avatars to view more details, including repositories, followers and following.
          </p>
        </div>
      }
      
      
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const keyword = context.query && context.query.q as string
  const page = context.query && context.query.page as unknown as number || 1

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

        // console.log(users.data);
        return {
            props: {users: users.data},
        }
      }
  
  }

  return {
      props: {users: null}
  }

}