import { InputHTMLAttributes, forwardRef } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errorMsg?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, errorMsg, className = '', ...props }, ref) => {
        return (
            <div>
                {label && (
                    <label htmlFor={props.id} className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 text-base transition-colors ${errorMsg ? 'border-red-500 dark:border-red-500' : ''
                        } ${className}`}
                    {...props}
                />
                {errorMsg && <p className="mt-1.5 text-base text-red-600 dark:text-red-400">{errorMsg}</p>}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';
