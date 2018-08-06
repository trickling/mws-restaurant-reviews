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
starRatings.id = 'review-star-ratings';
const starList = document.createElement('ul');
starList.id = 'review-star-list';
for (var i=0; i < starNumber; i++) {
  const starItem = document.createElement('li');
  starItem.id = 'review-star-item';
  const starButton = document.createElement('button');
  starButton.id = 'star' + (i+1).toString();
  starButton.value = "0";
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
nameInput.style = "margin-right:25px;";
nameInput.id = "name";
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
getParameterByName = (name, url) => {
  // console.log("url: ", url);
  if (!url)
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const rest_id = parseInt(getParameterByName("restaurant_id"));

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

/**
 * Create review from form data and post to database.
   The following is based on guidance from
   https://www.twilio.com/blog/2017/02/send-messages-when-youre-back-online-with-service-workers-and-background-sync.html
   (forwarded by mentor), https://ponyfoo.com/articles/serviceworker-messagechannel-postmessage (Nicolas Bevacqua),
   http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html#.W2OgDVVKjmF (Craig Russell)
 */
var postView = document.querySelector("#post-review");

postView.addEventListener('click', function(event){
  event.preventDefault();
  const data = {
      restaurant_id: parseInt(getParameterByName("restaurant_id")),
      name: document.getElementById("name").value,
      rating: ((document.getElementById("name").value > reviewer_rating) ? document.getElementById("name").value : reviewer_rating),
      comments: document.getElementById("comments").value
  };
  store.postitems('readwrite').then( postitems => {
    return postitems.put(data);
  })
  .then(() => {
    navigator.serviceWorker.ready.then(function(reg) {
      console.log("REGISTERING Postsync");
      return reg.sync.register('Postsync');
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
