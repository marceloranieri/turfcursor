"use client";

import React from 'react';
import styles from './loading.module.css';

export default function AuthLoadingPage() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>TURF</div>
      <div className={styles.spinner}></div>
      <p className={styles.message}>Completing your sign-in...</p>
    </div>
  );
} 