const mainElement = document.querySelector("main");
const blockQuoteElement = mainElement.querySelector("blockquote");
const loadingElement = mainElement.querySelector(".loading");
const quoteElement = blockQuoteElement.querySelector("p");
const authorElement = blockQuoteElement.querySelector("footer cite");
const copyButtonElement = mainElement.querySelector("#copy");
const refetchButtonElement = mainElement.querySelector("#refetch");
const downloadButtonElement = mainElement.querySelector("#download");
const tweetButtonElement = mainElement.querySelector(".twitter-share-button");
const actionElementsWrapper =
  blockQuoteElement.querySelector(".action-wrapper");
const backgroundImageElement = document.querySelector(".background-image");

function toggleLoading(status = false) {
  const isLoadingActive = loadingElement.classList.contains("active");
  if (isLoadingActive && !status) {
    loadingElement.classList.remove("active");
    copyButtonElement.disabled = false;
    refetchButtonElement.disabled = false;
    downloadButtonElement.disabled = false;
    tweetButtonElement.classList.remove("isDisabled");

    return;
  }
  loadingElement.classList.add("active");
  copyButtonElement.disabled = true;
  refetchButtonElement.disabled = true;
  downloadButtonElement.disabled = true;
  tweetButtonElement.classList.add("isDisabled");
}

async function fetchRandomQuoteFromApi() {
  toggleLoading(true);
  const url = randomQuoteApiUrl;
  const options = { method: "GET", headers: { accept: "application/json" } };
  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    const { data } = responseData || {};
    const {
      author = "anonymous",
      content = "Something went wrong while fetching your data",
    } = data || {};

    quoteElement.innerText = content;
    authorElement.innerText = author;
    tweetButtonElement.setAttribute(
      "href",
      generateTweetUrl(generateQuoteWithAuthorInString(content, author))
    );
    backgroundImageElement.setAttribute("src", generateRandomImageUrl());
  } catch (error) {
    console.log("Failed to get data from api:", error);
    alert("Could not able to fetch new quote from api!!!");
  } finally {
    toggleLoading(false);
  }
}

function copyClickHandler() {
  navigator.clipboard.writeText(
    generateQuoteWithAuthorInString(
      quoteElement.innerText,
      authorElement.innerText
    )
  );
  alert("Copy quote into your clipboard");
  blurCurrentActiveElement();
}

function refetchClickHandler() {
  fetchRandomQuoteFromApi();
  blurCurrentActiveElement();
}

async function downloadClickHandler() {
  if (!domtoimage) {
    alert("Something went wrote while downloading as png!!!");
  }
  actionElementsWrapper.style.opacity = 0;
  try {
    const dataUrl = await domtoimage.toJpeg(mainElement, { quality: 0.95 });
    var link = document.createElement("a");
    const content = [quoteElement.innerText, authorElement.innerText]
      .join(" by ")
      .split(" ")
      .map((item) => item.toLocaleLowerCase())
      .join("-");
    link.download = `${content}.jpeg`;
    link.href = dataUrl;
    link.click();
    link.remove();
    blurCurrentActiveElement();
  } catch (error) {
    console.log("Download Issue Found Error:", error);
    alert("Something went wrote while downloading as png!!!");
  } finally {
    actionElementsWrapper.style.opacity = 1;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRandomQuoteFromApi();
  copyButtonElement.addEventListener("click", copyClickHandler);
  refetchButtonElement.addEventListener("click", refetchClickHandler);
  downloadButtonElement.addEventListener("click", downloadClickHandler);
  tweetButtonElement.addEventListener("click", () => {
    blurCurrentActiveElement();
  });
});
