import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectedTheme, setTheme } from "@/store/themeSlice";
import styles from "@/styles/Header.module.css";
import { Home } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useRouter } from "next/router";

export default function Header() {
    const router = useRouter();
    const { theme } = useAppSelector(selectedTheme);
    const dispatch = useAppDispatch();

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