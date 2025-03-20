function generateQuoteWithAuthorInString(quote, author) {
  return `"${quote}" -${author}`;
}
function generateTweetUrl(stringContent = "") {
  if (!stringContent) {
    return "";
  }
  const base = new URL("https://twitter.com/intent/tweet");
  const params = new URLSearchParams({
    text: encodeURI(stringContent),
  });
  return `${base.toString()}?${params.toString()}`;
}

function generateRandomImageUrl() {
  const array = new Uint32Array(1);
  globalThis.crypto.getRandomValues(array);
  return randomImageUrl + array[0];
}

function blurCurrentActiveElement() {
  // when we click any element then that element in focus mode which bee link in active mode
  // handle this case we would be require to execute below code;
  if (typeof document === "undefined") {
    return;
  }
  document.activeElement?.blur?.();
}
