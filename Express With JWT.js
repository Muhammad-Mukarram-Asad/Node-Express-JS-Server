// Parse JSON Through express:
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
    res.json(
        {
        message: "Hey there! Welcome to API Service with JWT Auth",
        }
    )
})

app.post("/api/posts", verifyToken, (req,res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if(err) {
            res.sendStatus(403); // forbidden
        } else {
            res.json({
                message: "Post created",
                authData
            })
        }
    })
})

app.post("/api/login", (req,res) => {
    const user = {
        id : 1,
        userName: "Khalid",
        email: "khalidA@example.com"
    }

    // JSON Web Token Below:
    jwt.sign({user}, "secretkey", (err, token) => {
        res.json({
            token
        })
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    console.log("bearerHeader = ", bearerHeader);

    if(typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403); // forbidden
    }
}


let movies = [
    {
     
        title: "Avengers",
        year: 2019,
        rating: 8.9
    },
    {
        id: "2",
        title: "Inception",
        year: 2010,
        rating: 8.8
    },
    {
        id: "3",
        title: "Interstellar",
        year: 2014,
        rating: 8.6

    }
]

// Base url: http://localhost:3000
app.get("/", (req, res) => {
    res.send("Welcome to Rest FUll API in express.js");
})

// get all movies
app.get("/movies", (req, res) => {
    res.send({message: "All movies", data: movies})
})

// add movie
app.post("/movies", (req,res) => {
    const newMovie = req.body;
    console.log("newMovie = ", newMovie);
    movies.push(newMovie);
    res.send({message: "Movie added successfully", data: movies})
})

// Search a movie
app.get("/movies/:id", (req,res) => {
    const id = req.params.id;
    const searchedMovie = movies.find(movie => movie.id === id);
    res.send({message: "Searched movie", data: searchedMovie})
})

// Delete a movie thorugh id:
app.delete("/movies/:id", (req,res) => {
    const id = req.params.id;
    movies = movies.filter(movie => movie.id !== id);
    res.send({message: "Movie deleted successfully", data: movies})
})

// Update a movie through id:
app.patch("/movies/:id", (req,res) => {
    const id = req.params.id;
    const updatedMovie = req.body;
    movies = movies.map(movie => movie.id === id ? updatedMovie : movie);
    res.send({message: "Movie updated successfully", data: movies})
})

app.listen(port, () => {
    console.log("Server is listening on port = ", port);
})
