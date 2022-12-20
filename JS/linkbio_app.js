const mainShareButton = document.querySelectorAll(".share-button")
const shareButtons = document.querySelectorAll(".tile-share-button")
// console.log(shareButtons)

async function copyText(e) {
// Prevent Button from Going to the Site 
// Copy Link 
    e.preventDefault();
    const link = this.getAttribute("link");
    // console.log(link)
    try {
        await navigator.clipboard.writeText(link);
        alert("Copied the link: " + link)
    } catch (err) {
        console.error(err);
    }
}

mainShareButton.forEach(mainShareButton => mainShareButton.addEventListener("click", copyText))
shareButtons.forEach(shareButtons => shareButtons.addEventListener("click", copyText))