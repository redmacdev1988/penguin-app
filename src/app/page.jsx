import Image from "next/image";
import styles from "./page.module.css";
import FrontPageStock from "public/frontPageA-to-Z.jpg";
import Button from "@/components/NavLinkButton/NavLinkButton";

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
        <Image src={FrontPageStock} alt="" className={styles.img} />
      </div>
      <ul>
        <li>images of all students here</li>
        <li>with their statuses</li>
      </ul>
    </div>
  );
}
