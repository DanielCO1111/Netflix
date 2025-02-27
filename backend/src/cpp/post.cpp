#include "post.h"
#include <iostream>

using namespace std;

Post::Post(movie_DB& db) : db(db) {} //Constructor get a referrence to the movies data base

//function to add a user to the db only if he didn't exist 
bool Post::postMovies(int userID, const vector<int>& movieIDs) {
    bool posted = false;

    // Add user if not exists
    if (!db.userExists(userID)) {
        db.addUser(userID);
        posted = true;
    }

    // Add movies for the user
    for (int movieID : movieIDs) {
        if (!db.movieExistsForUser(userID, movieID)) {
            db.addMovieToUser(userID, movieID);
            posted = true;  // Mark as posted if any new movie is added
        }
    }

    return posted;
}