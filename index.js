const express = require("express");
const cors = require("cors");
const { likeModel } = require("./models/like.model");
const { movieModel } = require("./models/movie.model");
const { userModel } = require("./models/user.model");
const { sequelize } = require("./lib/index");
const { Op } = require("sequelize");

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("You are accessing BD5.4");
});

const movies = [
  // Unique Bollywood Movies
  {
    title: "Dangal",
    director: "Nitesh Tiwari",
    genre: "Biography",
    release_year: 2016,
    rating: 4.8,
    actor: "Aamir Khan",
    box_office_collection: 220,
  },
  {
    title: "Baahubali 2: The Conclusion",
    director: "S.S. Rajamouli",
    genre: "Action",
    release_year: 2017,
    rating: 4.7,
    actor: "Prabhas",
    box_office_collection: 181,
  },
  {
    title: "PK",
    director: "Rajkumar Hirani",
    genre: "Comedy",
    release_year: 2014,
    rating: 4.6,
    actor: "Aamir Khan",
    box_office_collection: 140,
  },
  {
    title: "Bajrangi Bhaijaan",
    director: "Kabir Khan",
    genre: "Drama",
    release_year: 2015,
    rating: 4.5,
    actor: "Salman Khan",
    box_office_collection: 130,
  },
  {
    title: "Sultan",
    director: "Ali Abbas Zafar",
    genre: "Drama",
    release_year: 2016,
    rating: 4.3,
    actor: "Salman Khan",
    box_office_collection: 120,
  },
  {
    title: "Sanju",
    director: "Rajkumar Hirani",
    genre: "Biography",
    release_year: 2018,
    rating: 4.4,
    actor: "Ranbir Kapoor",
    box_office_collection: 120,
  },
  {
    title: "Padmaavat",
    director: "Sanjay Leela Bhansali",
    genre: "Drama",
    release_year: 2018,
    rating: 4.2,
    actor: "Ranveer Singh",
    box_office_collection: 112,
  },
  {
    title: "3 Idiots",
    director: "Rajkumar Hirani",
    genre: "Comedy",
    release_year: 2009,
    rating: 4.9,
    actor: "Aamir Khan",
    box_office_collection: 202,
  },
  {
    title: "Chennai Express",
    director: "Rohit Shetty",
    genre: "Comedy",
    release_year: 2013,
    rating: 4.0,
    actor: "Shah Rukh Khan",
    box_office_collection: 100,
  },
  {
    title: "War",
    director: "Siddharth Anand",
    genre: "Action",
    release_year: 2019,
    rating: 4.3,
    actor: "Hrithik Roshan",
    box_office_collection: 100,
  },
  {
    title: "Kabir Singh",
    director: "Sandeep Reddy Vanga",
    genre: "Romance",
    release_year: 2019,
    rating: 4.2,
    actor: "Shahid Kapoor",
    box_office_collection: 80,
  },
  {
    title: "Gully Boy",
    director: "Zoya Akhtar",
    genre: "Drama",
    release_year: 2019,
    rating: 4.4,
    actor: "Ranveer Singh",
    box_office_collection: 75,
  },
  {
    title: "Andhadhun",
    director: "Sriram Raghavan",
    genre: "Thriller",
    release_year: 2018,
    rating: 4.5,
    actor: "Ayushmann Khurrana",
    box_office_collection: 60,
  },
  {
    title: "Tumbbad",
    director: "Rahi Anil Barve",
    genre: "Horror",
    release_year: 2018,
    rating: 4.3,
    actor: "Sohum Shah",
    box_office_collection: 50,
  },
  {
    title: "Stree",
    director: "Amar Kaushik",
    genre: "Comedy",
    release_year: 2018,
    rating: 4.0,
    actor: "Rajkummar Rao",
    box_office_collection: 60,
  },
  {
    title: "Badhaai Ho",
    director: "Amit Sharma",
    genre: "Comedy",
    release_year: 2018,
    rating: 4.2,
    actor: "Ayushmann Khurrana",
    box_office_collection: 45,
  },
  {
    title: "Article 15",
    director: "Anubhav Sinha",
    genre: "Drama",
    release_year: 2019,
    rating: 4.6,
    actor: "Ayushmann Khurrana",
    box_office_collection: 35,
  },
  {
    title: "URI: The Surgical Strike",
    director: "Aditya Dhar",
    genre: "Action",
    release_year: 2019,
    rating: 4.7,
    actor: "Vicky Kaushal",
    box_office_collection: 70,
  },
];

app.get("/db_seed", async (req, res) => {
  await sequelize.sync({ force: true });
  await movieModel.bulkCreate(movies);
  res.status(200).json({ message: "Database seeding success" });
});

async function fetchAllMovies() {
  const response = await movieModel.findAll();
  return response;
}

async function fetchAllUsers() {
  const response = await userModel.findAll();
  return response;
}

async function fetchAllLikes() {
  const response = await likeModel.findAll();
  return response;
}

app.get("/records", async (req, res) => {
  const movieResponse = await fetchAllMovies();
  const userResponse = await fetchAllUsers();
  const likeResponse = await fetchAllLikes();
  res
    .status(200)
    .json({ movies: movieResponse, users: userResponse, likes: likeResponse });
});

async function createNewUser(newRecord) {
  const response = await userModel.create(newRecord);
  return response;
}
app.post("/users/new", async (req, res) => {
  const newRecord = req.body;
  try {
    const result = await createNewUser(newRecord);
    if (result == null || result == undefined) {
      res.status(400).json({ error: "Invalid user data" });
    }
    res.status(200).json({ user: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updateUserRecord(id, updateRecord) {
  const existingRecord = await userModel.findOne({ where: { id } });
  existingRecord.set(updateRecord);
  const response = await existingRecord.save();
  return response;
}

app.post("/users/update/:id", async (req, res) => {
  const updateRecord = req.body;
  const id = parseInt(req.params.id);
  try {
    const result = await updateUserRecord(id, updateRecord);
    if (result == null || result == undefined) {
      res
        .status(400)
        .json({ error: "Please check the user info that you are providing" });
    }
    res.status(200).json({ user: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updateMovieLikesBelongsToUser(userId, movieId) {
  const user = await userModel.findOne({ where: { id: userId } });
  const movie = await movieModel.findOne({ where: { id: movieId } });
  if (!user || !movie) {
    return null;
  }
  const response = likeModel.create({ userId, movieId });
  return response;
}

app.get("/user/:userId/like", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const movieId = parseInt(req.query.movie_id);
  try {
    const result = await updateMovieLikesBelongsToUser(userId, movieId);
    if (result == null || result == undefined) {
      return res.status(400).json({ error: "Invalid User or Movie Id" });
    }
    res.status(200).json({ like: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function dislikeMoviesBelongsToUser(userId, movieId) {
  const user = await userModel.findOne({ where: { id: userId } });
  const movie = await movieModel.findOne({ where: { id: movieId } });
  if (!user || !movie) {
    return null;
  }
  const response = likeModel.destroy({ where: { userId, movieId } });
  return response;
}

app.get("/user/:userId/dislike", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const movieId = parseInt(req.query.movie_id);
  try {
    const result = await dislikeMoviesBelongsToUser(userId, movieId);
    if (result == null || result == undefined) {
      return res.status(400).json({ error: "Invalid User or Movie Id" });
    }
    res.status(200).json({ like: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getUserLikedMovies(userId) {
  const user = await userModel.findOne({ where: { id: userId } });
  if (!user) {
    return null;
  }
  const response = await likeModel.findAll({
    where: { userId },
    attributes: ["movieId"],
  });

  const likedMovieIds = response.map((ele) => parseInt(ele.movieId));
  const movieData = await movieModel.findAll({
    where: {
      id: {
        [Op.in]: [...likedMovieIds],
      },
    },
  });
  return movieData;
}

app.get("/user/:userId/liked", async (req, res) => {
  const userId = parseInt(req.params.userId);
  try {
    const result = await getUserLikedMovies(userId);
    if (result == null || result == undefined) {
      return res.status(400).json({ error: "Invalid User Id" });
    }
    res.status(200).json({ like: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getUserLikedMoviesRelatedToActor(userId, actor) {
  const user = await userModel.findOne({ where: { id: userId } });
  if (!user) {
    return null;
  }
  const response = await likeModel.findAll({
    where: { userId },
    attributes: ["movieId"],
  });

  const likedMovieIds = response.map((ele) => parseInt(ele.movieId));
  const movieData = await movieModel.findAll({
    where: {
      id: {
        [Op.in]: [...likedMovieIds],
      },
    },
  });

  const filterLikedMoviesRelatedToActor = movieData.filter(
    (ele) => ele.actor === actor
  );
  return filterLikedMoviesRelatedToActor;
}

app.get("/user/:userId/liked/movies", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const actor = req.query.actor;

  try {
    const result = await getUserLikedMoviesRelatedToActor(userId, actor);
    if (result == null || result == undefined) {
      return res.status(400).json({ error: "Invalid User Id or actor name" });
    }
    res.status(200).json({ like: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("App is listening at port: " + port);
});
