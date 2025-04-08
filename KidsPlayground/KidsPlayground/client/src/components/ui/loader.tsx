import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = "md", 
  className = "",
  message 
}) => {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClass} rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin`}></div>
      {message && (
        <p className="mt-4 text-center text-primary-700 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
