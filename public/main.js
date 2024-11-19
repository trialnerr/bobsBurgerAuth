const hearts = document.getElementsByClassName("fa-heart");
const trash = document.getElementsByClassName("fa-trash");
const getMoreBtn = document.querySelector('.getMore');
const charactersUl = document.querySelector('.characters');

charactersUl.addEventListener('click', async (event) => {
  console.log(event.target);
  if (event.target.classList.contains('fa-heart')) {
    const name = event.target.closest('li').querySelector('span').innerText;

    try {
      const response = await fetch('favorites', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name,
        })
      });
      if (!response.ok) {
        console.error(
          `Error adding character to favorites, ${response.status}, ${response.statusText}`
        );
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  }
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        console.log('trash', name);
        fetch('favorites', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


getMoreBtn.addEventListener('click', async () => {
  let randCount = Math.floor(Math.random() * 25); 

  const url = `https://bobsburgers-api.herokuapp.com/characters/?limit=20&skip=${20 * randCount}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Error fetching more characters, ${response.status}, ${response.statusText}`
      );
    }
    const characters = await response.json();
    const charactersListNodes = characters.map(
      (charObj) => `<li class="character"><span>${charObj.name} </span><span><i class="fa fa-heart" aria-hidden="true"></i></span></li>`
    );
    const charactersUl = document.querySelector('.characters');
    charactersUl.innerHTML = charactersListNodes.join('');
    // window.location.reload();
  } catch (error) {
    console.error(error); 
  }
})