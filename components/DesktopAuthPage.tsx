"use client";

import React from 'react';
import styles from './DesktopAuthPage.module.css';

export default function DesktopAuthPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to TURF</h1>
        <p className={styles.description}>
          Join the conversation and share your thoughts with the community.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Real-time Discussions</h3>
            <p>Engage in live conversations with other members</p>
          </div>
          <div className={styles.feature}>
            <h3>Community Driven</h3>
            <p>Be part of a growing community of thinkers</p>
          </div>
          <div className={styles.feature}>
            <h3>Secure Platform</h3>
            <p>Your data and privacy are our top priority</p>
          </div>
        </div>
      </div>
    </div>
  );
} 