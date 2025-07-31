"use client";

import Link from "next/link";
import React from "react";

import styles from "./styles.module.scss";
import ShareOnSocial from "@/common/components/ShareOnSocial/ShareOnSocial";
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

const ContentLeft = () => {
  const defaultImage = "/images/radiocrestin_logo.png";

  return (
    <div className={styles.left_content}>
      <div className={styles.image_container}>
        <div className={styles.container_img_plus_thumb}>
          <img
            loading={"lazy"}
            src={defaultImage}
            alt="Radio Creștin"
            width={230}
            height={230}
            className={styles.main_image}
          />
        </div>
      </div>
      <div className={styles.welcome_info}>
        <h2 className={styles.welcome_title}>
          Bine ați venit la Radio Creștin
        </h2>
        <p className={styles.welcome_subtitle}>
          Locul unde sufletul găsește pace
        </p>
      </div>
    </div>
  );
};

const ContentRight = () => {
  const defaultImage = "/images/radiocrestin_logo.png";
  const dailyVerse = {
    text: `„Iubesc pe Domnul, căci El aude glasul meu, cererile mele. Da, El Și-a plecat urechea spre mine, de aceea-L voi chema toată viața mea."`,
    reference: "Psalmii 116:1-2"
  };

  const url = `https://radiocrestin.ro`;
  const message = `Ascultă Radio Creștin: \n${url}`;
  const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
  const whatsappShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  return (
    <div className={styles.right_content}>
      <div className={styles.station_details}>
        <div className={styles.title_container}>
          <img
            src={defaultImage}
            alt="Radio Creștin"
            height={100}
            width={100}
          />
          <h1 className={styles.station_title}>Versetul zilei</h1>
        </div>
        
        <div className={styles.daily_verse}>
          <p className={styles.verse_text}>
            {dailyVerse.text}
          </p>
          <p className={styles.verse_reference}>
            {dailyVerse.reference}
          </p>
        </div>

        <div className={styles.share_on_social}>
          <div className={styles.share_buttons}>
            <a 
              href={facebookShareLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.share_button} ${styles.facebook_button}`}
            >
              <img src="/icons/facebook.svg" alt="Trimite pe Facebook" className={styles.social_icon} />
              Trimite pe Facebook
            </a>
            <a 
              href={whatsappShareLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`${styles.share_button} ${styles.whatsapp_button}`}
            >
              <img src="/icons/whatsapp.svg" alt="Trimite pe WhatsApp" className={styles.social_icon} />
              Trimite pe WhatsApp
            </a>
          </div>
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
          <ContentLeft />
          <ContentRight />
        </div>
      </header>
    </>
  );
};

export default HeaderHomepage;