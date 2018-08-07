const reviewTitle = document.getElementById('review-title');
const numberRating = document.createElement('form');
numberRating.id = "number-rating";
numberRating.name = "number-rating";
const ratingLabel = document.createElement('label');
ratingLabel.for = "rating";
ratingLabel.innerHTML = "Enter rating 0 to 5: ";
numberRating.appendChild(ratingLabel);
const ratingInput = document.createElement('input');
ratingInput.type = "number";
ratingInput.name = "rating";
ratingInput.id = "rating";
ratingInput.value = "0";
ratingInput.min = "0";
ratingInput.max = "5";
numberRating.appendChild(ratingInput);
reviewTitle.insertAdjacentElement('afterend', numberRating);

const starNumber = 5;
const starRatings = document.createElement('section');
starRatings.id = "review-star-ratings";
const starList = document.createElement('ul');
starList.id = 'review-star-list';
for (var i=0; i < starNumber; i++) {
  const starItem = document.createElement('li');
  starItem.id = 'review-star-item';
  const starButton = document.createElement('button');
  starButton.id = 'star' + (i+1).toString();
  const starIcon = document.createElement('i');
  starIcon.id = "star24";
  starIcon.className = "material-icons";
  starIcon.innerHTML = "star_border";
  starButton.appendChild(starIcon);
  starItem.appendChild(starButton);
  starList.appendChild(starItem);
}
starRatings.appendChild(starList);
numberRating.insertAdjacentElement('afterend', starRatings);

const reviewForm = document.createElement('form');
reviewForm.className = "review-form";
reviewForm.id = "review-form";
reviewForm.name = "review-form";
const reviewerName = document.createElement('section');
reviewerName.id = "reviewer-name";
const nameLabel = document.createElement('label');
nameLabel.for = "name";
nameLabel.innerHTML = "Enter your name: ";
reviewerName.appendChild(nameLabel);
const nameInput = document.createElement('input');
nameInput.type = "text";
nameInput.name = "name";
nameInput.id = "name";
nameInput.style = "margin-right:25px;";
nameInput.required;
reviewerName.appendChild(nameInput);
reviewForm.appendChild(reviewerName);
const comments = document.createElement('textarea');
comments.form = "review-form";
comments.name = "comments";
comments.className = "review-text";
comments.id = "comments";
comments.placeholder = "Enter your review here.";
comments.maxlength = "10000";
comments.style = "height:100px;";
reviewForm.appendChild(comments);
starRatings.insertAdjacentElement('afterend', reviewForm);

const rating1 = document.getElementById('star1');
const rating2 = document.getElementById('star2');
const rating3 = document.getElementById('star3');
const rating4 = document.getElementById('star4');
const rating5 = document.getElementById('star5');
const ratingOffset = document.querySelector("#rating");
var reviewer_rating = 0;

ratingOffset.onclick = function(event){
  reviewer_rating = ratingOffset.value;
}

rating1.onclick = function(event){
  if (rating1.value === "1") {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating1.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating1.value = "1";
    reviewer_rating = 1;
  }
};

rating2.onclick = function(event){
  if (rating2.value === "1") {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating1.value = "0";
    rating2.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating1.value = "1";
    rating2.value = "1";
    reviewer_rating = 2;
  }
};

rating3.onclick = function(event){
  if (rating3.value === "1") {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating1.value = "0";
    rating2.value = "0";
    rating3.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating1.value = "1";
    rating2.value = "1";
    rating3.value = "1";
    reviewer_rating = 3;
  }
};

rating4.onclick = function(event){
  if (rating4.value === "1") {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating1.value = "0";
    rating2.value = "0";
    rating3.value = "0";
    rating4.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating4.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating1.value = "1";
    rating2.value = "1";
    rating3.value = "1";
    rating4.value = "1";
    reviewer_rating = 4;
  }
};

rating5.onclick = function(event){
  if (rating5.value === "1") {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
    rating1.value = "0";
    rating2.value = "0";
    rating3.value = "0";
    rating4.value = "0";
    rating5.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating3.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating4.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating5.innerHTML = "<i id='star24' class='material-icons'>star</i>";
    rating1.value = "1";
    rating2.value = "1";
    rating3.value = "1";
    rating4.value = "1";
    rating5.value = "1";
    reviewer_rating = 5;
  }
};

/**
 * Get a parameter by name from page URL.
 */
getParametersByName = (name, url) => {
  if (!url)
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^?&#]*)|&|#|$|)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const rest_id = parseInt(getParametersByName("restaurant_id"));

/**
 * Get current restaurant from page URL.
 */
DBHelper.fetchRestaurantById(rest_id, (error, restaurant) => {
  self.restaurant = restaurant;
  if (!restaurant) {
    return;
  }
  fillBreadcrumb();
});

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
// Ammended to follow aria breadcrumb design pattern as recommended by Mentor
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const elma = document.createElement('a');
  elma.href = DBHelper.urlForRestaurant(restaurant);
  elma.setAttribute("aria-current", "page");
  elma.innerHTML = restaurant.name;
  li.appendChild(elma);
  breadcrumb.appendChild(li);
}

// This code was copied from an example given at:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// by Mozilla Contributors (MDN), is licensed under CC-BY-SA 2.5, or all open source licenses.

/**
 * Update review from form data and post to database.
 */

const getReviewData = (url = ``) => {
  // Default options are marked with *
    return fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "omit", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "client", // no-referrer, *client
    })
    .then(response => {
      return response.json(); // parses response to JSON
    }).then(data => {
      document.getElementById("name").setAttribute("value", data.name);
      document.getElementById("comments").innerHTML = data.comments;
      document.getElementById('rating').setAttribute("value", data.rating.toString());

      const star1 = document.getElementById('star1');
      const star2 = document.getElementById('star2');
      const star3 = document.getElementById('star3');
      const star4 = document.getElementById('star4');
      const star5 = document.getElementById('star5');
      switch (data.rating){
        case 0:
          star1.value = '0';
          star1.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          star2.value = '0';
          star2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          star3.value = '0';
          star3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          star4.value = '0';
          star4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          star5.value = '0';
          star5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          break;
        case 1:
        star1.value = '1';
        star1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star2.value = '0';
        star2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star3.value = '0';
        star3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star4.value = '0';
        star4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star5.value = '0';
        star5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          break;
        case 2:
        star1.value = '1';
        star1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star2.value = '1';
        star2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star3.value = '0';
        star3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star4.value = '0';
        star4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star5.value = '0';
        star5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          break;
        case 3:
        star1.value = '1';
        star1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star2.value = '1';
        star2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star3.value = '1';
        star3.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star4.value = '0';
        star4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star5.value = '0';
        star5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          break;
        case 4:
        star1.value = '1';
        star1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star2.value = '1';
        star2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star3.value = '1';
        star3.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star4.value = '1';
        star4.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star5.value = '0';
        star5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
          break;
        case 5:
        star1.value = '1';
        star1.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star2.value = '1';
        star2.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star3.value = '1';
        star3.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star4.value = '1';
        star4.innerHTML = "<i id='star24' class='material-icons'>star</i>";
        star5.value = '1';
        star5.innerHTML = "<i id='star24' class='material-icons'>star</i>";
          break;
        default:
        star1.value = '0';
        star1.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star2.value = '0';
        star2.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star3.value = '0';
        star3.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star4.value = '0';
        star4.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
        star5.value = '0';
        star5.innerHTML = "<i id='star24' class='material-icons'>star_border</i>";
      }
    })
    .catch(error => console.error(`Fetch Error =\n`, error))
};

const reviewData = getReviewData('http://localhost:1337/reviews/' + getParametersByName('id').toString());

/**
 * Update review from form data and post to database.
   The following is based on guidance from
   https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
   (forwarded by mentor), https://ponyfoo.com/articles/serviceworker-messagechannel-postmessage (Nicolas Bevacqua),
   http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html#.W2OgDVVKjmF (Craig Russell)
 */
var updateView = document.querySelector("#update-review");

updateView.addEventListener("click", function(event){
  event.preventDefault();
  const data = {
      restaurant_id: parseInt(getParametersByName("restaurant_id")),
      name: document.getElementById("name").value,
      rating: ((document.getElementById("name").value > reviewer_rating) ? document.getElementById("name").value : reviewer_rating),
      comments: document.getElementById("comments").value,
      old_id: parseInt(getParametersByName("id"))
  };
  console.log(data);
  store.postitems('readwrite').then( postitems => {
    return postitems.put(data);
  })
  .then(() => {
    navigator.serviceWorker.ready.then(function(reg) {
      console.log("REGISTERING Updatesync");
      return reg.sync.register('Updatesync');
    });
  });
});

navigator.serviceWorker.addEventListener('message', function handler (event) {
  console.log("RECIEVED MESSAGE: ", event.data);
  if (event.data){
    var newUrl = 'http://localhost:8000/restaurant.html?id=' + event.data;
    window.location.replace(newUrl);
  }
});
