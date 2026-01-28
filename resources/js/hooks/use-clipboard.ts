// Credit: https://usehooks-ts.com/
import { useCallback, useState } from "react";

export type CopiedValue = string | null;
export type CopyFn = (text: string) => Promise<boolean>;
export type UseClipboardReturn = [CopiedValue, CopyFn];

export function useClipboard(): UseClipboardReturn {
    const [copiedText, setCopiedText] = useState<CopiedValue>(null);

    const copy: CopyFn = useCallback(async (text) => {
        try {
            // Try modern Clipboard API first
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                setCopiedText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                const success = document.execCommand("copy");
                document.body.removeChild(textArea);

                if (success) {
                    setCopiedText(text);
                    return true;
                } else {
                    console.warn("Copy failed");
                    return false;
                }
            }
        } catch (error) {
            console.warn("Copy failed", error);
            setCopiedText(null);
            return false;
        }
    }, []);

    return [copiedText, copy];
}
