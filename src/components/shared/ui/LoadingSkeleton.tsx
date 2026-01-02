import React from 'react';
import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
    count?: number;
}

/**
 * Loading Skeleton Component
 * Skeleton loader para product cards con glassmorphism
 */
export function LoadingSkeleton({ count = 6 }: LoadingSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className={`${styles.skeleton} glass`}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonCategory} />
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonBrand} />
                        <div className={styles.skeletonText} />
                        <div className={styles.skeletonText} />
                        <div className={styles.skeletonPricing}>
                            <div className={styles.skeletonPrice} />
                            <div className={styles.skeletonPrice} />
                        </div>
                        <div className={styles.skeletonButton} />
                    </div>
                </div>
            ))}
        </>
    );
}
