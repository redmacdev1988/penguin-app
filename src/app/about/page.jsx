import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import Button from "@/components/Button/Button";

const About = () => {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image
          src="https://images.pexels.com/photos/3194521/pexels-photo-3194521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          fill={true}
          alt=""
          className={styles.img}
        />
        <div className={styles.imgText}>
          <h1 className={styles.imgTitle}>Digital Storytellers</h1>
          <h2 className={styles.imgDesc}>
            Handcrafting award winning digital experiences
          </h2>
        </div>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.item}>
          <h1 className={styles.title}>Who Are We?</h1>
          <p className={styles.desc}>
            This site a treasure trove of tutorials that breaks down the English language.
            <br />
            <br />
            In order to get the most value from them, go through it one by and one, and be sure to practice a lot.
            The tutorials can help you achieve near native college level writing, reading, and speaking. 
          </p>
        </div>
        <div className={styles.item}>
          <h1 className={styles.title}>Divide and Conquer</h1>
          <p className={styles.desc}>
            Follow easy to use tutorials that will teach the English language. 
            <br />
            You will learn about:
            <br />
            <br /> - Nouns, Adjectives, Adverbs, and Verbs.
            <br /> - Twelve grammar frameworks: present, past, and future (simple, perfect, continuous, and perfect continuous)
            <br /> - Four Sentence structures: simple, compound, complex, and compound-complex
            <br /> - Infinitives
            <br /> - 100 most important prepositions used in English.
          </p>
          <Button url="/contact" text="Contact" />
        </div>
      </div>
    </div>
  );
};

export default About;
