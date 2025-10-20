import { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errorMsg?: string;
}

export function FormInput({ label, errorMsg, className = '', ...props }: FormInputProps) {
    return (
        <div>
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label}
                </label>
            )}
            <input
                className={`appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors ${errorMsg ? 'border-red-500 dark:border-red-500' : ''
                    } ${className}`}
                {...props}
            />
            {errorMsg && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorMsg}</p>}
        </div>
    );
}
