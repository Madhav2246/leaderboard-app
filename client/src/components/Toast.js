import React, { useEffect } from "react";
import "../assets/style.css";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="custom-toast">
      {message}
    </div>
  );
}
