const express = require('express');
const users = require('./userDb')
const router = express.Router();

//CREATE USERS
router.post('/users', validateUser(), (req, res) => {
  users.insert(req.body)
    .then((user) => {
       res.status(201).json(user)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Error adding the user",
      })
    })
});


//CREATE USER POSTS
router.post('/users/:id/posts', validateUserId(), (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      message: "Need a value for text",
    })
  }

  users.insert(req.params.id, req.body)
  .then((post) => {
    res.status(201).json(post)
  })
  .catch((error) => {
    console.log(error)
    res.status(500).json({
      message: "Could not create user post."
    })
  })
});


//GET USERS
router.get('/users', (req, res) => {
  // const options = {
	// 	sortBy: req.query.sortBy,
	// 	limit: req.query.limit,
  // }
  
  users.find()
		.then((users) => {
			res.status(200).json(users)
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error retrieving the users",
			})
		})
});


//GET USERS BY ID
router.get('/users/:id', validateUserId(), (req, res) => {
  res.status(200).json(req.user)
});


//GET USER POSTS
router.get('/users/:id/posts', validateUserId(), validatePost(), (req, res) => {
  users.getUserPosts(req.params.id)
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Could not get user posts",
      })
    })
});

//DELETE USERS BY ID
router.delete('/users/:id', validateUserId(), (req, res) => {
  users.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The user has been nuked",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error removing the user",
			})
		})
});

//UPDATE USERS BY ID
router.put('/users/:id', validateUserId(), (req, res) => {
  users.update(req.params.id, req.body)
		.then((user) => {
			if (user) {
				res.status(200).json(user)
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error updating the user",
			})
		})
});






//custom middleware

function validateUserId() {
  return (req, res, next) => {
    users.getById(req.params.id)
    .then((user) => {
      if (user) {
        req.user = user

        next()
      } else {
          res.status(404).json({
            message: "User not found.",
          })
        }
      })
    .catch((error) => {
      console.log(error)
      res.status(500).json({
        message: "Error retrieving the user",
      })
    })
  }
}

function validatePost() {
  return (req, res, next) => {
    if (!req.body.text) {
      return res.status(400).json({
        message: "Missing required text field"
      })
    }

    next()
  }
}

function validateUser() {
  return (req, res, next) => {
    if (!req.body.name) {
      return res.status(400).json({
        message: "Missing required name field"
      })
    }

    next()
  }
}


module.exports = router;
