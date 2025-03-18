const mainElement = document.querySelector("main");
const blockQuoteElement = mainElement.querySelector("blockquote");
const loadingElement = mainElement.querySelector(".loading");
const quoteElement = blockQuoteElement.querySelector("p");
const authorElement = blockQuoteElement.querySelector("footer cite");
const copyButtonElement = mainElement.querySelector("#copy");
const refetchButtonElement = mainElement.querySelector("#refetch");

function toggleLoading(status = false) {
  const isLoadingActive = loadingElement.classList.contains("active");
  if (isLoadingActive && !status) {
    loadingElement.classList.remove("active");
    copyButtonElement.disabled = false;
    refetchButtonElement.disabled = false;
    return;
  }
  loadingElement.classList.add("active");
  copyButtonElement.disabled = true;
  refetchButtonElement.disabled = true;
}

async function fetchRandomQuoteFromApi() {
  toggleLoading(true);
  const url = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
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
  } catch (error) {
    console.error(error);
  } finally {
    toggleLoading(false);
  }
}

function copyClickHandler() {
  navigator.clipboard.writeText(
    `"${quoteElement.innerText}" -${authorElement.innerText}`
  );
  alert("Copy quote into your clipboard");
  document.activeElement?.blur?.();
}

function refetchClickHandler() {
  fetchRandomQuoteFromApi();
  document.activeElement?.blur?.();
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRandomQuoteFromApi();
});

copyButtonElement.addEventListener("click", copyClickHandler);

refetchButtonElement.addEventListener("click", refetchClickHandler);
