
import React from "react";

interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium leading-none mb-2 block">
    {children}
  </label>
);

export default Label;
