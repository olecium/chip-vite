/// https://blog.logrocket.com/when-to-use-never-and-unknown-in-typescript-5e4d6c5799ad/

export function isUndefinedOrNull<T>(value: T | undefined | null): value is undefined | null {
    if (value === undefined) {
        return true;
    }
    if (value === null) {
        return true;
    }
    return false;
}

export function isNotUndefinedOrNull<T>(value: T | null | undefined): value is T {
    return !isUndefinedOrNull(value);
}

export function isUndefinedOrEmpty(value: string | undefined | null): value is undefined | null {
    if (isUndefinedOrNull(value)) {
        return true;
    }
    if (value === ``) {
        return true;
    }
    return false;
}
