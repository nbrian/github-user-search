import styles from "@/styles/Menu.module.css";
import { Favorite, Search } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Menu() {
    const router = useRouter();
    const [selected, setSelected] = useState('search');
    useEffect(() => {
        console.log(router.asPath);
        if(router.asPath.includes('/liked')) {
            setSelected('favorite');
        } else {
            setSelected('search');
        }

    }, [router]);
    return (
        <div className={styles.container}>
            <Link className={selected === 'search' ? styles.selected : styles.search} href={'/'}>
                <Search />
                <span>Search</span>
            </Link>
            <Link className={selected === 'favorite' ? styles.selected : styles.favorite} href={'/liked'}>
                <Favorite />
                <span>Favorite</span>
            </Link>
            
        </div>
    )
}