import Image from "next/image";
import styles from "./page.module.css";
import FrontPageStock from "public/frontPageA-to-Z.jpg";
import Button from "@/components/Button/Button";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <h1 className={styles.title}>
          Native English
        </h1>
        <p className={styles.desc}>
          Divide and Conquer
        </p>
        <Button url="/tutorial" text="Start Here"/>
      </div>
      <div className={styles.item}>
        <Image src={FrontPageStock} alt="" className={styles.img} />
      </div>

 


    </div>
  );
}
