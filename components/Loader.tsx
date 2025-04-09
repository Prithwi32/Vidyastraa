import React from "react";

const Loader: React.FC<{ size?: number; color?: string }> = ({
  size = 10,
  color = "#3b82f6",
}) => {
  return (
    <div className="flex space-x-1">
      <svg width="26" height="8" className="text-muted-foreground">
        <circle
          fill="hsl(210, 86%, 78%)"
          r="4"
          cx="4"
          cy="4"
          style={{ transformOrigin: "4px 4px" }}
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="scale"
            values="0; 0; 1; 0; 0"
            begin="-0.44999999999999996s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
        <circle
          fill="hsl(134, 39%, 54%)"
          r="4"
          cx="13"
          cy="4"
          style={{ transformOrigin: "13px 4px" }}
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="scale"
            values="0; 0; 1; 0; 0"
            begin="-0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
        <circle
          fill="hsl(31, 85%, 52%)"
          r="4"
          cx="22"
          cy="4"
          style={{ transformOrigin: "22px 4px" }}
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="scale"
            values="0; 0; 1; 0; 0"
            begin="-0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
      </svg>
    </div>
  );
};

export default Loader;
