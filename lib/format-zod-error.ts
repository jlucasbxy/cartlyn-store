import { ZodError } from "zod";

export function formatZodError(error: ZodError) {
    return error.issues.reduce((d, e) => Object.assign(d, {
        [`${e.path}`]: e.message
    }), {})
}
