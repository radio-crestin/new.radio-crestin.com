import React, { useContext } from "react";

import styles from "./styles.module.scss";
import { IStation } from "@/common/models/Station";
import { Context } from "@/common/context/ContextProvider";


export default function ShareOnSocial() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("ShareOnSocial must be used within ContextProvider");
  }
  const { ctx } = context;
  const station = ctx?.selectedStation as IStation;
  if(!station) return null;
  const url = `https://share.radiocrestin.ro/${station.slug}`
  const message = `Ascultă și tu ${station.title}: \n${url}`
  const facebookShareLink =  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
  const whatsappShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  return (
      <div className={styles.buttonContainer}>
        <a href={facebookShareLink} target="_blank" className={`${styles.button} ${styles.facebookButton}`}>
            <img src="./icons/facebook.svg" alt="Trimite pe Facebook" className={`${styles.socialIcon} ${styles.facebookSocialIcon}`} />
            Trimite pe Facebook
        </a>
        <a href={whatsappShareLink} target="_blank" className={`${styles.button} ${styles.whatsappButton}`}>
          <img src="./icons/whatsapp.svg" alt="Trimite pe Whatsapp" className={`${styles.socialIcon} ${styles.whatsappSocialIcon}`} />
          Trimite pe WhatsApp
        </a>
      </div>

);
}
