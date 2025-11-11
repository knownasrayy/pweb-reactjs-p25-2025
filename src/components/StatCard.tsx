import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode; 
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.textWrapper}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{value}</span>
      </div>
    </div>
  );
};

export default StatCard;