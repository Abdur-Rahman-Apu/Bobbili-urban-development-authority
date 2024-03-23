import { motion } from "framer-motion";
import React from "react";

const UpdateProfileInput = ({
  id,
  name,
  placeholder,
  type,
  label,
  register,
}) => {
  // Define default values for type and placeholder if not provided
  const inputType = type || "text";

  return (
    <motion.div
      className="my-4 mx-3 flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 1 } }}
      viewport={{ once: true }}
    >
      <label htmlFor={id} className="block mb-1 font-semibold text-gray-600">
        {label}
      </label>
      <input
        type={inputType}
        id={id}
        name={name}
        placeholder={placeholder}
        {...register(id)}
        className="w-full px-3 py-2 border rounded-lg max-w-xs text-gray-600 bg-gray-50 border-gray-400 focus:border-gray-600 focus:outline-none focus:ring-2 ring-violet-200"
      />
    </motion.div>
  );
};

export default UpdateProfileInput;
