import styles from "@/styles/Menu.module.css";
import { Favorite, Search } from "@mui/icons-material";
import Link from "next/link";

export default function Menu() {
    return (
        <div className={styles.container}>
            <Link className={styles.search} href={'/'}>
                <Search />
                Search
            </Link>
            <Link className={styles.favorite} href={'/liked'}>
                <Favorite />
                Favorite
            </Link>
            
        </div>
    )
}