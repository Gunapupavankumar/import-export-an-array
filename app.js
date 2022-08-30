const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log("DB error: ${e.message}");
    promise.exit(1);
  }
};

initializeDBAndServer();

// Returns a list of all movie names in the movie table

const convert = (objectItem) => {
  return { movieName: objectItem.movie_name };
};

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = "select movie_name from movie;";
  const dbResponse = await db.all(getMoviesQuery);
  response.send(dbResponse.map((each) => convert(each)));
});

//// Creates a new movie in the movie table. movie_id is auto-incremented

app.post("/movies/", async (request, response) => { 
    const movieDetails = request.body
    const{ directorId,
           movieName,
          leadActor
    } = movieDetails
  const addMoviesQuery = 'INSERT INTO movie (director_id,movie_name,lead_actor)
  VALUES
   (  
   '${directorId}',
   '${movieName}',
   '${leadActor}'
   
  );'; 

  const dbResponse =  await db.run(addMoviesQuery) 
  response.send("Movie successfully Added");

});   

//Returns a movie based on the movie ID 
// API-3 

const convertMovieAPI3=(objectItem) => {
    return {
        movieId = objectItem.movie_id,
        directorId = objectItem.director_id,
        movieName = objectItem.movie_name,
        leadActor = objectItem.lead_actor

    }
}

app.get("/movies/:movieId/", async (request,response) => {
    const{movieId} = request.params 
    const getMovieDetailsQuery = 'select * from movie where movie_id ='${movieId}';'
    const getMovieDetailsResponse = await db.get(getMovieDetailsQuery);
    response.send(convertMovieAPI3(getMovieDetailsResponse));
});

//Updates the details of a movie in the movie table based on the movie ID 

//API-4 


app.put("/movies/:movieId/",async(request,response) => {
       const {movieId} = request.params 
       const movieDetails = request.body 
       const {
           directorId,
           movieName,
           leadActor

       } = movieDetails ;
       const getMovieQuery ='update movie set director_id ='${directorId}
       ',
       movie_name ='${movieName}
       ' lead_actor = '${leadActor}
       '
       where movie_id = '${movieId}'
       '

       const getMovieResponse = await db.run(getMovieQuery); 
       response.send("Movie Details Updated"); 





}) 



//Deletes a movie from the movie table based on the movie ID  

//API-5 

app.delete("/movies/:movieId", async(request,response)  => { 

    const {movieId} = request.params; 
    const deleteMovieDetailsQuery = 'delete from movie where movie_id ='${movieId}';' ;

    await db.run(deleteMovieDetailsQuery) ;

    response.send("Movie Removed");


    
}); 


//Returns a list of all directors in the director table 

const convertDirector= (objectItem) => {
   return {
            directorId = objectItem.director_id 
            directorName = objectItem.director_name 
   }
}


app.get("/directors/", async (request, response) => { 
    const getDirectorQuery = 'select * from director' 

   const directorResponse await db.all(getDirectorQuery);
    response.send(directorResponse.map((each)=> convertDirector(each)));

}) 


//Returns a list of all movie names directed by a specific director 

app.get("/directors/:directorId/movies/", async (request,response) => {
    const {directorId} = request.params 
    const getMoviesByDirector = ' select movie_name as movieName from movie where director_id ='${directorId}''
    const getMoviesByDirectorResponse = await db.get(getMoviesByDirector); 
    response.send(getMoviesByDirectorResponse)

})

module.exports = app;