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
ratingLabel.htmlFor = "rating";
ratingLabel.innerHTML = "Enter rating 0 to 5: ";
numberRating.appendChild(ratingLabel);
numberRating.appendChild(ratingInput);
reviewTitle.insertAdjacentElement('afterend', numberRating);
const star = '\u2605';
const star_border = '\u2606';
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
  starButton.innerHTML = star_border;
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
reviewerName.id = "reviewr-name";
const nameInput = document.createElement('input');
nameInput.type = "text";
nameInput.name = "name";
nameInput.id = "name";
nameInput.required;
const nameLabel = document.createElement('label');
nameLabel.htmlFor = "name";
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
getParametersByName = function(name, url) {
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

// This code was copied from an example given at:
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// by Mozilla Contributors (MDN), is licensed under CC-BY-SA 2.5, or all open source licenses.

/**
 * Update review from form data and post to database.
 */
const getReviewData = function(url = ``) {
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
    .then(function(response) {
      return response.json(); // parses response to JSON
    }).then(function(data) {
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
          star1.innerHTML = star_border;
          star2.value = '0';
          star2.innerHTML = star_border;
          star3.value = '0';
          star3.innerHTML = star_border;
          star4.value = '0';
          star4.innerHTML = star_border;
          star5.value = '0';
          star5.innerHTML = star_border;
          break;
        case 1:
        star1.value = '1';
        star1.innerHTML = star;
        star2.value = '0';
        star2.innerHTML = star_border;
        star3.value = '0';
        star3.innerHTML = star_border;
        star4.value = '0';
        star4.innerHTML = star_border;
        star5.value = '0';
        star5.innerHTML = star_border;
          break;
        case 2:
        star1.value = '1';
        star1.innerHTML = star;
        star2.value = '1';
        star2.innerHTML = star;
        star3.value = '0';
        star3.innerHTML = star_border;
        star4.value = '0';
        star4.innerHTML = star_border;
        star5.value = '0';
        star5.innerHTML = star_border;
          break;
        case 3:
        star1.value = '1';
        star1.innerHTML = star;
        star2.value = '1';
        star2.innerHTML = star;
        star3.value = '1';
        star3.innerHTML = star;
        star4.value = '0';
        star4.innerHTML = star_border;
        star5.value = '0';
        star5.innerHTML = star_border;
          break;
        case 4:
        star1.value = '1';
        star1.innerHTML = star;
        star2.value = '1';
        star2.innerHTML = star;
        star3.value = '1';
        star3.innerHTML = star;
        star4.value = '1';
        star4.innerHTML = star;
        star5.value = '0';
        star5.innerHTML = star_border;
          break;
        case 5:
        star1.value = '1';
        star1.innerHTML = star;
        star2.value = '1';
        star2.innerHTML = star;
        star3.value = '1';
        star3.innerHTML = star;
        star4.value = '1';
        star4.innerHTML = star;
        star5.value = '1';
        star5.innerHTML = star;
          break;
        default:
        star1.value = '0';
        star1.innerHTML = star_border;
        star2.value = '0';
        star2.innerHTML = star_border;
        star3.value = '0';
        star3.innerHTML = star_border;
        star4.value = '0';
        star4.innerHTML = star_border;
        star5.value = '0';
        star5.innerHTML = star_border;
      }
    })
    .catch(function(error) {
      console.error(`Fetch Error =\n`, error);
    });
};

const reviewData = getReviewData(DBreviewURL + getParametersByName('id').toString());

const updateView = document.querySelector("#update-review");
// Based on guidance from Udacity MWS Webinar Stage 3, Elisa Romondia, Lorenzo Zaccagnini
updateView.addEventListener("click", function(event) {
  event.preventDefault();
  const data = {
      restaurant_id: parseInt(getParametersByName("restaurant_id")),
      name: document.getElementById("name").value,
      rating: ((document.getElementById("name").value > reviewer_rating) ? document.getElementById("name").value : reviewer_rating),
      comments: document.getElementById("comments").value,
      id: parseInt(getParametersByName("id"))
  };
  const newUrl = '/restaurant?id=' + data.restaurant_id;
  if (navigator.onLine) {
    deleteReview(DBreviewURL, {id: data.id})
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
        syncReviewsDB(`https://guarded-cove-34449.herokuapp.com/reviews/?restaurant_id=${restaurant.id}`, 'reviews', dbReviewPromise);
        return response;
      })
      .then(function(resp) {
        // console.log(resp.json());
      })
      .then(function() {
        if ('serviceWorker' in navigator) {
          return store.postitems('readwrite')
          .then(function(postitems) {
            if (postitems.length > 0) {
              postitems.delete(items[0].id);
            }
          });
        }
      })
      .then(function() {
        loadDB(`https://guarded-cove-34449.herokuapp.com/reviews/?restaurant_id=${restaurant.id}`, 'reviews', dbReviewPromise);
        window.history.back();
      })
      .catch(function(error) {
        console.error(`Fetch Error =\n`, error);
      });
    });
  } else {
    if ('serviceWorker' in navigator) {
      store.postitems('readwrite').then(function(postitems) {
        postitems.put(data);
      })
      .then(function() {
        window.history.back();
      });
    }
  }
});

/**
 * Delete review from database and indexedDB.
 */
const deleteReview = function(url = ``, data = {}) {
  if (data){
    return fetch(url, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(function(response) {
      syncReviewsDB(`https://guarded-cove-34449.herokuapp.com/reviews/?restaurant_id=${restaurant.id}`, 'reviews', dbReviewPromise);
      loadDB(`https://guarded-cove-34449.herokuapp.com/reviews/?restaurant_id=${restaurant.id}`, 'reviews', dbReviewPromise);
    })
    .catch(function(error) {
      console.error(`Fetch Error =\n`, error);
    });
  }
}
