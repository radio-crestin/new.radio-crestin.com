"use client";

import Link from "next/link";
import React from "react";

import styles from "./styles.module.scss";
import ThemeToggle from "@/common/components/ThemeToggle/ThemeToggle";
import WhatsAppButton from "@/common/components/WhatsAppButton/WhatsAppButton";

const Navigation = () => (
  <nav className={styles.nav}>
    <div className={styles.internal_links}>
      <Link href={"/"} className={styles.logo}>
        <img
          loading={"lazy"}
          src={"/images/radiocrestin_logo.png"}
          width={40}
          height={40}
          alt={"AppStore Image Radio Crestin"}
        />
        <h1>Radio Creștin</h1>
      </Link>
    </div>
    <div className={styles.right_content}>
      <ThemeToggle />
      <WhatsAppButton />
    </div>
  </nav>
);

const ContentCenter = () => {
  const url = `https://radiocrestin.ro`;
  const message = `Ascultă Radio Creștin: \n${url}`;
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
  const whatsappShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  return (
    <div className={styles.center_content}>
      <div className={styles.welcome_section}>
        <h1 className={styles.welcome_title}>Bine ați venit</h1>
        <div className={styles.daily_verse}>
          <p className={styles.verse_text}>
            „Iubesc pe Domnul, căci El aude glasul meu, cererile mele. Da, El Și-a
            plecat urechea spre mine, de aceea-L voi chema toată viața mea.&rdquo;
          </p>
          <p className={styles.verse_reference}>- Psalmii 116:1-2</p>
        </div>
        <div className={styles.share_buttons}>
          <a href={facebookShareLink} target="_blank" rel="noopener noreferrer" className={`${styles.share_button} ${styles.facebook_button}`}>
            <img src="./icons/facebook.svg" alt="Trimite pe Facebook" className={styles.social_icon} />
            Trimite pe Facebook
          </a>
          <a href={whatsappShareLink} target="_blank" rel="noopener noreferrer" className={`${styles.share_button} ${styles.whatsapp_button}`}>
            <img src="./icons/whatsapp.svg" alt="Trimite pe WhatsApp" className={styles.social_icon} />
            Trimite pe WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

const HeaderHomepage = () => {
  return (
    <>
      <header className={styles.container}>
        <Navigation />
        <div className={styles.content_section}>
          <ContentCenter />
        </div>
        <img
          className={styles.vector_yellow}
          src={"/images/vector_yellow.svg"}
          alt={"vector_yellow"}
        />
      </header>
    </>
  );
};

export default HeaderHomepage;
