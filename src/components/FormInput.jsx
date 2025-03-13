import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete = "off",
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete} // ✅ 추가된 부분
        className={`w-full p-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
