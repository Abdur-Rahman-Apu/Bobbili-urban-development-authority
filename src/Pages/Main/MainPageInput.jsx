import { motion } from "framer-motion";
import React from "react";

const MainPageInput = ({ label, id, text, placeholder, ltpDetails }) => {
  return (
    <motion.div
      className="flex items-center px-3 mt-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
      viewport={{ once: true }}
    >
      <label
        className="basis-[35%] block font-semibold text-gray-600"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={text}
        className="basis-[65%] w-full px-3 py-2 border rounded-lg max-w-xs font-medium text-gray-600 bg-gray-50 border-gray-300 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
        placeholder={placeholder}
        defaultValue={ltpDetails}
        // readOnly
      />
    </motion.div>
  );
};

export default MainPageInput;
