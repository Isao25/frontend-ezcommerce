export const truncateString = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

export const hash = (str: string) =>
  str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);