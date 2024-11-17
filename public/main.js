const hearts = document.getElementsByClassName("fa-heart");
const trash = document.getElementsByClassName("fa-trash");

Array.from(hearts).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText;
        console.log(name); 
        fetch('favorites', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
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
