"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  count: number;
};

export function CartBadge({ count }: Props) {
  return (
    <AnimatePresence mode="wait">
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 25,
          }}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            backgroundColor: "#009688",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 500,
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
