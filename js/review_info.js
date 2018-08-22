const reviewTitle = document.getElementById('review-title');
const numberRating = document.createElement('form');
numberRating.id = "number-rating";
numberRating.name = "number-rating";
const ratingInput = document.createElement('input');
ratingInput.type = "number";
ratingInput.name = "rating";
ratingInput.id = "rating";
ratingInput.value = "0";
ratingInput.min = "0";
ratingInput.max = "5";
const ratingLabel = document.createElement('label');
ratingLabel.htmlFor = ratingInput.id;
ratingLabel.innerHTML = "Enter rating 0 to 5: ";
numberRating.appendChild(ratingLabel);
numberRating.appendChild(ratingInput);
reviewTitle.insertAdjacentElement('afterend', numberRating);
const star = '\u2605';
const star_border = '\u2606';
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
  starButton.innerHTML = star_border;
  starItem.appendChild(starButton);
  starList.appendChild(starItem);
}
starRatings.appendChild(starList);
numberRating.insertAdjacentElement('afterend', starRatings);

const reviewForm = document.createElement('form');
reviewForm.id = "review-form";
reviewForm.name = "review-form";
const reviewerName = document.createElement('section');
reviewerName.id = "reviewr-name";
const nameInput = document.createElement('input');
nameInput.type = "text";
nameInput.name = "name";
nameInput.id = "name";
nameInput.required;
const nameLabel = document.createElement('label');
nameLabel.htmlFor = nameInput.id;
nameLabel.innerHTML = "Enter your name: ";
reviewerName.appendChild(nameLabel);
reviewerName.appendChild(nameInput);
reviewForm.appendChild(reviewerName);
const comments = document.createElement('textarea');
comments.form = "review-form";
comments.name = "comments";
comments.className = "review-text";
comments.id = "comments";
comments.placeholder = "Enter your review here.";
comments.maxlength = "10000";
const commentsLabel = document.createElement('label');
commentsLabel.htmlFor = comments.id;
commentsLabel.innerHTML = "Enter review text:";
commentsLabel.id = "comments-label";
reviewForm.appendChild(commentsLabel);
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
    rating1.innerHTML = star_border;
    rating2.innerHTML = star_border;
    rating3.innerHTML = star_border;
    rating4.innerHTML = star_border;
    rating5.innerHTML = star_border;
    rating1.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = star;
    rating1.value = "1";
    reviewer_rating = 1;
  }
};

rating2.onclick = function(event){
  if (rating2.value === "1") {
    rating1.innerHTML = star_border;
    rating2.innerHTML = star_border;
    rating3.innerHTML = star_border;
    rating4.innerHTML = star_border;
    rating5.innerHTML = star_border;
    rating1.value = "0";
    rating2.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = star;
    rating2.innerHTML = star;
    rating1.value = "1";
    rating2.value = "1";
    reviewer_rating = 2;
  }
};

rating3.onclick = function(event){
  if (rating3.value === "1") {
    rating1.innerHTML = star_border;
    rating2.innerHTML = star_border;
    rating3.innerHTML = star_border;
    rating4.innerHTML = star_border;
    rating5.innerHTML = star_border;
    rating1.value = "0";
    rating2.value = "0";
    rating3.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = star;
    rating2.innerHTML = star;
    rating3.innerHTML = star;
    rating1.value = "1";
    rating2.value = "1";
    rating3.value = "1";
    reviewer_rating = 3;
  }
};

rating4.onclick = function(event){
  if (rating4.value === "1") {
    rating1.innerHTML = star_border;
    rating2.innerHTML = star_border;
    rating3.innerHTML = star_border;
    rating4.innerHTML = star_border;
    rating5.innerHTML = star_border;
    rating1.value = "0";
    rating2.value = "0";
    rating3.value = "0";
    rating4.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = star;
    rating2.innerHTML = star;
    rating3.innerHTML = star;
    rating4.innerHTML = star;
    rating1.value = "1";
    rating2.value = "1";
    rating3.value = "1";
    rating4.value = "1";
    reviewer_rating = 4;
  }
};

rating5.onclick = function(event){
  if (rating5.value === "1") {
    rating1.innerHTML = star_border;
    rating2.innerHTML = star_border;
    rating3.innerHTML = star_border;
    rating4.innerHTML = star_border;
    rating5.innerHTML = star_border;
    rating1.value = "0";
    rating2.value = "0";
    rating3.value = "0";
    rating4.value = "0";
    rating5.value = "0";
    reviewer_rating = 0;
  } else {
    rating1.innerHTML = star;
    rating2.innerHTML = star;
    rating3.innerHTML = star;
    rating4.innerHTML = star;
    rating5.innerHTML = star;
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
getParameterByName = function(name, url) {
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
DBHelper.fetchRestaurantById(rest_id, function(error, restaurant) {
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
fillBreadcrumb = function(restaurant=self.restaurant) {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const elma = document.createElement('a');
  elma.href = DBHelper.urlForRestaurant(restaurant);
  elma.setAttribute("aria-current", "page");
  elma.innerHTML = restaurant.name;
  li.appendChild(elma);
  breadcrumb.appendChild(li);
}

var postView = document.querySelector("#post-review");
// Based on guidance from Udacity MWS Webinar Stage 3, Elisa Romondia, Lorenzo Zaccagnini
postView.addEventListener('click', function(event) {
  event.preventDefault();
  var data = {
      restaurant_id: parseInt(getParameterByName("restaurant_id")),
      name: document.getElementById("name").value,
      rating: ((document.getElementById("name").value > reviewer_rating) ? document.getElementById("name").value : reviewer_rating),
      comments: document.getElementById("comments").value
  };
  var newUrl = indexUrl + 'restaurant.html?id=' + data.restaurant_id;
  DBHelper.fetchReviews(function(error, reviews) {
    if (error) {
      callback(error, null);
    } else {
      // Get all reviews for restaurant
      let results = reviews;
      if (results.length == 30) {
        window.alert("Review limit reached, your review could not be added.");
        callback(null, results);
        return;
      } else {
        if (navigator.onLine) {
          syncReviewsDB(DBreviewURL, 'reviews', dbReviewPromise)
          .then(function() {
            return fetch(DBreviewURL, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "default", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "omit", // include, same-origin, *omit
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "client", // no-referrer, *client
                body: JSON.stringify(data),
            })
            .then(function(response) {
              syncReviewsDB(DBreviewURL, 'reviews', dbReviewPromise);
              window.location.reload(true);
              return response.json();
            })
            .then(function() {
              return store.postitems('readwrite')
              .then(function(postitems) {
                if (postitems.length > 0) {
                  postitems.delete(items[0].id);
                }
              });
            })
            .then(function() {
              window.location.assign(newUrl);
            })
            .catch(function(error) {
              console.error(`Fetch Error =\n`, error);
            });
          });
        } else {
          store.postitems('readwrite').then(function(postitems) {
            data =  {
                id: -1,
                restaurant_id: parseInt(getParameterByName("restaurant_id")),
                name: document.getElementById("name").value,
                rating: ((document.getElementById("name").value > reviewer_rating) ? document.getElementById("name").value : reviewer_rating),
                comments: document.getElementById("comments").value
            };
            postitems.put(data);
          })
          .then(function() {
            syncReviewsDB(DBreviewURL, 'reviews', dbReviewPromise);
            window.location.assign(newUrl);
          });
        }
      }
    }
  });
});
