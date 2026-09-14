'use client';

import Image from 'next/image';
import styles from './DecantsCTABand.module.css';

/**
 * Big dark editorial CTA card driving into the decants section.
 * Pure visual anchor — mirrors the "Probá antes de comprar" moment
 * from the new design between the vitrina rail and the catalog.
 */
export function DecantsCTABand() {
    return (
        <a href="#decants" className={styles.band}>
            <span className={styles.glow} aria-hidden />
            <span className={styles.beamTrack} aria-hidden>
                <span className={styles.beam} />
            </span>
            <div className={styles.inner}>
                <div className={styles.copy}>
                    <span className={styles.eyebrow}>
                        <span className={styles.dot} />
                        La puerta de entrada
                    </span>
                    <h2 className={styles.title}>
                        Probá<br />
                        <span className={styles.accent}>antes</span><br />
                        de comprar
                    </h2>
                    <p className={styles.desc}>
                        Decants de 5ml del frasco original. El perfumero recargable queda de
                        regalo — y si después comprás el frasco, te lo descontamos.
                    </p>
                    <span className={styles.cta}>Ver cómo funciona ↓</span>
                </div>
                <div className={styles.visual}>
                    <span className={styles.ringOuter} aria-hidden />
                    <span className={styles.ringInner} aria-hidden />
                    <Image
                        className={styles.decantsImage}
                        src="/images/decants-banner-v1.png"
                        alt="Cinco decants de perfume de 5 ml"
                        width={2048}
                        height={768}
                        sizes="(max-width: 700px) 92vw, 48vw"
                    />
                    <span className={styles.tag}>Perfumero de regalo</span>
                </div>
            </div>
        </a>
    );
}
