import express from "express"; // default export
import mysql from "mysql"
// import jwt from "jsonwebtoken";
// const app = express();
const port = 3000;

// Creating Connection With Database MySql:

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_with_mysql",

});

db.connect((err) => {
    if(err)
    {
        throw err;
    }

    console.log("MySql Connected");
})

const app = express();

// create a database in mysql:
app.get("/createdb", (req,res) => {
    let sql = "CREATE DATABASE node_with_mysql";
    db.query(sql, (err) => {
        if(err)
        {
            throw err;
        }

        res.send("Database created successfully");
    })
})

// Create a table in database:

app.get("/createtable", (req,res) => {
    let sql = "CREATE TABLE Movies(id int AUTO_INCREMENT, title VARCHAR(255), year int, rating float, PRIMARY KEY(id))";
    db.query(sql, (err) => {
        if(err)
        {
            throw err;
        }

        res.send("Table created successfully");
    })
})

// Insert Data into table:

app.get("/insertallmoviesdata", (req, res) => {
   let movies = [
    {
        title: "Pathan",
        year: 2023,
        rating: 9.8
    },
    {
        title: "Inception",
        year: 2010,
        rating: 8.8
    },
    {
        title: "Interstellar",
        year: 2014,
        rating: 8.6

    }
]

 // Generate the SQL query and data
 let sql = "INSERT INTO Movies (title, year, rating) VALUES ?";
 let values = movies.map(movie => [movie.title, movie.year, movie.rating]);

 // Execute the query
 db.query(sql, [values], (err) => {
     if (err) {
         throw err;
     }
     res.send("Movies Data inserted successfully");
 });

})

// Fetch All Movies Data:

app.get("/fetchmovies", (req, res) => {
    let sql = "SELECT * FROM Movies";
    db.query(sql, (err, result) => {
        if(err)
        {
            throw err;
        }   

        console.log(result);
        res.send("All Movies are Fetched successfully");
    })
})

// Update Movie:
app.get("/updatemovie/:id", (req, res) => {
    const id = req.params.id;
    const updatedMovie = {
        title: "Bajrangi Bhaijaan",
        year: 2015,
        rating: 9.5
    }
    let sql = `UPDATE Movies SET title = '${updatedMovie.title}', year = ${updatedMovie.year}, rating = ${updatedMovie.rating} WHERE  id = ${id}`;
    db.query(sql, (err, result) => {
        if(err)
        {
            throw err;
        }

        console.log("Movie Updated Successfully: ", result);
        res.send("Movie Updated Successfully...");
    })


})

// Delete Movie:

app.get("/deletemovie/:id", (req,res) => {
    const id = req.params.id;

    let sql = `DELETE FROM Movies WHERE id = ${id}`;
    db.query(sql, (err) => {
        if(err)
        {
            throw err;
        }
        res.send("Movie Delete Successfully...");
    })

})

// Multiple Sql statements in one route:

app.get("/deleteAndFetchMovies", (req, res) => {
    // First SQL statement to delete records from the table
    let deleteSql = "DELETE FROM Movies WHERE year < 2015";

    // Execute the DELETE query
    db.query(deleteSql, (deleteErr, deleteResult) => {
        if (deleteErr) {
            return res.status(500).send("Error deleting movies: " + deleteErr.message);
        }

        // Second SQL statement to fetch all remaining records
        let fetchSql = "SELECT * FROM Movies";

        // Execute the SELECT query
        db.query(fetchSql, (fetchErr, fetchResults) => {
            if (fetchErr) {
                return res.status(500).send("Error fetching movies: " + fetchErr.message);
            }

            // Send the fetched data as the response
            res.json(fetchResults);
        });
    });
});

















































// Parse JSON Through express:
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.get("/api", (req, res) => {
//     res.json(
//         {
//         message: "Hey there! Welcome to API Service with JWT Auth",
//         }
//     )
// })

// app.post("/api/posts", verifyToken, (req,res) => {
//     jwt.verify(req.token, "secretkey", (err, authData) => {
//         if(err) {
//             res.sendStatus(403); // forbidden
//         } else {
//             res.json({
//                 message: "Post created",
//                 authData
//             })
//         }
//     })
// })

// app.post("/api/login", (req,res) => {
//     const user = {
//         id : 1,
//         userName: "Khalid",
//         email: "khalidA@example.com"
//     }

//     // JSON Web Token Below:
//     jwt.sign({user}, "secretkey", (err, token) => {
//         res.json({
//             token
//         })
//     })
// })

// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers["authorization"];
//     console.log("bearerHeader = ", bearerHeader);

//     if(typeof bearerHeader !== "undefined") {
//         const bearerToken = bearerHeader.split(' ')[1];
//         req.token = bearerToken;
//         next();
//     } else {
//         res.sendStatus(403); // forbidden
//     }
// }


// let movies = [
//     {
//      
//         title: "Avengers",
//         year: 2019,
//         rating: 8.9
//     },
//     {
//         id: "2",
//         title: "Inception",
//         year: 2010,
//         rating: 8.8
//     },
//     {
//         id: "3",
//         title: "Interstellar",
//         year: 2014,
//         rating: 8.6

//     }
// ]

// // Base url: http://localhost:3000
// app.get("/", (req, res) => {
//     res.send("Welcome to Rest FUll API in express.js");
// })

// // get all movies
// app.get("/movies", (req, res) => {
//     res.send({message: "All movies", data: movies})
// })

// // add movie
// app.post("/movies", (req,res) => {
//     const newMovie = req.body;
//     console.log("newMovie = ", newMovie);
//     movies.push(newMovie);
//     res.send({message: "Movie added successfully", data: movies})
// })

// // Search a movie
// app.get("/movies/:id", (req,res) => {
//     const id = req.params.id;
//     const searchedMovie = movies.find(movie => movie.id === id);
//     res.send({message: "Searched movie", data: searchedMovie})
// })

// // Delete a movie thorugh id:
// app.delete("/movies/:id", (req,res) => {
//     const id = req.params.id;
//     movies = movies.filter(movie => movie.id !== id);
//     res.send({message: "Movie deleted successfully", data: movies})
// })

// // Update a movie through id:
// app.patch("/movies/:id", (req,res) => {
//     const id = req.params.id;
//     const updatedMovie = req.body;
//     movies = movies.map(movie => movie.id === id ? updatedMovie : movie);
//     res.send({message: "Movie updated successfully", data: movies})
// })

app.listen(port, () => {
    console.log("Server is listening on port = ", port);
})