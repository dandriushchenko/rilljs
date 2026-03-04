export function copyToClipboard(text: string) {
    // const selection = document.getSelection();
    // const range = selection ? selection.getRangeAt(0) : undefined;

    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // if (selection && range) {
    //     selection.empty();
    //     selection.addRange(range);
    // }
}

export async function pasteFromClipboard(): Promise<string> {
    const text = await navigator.clipboard.readText();
    return text;
}
