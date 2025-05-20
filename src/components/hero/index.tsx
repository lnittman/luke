'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function Hero() {
    return (
        <motion.div
            className="relative"
            style={{ width: 300, height: 500 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Image
                src="/assets/hero.png"
                alt="Hero Image"
                fill
                priority
                className="object-contain object-center"
            />
        </motion.div>
    );
}
