const levenshtein = require("js-levenshtein");

const LINK_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?/i;

export function replaceMostSimilar(sentence: string, word: string): string {
  const words = sentence.split(" ");
  let minDistance = Infinity;
  let closestWord = "";

  for (const w of words) {
    const distance = levenshtein(w, word);
    if (distance < minDistance) {
      minDistance = distance;
      closestWord = w;
    }
  }

  return sentence.replaceAll(closestWord, word);
}

export function isStartsWithLink(text: string): boolean {
  return LINK_REGEX.test(text);
}
