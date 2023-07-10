const getBtn = document.querySelector("#get");
const postBtn = document.querySelector("#post");

console.log(getBtn);
console.log(postBtn);
getBtn.addEventListener("click", () => {
  fetch("http://localhost:8080/feed/posts")
    .then((res) => res.json())
    .then((resData) => console.log(resData))
    .catch((err) => console.log(err));
});
