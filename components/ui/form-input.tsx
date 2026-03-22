import { forwardRef, type InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMsg?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, errorMsg, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`appearance-none rounded-lg block w-full px-4 py-2.5 border placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800/80 focus:outline-none focus-ring text-sm transition-all duration-200 ${
            errorMsg
              ? "border-red-400 dark:border-red-500"
              : "border-gray-200 dark:border-gray-600/80 hover:border-gray-300 dark:hover:border-gray-500"
          } ${className}`}
          {...props}
        />
        {errorMsg && (
          <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
            {errorMsg}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
