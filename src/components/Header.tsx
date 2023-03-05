import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectedTheme, setTheme, toggleTheme } from "@/store/themeSlice";
import styles from "@/styles/Header.module.css";
import { Home } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Header() {
    const router = useRouter();
    const { theme } = useAppSelector(selectedTheme);
    const dispatch = useAppDispatch();

    //dispatch initial system theme
    useEffect(() => {
        const systemMatchStore = window.matchMedia(`(prefers-color-scheme: ${theme})`).matches;
        if(systemMatchStore) {
            document.documentElement.className = theme;
        } else {
            dispatch(toggleTheme(theme));
            document.documentElement.className = theme === 'dark' ? 'light' : 'dark';
        }

        // add system theme event trigger
        window.matchMedia(`(prefers-color-scheme: ${theme})`)
            .addEventListener('change', event => {
                dispatch(toggleTheme(theme));
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleThemeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setTheme(event.target.checked ? 'dark' : 'light'));
        document.documentElement.className = event.target.checked ? 'dark' : 'light';
    }

    const getTitle = (path: string) => {
        switch(path) {
            case '/':
                return (<h1 className={styles.title}>Search</h1>)
            case '/liked':
                return (<h1 className={styles.title}>Favorite</h1>)
            default:
                return <Home onClick={() => router.push('/')}/>;
        }
    }
    return (
        <header className={styles.header}>
            {getTitle(router.pathname)}
            <Switch 
                checked={theme === 'dark'}    
                className={styles.toggle} 
                aria-label='Toggle dark mode' 
                onChange={handleThemeToggle}
            />
        </header>
    )
}