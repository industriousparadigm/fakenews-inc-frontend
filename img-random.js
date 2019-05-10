const generateAvatar = () => {

  fetch("https://randomuser.me/api/?inc=picture&noinfo")
    .then(resp => resp.json())
    .then(p => {
      document.querySelector("#avatar").src = p.results[0].picture.large
    })
}