'use client'

import styles from "./upload.module.css";

const ButtonSubmit = ({ value, ...props }) => {
  
  return (
    <button {...props} className={styles.defaultBtn} >
      {value}
    </button>
  )
}

export default ButtonSubmit