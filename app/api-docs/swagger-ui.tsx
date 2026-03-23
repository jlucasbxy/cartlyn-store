"use client";

import { useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

type Props = {
  spec: Record<string, unknown>;
};

export default function SwaggerUIComponent({ spec }: Props) {
  useEffect(() => {
    const originalConsoleError = console.error;

    console.error = (...args: unknown[]) => {
      const firstArg = args[0];
      if (typeof firstArg === "string") {
        const isUnsafeLifecycleWarning = firstArg.includes(
          "Using UNSAFE_componentWillReceiveProps in strict mode is not recommended"
        );
        const isModelCollapseWarning = firstArg.includes(
          "Please update the following components: ModelCollapse"
        );

        if (isUnsafeLifecycleWarning || isModelCollapseWarning) {
          return;
        }
      }

      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return <SwaggerUI spec={spec} />;
}
