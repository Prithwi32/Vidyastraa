import React from "react";

const Loader: React.FC<{ size?: number; color?: string }> = ({
  size = 10,
  color = "#3b82f6", 
}) => {
  return (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="animate-bounce"
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            borderRadius: "50%",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Loader;
