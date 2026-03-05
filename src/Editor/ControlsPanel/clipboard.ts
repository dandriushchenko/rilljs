export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export async function pasteFromClipboard(): Promise<string> {
  const text = await navigator.clipboard.readText();
  return text;
}
