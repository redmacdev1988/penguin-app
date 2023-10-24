import Image from "next/image";
import styles from "./page.module.css";
import PenguinBanner from "public/horizontal-logo-title.png";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* <div className={styles.item}>
        <h1 className={styles.title}>
          Native English
        </h1>
        <p className={styles.desc}>
          Divide and Conquer
        </p>
        <Button url="/tutorial" text="Start Here"/>
      </div> */}
      <div className={styles.item}>
        <Image src={PenguinBanner} alt="" className={styles.img} />
      </div>
      
    </div>
  );
}