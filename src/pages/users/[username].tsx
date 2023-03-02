import List from "@/components/List"
import { getPageCount } from "@/lib/helper"
import { Repo, User as UserDetails } from "@/lib/types/github"
import { addFavorite, removeFavorite, selectFavorites } from "@/store/favoriteSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import styles from "@/styles/User.module.css"
import { Apartment } from "@mui/icons-material"
import { TabContext, TabPanel } from "@mui/lab"
import { Box, Tab, Tabs } from "@mui/material"
import { GetServerSidePropsContext } from "next"
import Image from "next/image"
import Router, { useRouter } from "next/router"
import { Octokit } from "octokit"
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react"
import { UrlObject } from "url"

export default function User({user, list}: {user: UserDetails, list: Array<Repo | UserDetails>}) {
    const router = useRouter()
    const username = router.query.username;
    const favorites = useAppSelector(selectFavorites);
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState('repos');
    const [page, setPage] = useState(router.query && Number(router.query.page));
    
    useEffect(() => {
        const url: UrlObject = {
            pathname: `/users/${username}`,
            query: {
                tab,
                page
            }
        };
        Router.push(url);
      }, [username, page, tab]);

    const handleTabChange = (e: SyntheticEvent, value: string) => {
        e.preventDefault();
        setTab(value);
        setPage(1); //reset to page 1

        router.push({
            pathname: `/users/${user.login}`,
            query: {tab: value}
        })
        
    };

    const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleUserFavorite = (user: UserDetails) => {
        // remove if existing
        if(favorites.some(fav => fav.login === user.login)) {
          dispatch(removeFavorite(user));
        } else {
          dispatch(addFavorite(user));
        }
      }

    return (
        <div>
            <div className={styles.user}>
                <Image src={user.avatar_url} alt={user.login} width={160} height={160}/>
                <h2 className={styles.name}>{user.name}</h2>
                <span className={styles.username}>{user.login}</span>
                <span className={styles.location}><Apartment />{user.location}</span>
            </div>
            <TabContext value={tab}>

                <Box sx={{ width: '100%' }}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                        centered
                    >
                        <Tab value="repos" label={
                            <span>Repositories ({user.public_repos})</span>
                        } defaultChecked={true}/>
                        <Tab value="followers" label={
                            <span>Followers ({user.followers})</span>
                        } />
                        <Tab value="following" label={
                            <span>Following ({user.following})</span>
                        } />
                    </Tabs>
                </Box>
                <Box>
                    <TabPanel value="repos">
                        {list && <List keyword={null} list={list} page={page} pageCount={getPageCount(Number(user.public_repos))} handlePageChange={handlePageChange}/>}
                    </TabPanel>
                    <TabPanel value="followers">
                        {list && <List keyword={null} favorites={favorites} list={list} page={page} pageCount={getPageCount(Number(user.followers))} handlePageChange={handlePageChange} handleUserFavorite={handleUserFavorite}/>}
                    </TabPanel>
                    <TabPanel value="following">
                        {list && <List keyword={null} favorites={favorites} list={list} page={page} pageCount={getPageCount(Number(user.following))} handlePageChange={handlePageChange} handleUserFavorite={handleUserFavorite}/>}
                    </TabPanel>
                </Box>
            </TabContext>
        </div>
    )
}

// query user details
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const username = context.query && String(context.query.username);
    const tab = context.query && context.query.tab as unknown as string || 'repos';
    const page = context.query && context.query.page as unknown as number || 1;

    const octokit = new Octokit({
        auth: process.env.TOKEN
    });

    const user = await octokit.request(`GET /users/${username}`, {username});

    let list = await octokit.request(`GET /users/${username}/${tab}`, {username});

    if(tab) {
        list = await octokit.request(`GET /users/${username}/${tab}`, {per_page: 10, page});
    } else {
        list = await octokit.request(`GET /users/${username}/repos`, {per_page: 10, page});
    }

    if(user.data) {
        return { 
            props: {
                user: user.data,
                list: list.data
            } 
        };
    }


    return {
        props: {
            user: null
        }
    }
}