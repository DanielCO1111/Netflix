#include "movie_DB.h"
#include <fstream>
#include <iostream>
#include <filesystem> // For directory handling
#include <unordered_map>
#include <unordered_set>

using namespace std;


movie_DB::movie_DB(const string& filename) : databaseFile("../data/" + filename) {
    // Ensure the "data" directory exists in the current working directory
    if (!filesystem::exists("/..data")) {
        filesystem::create_directory("../data");
    }
    loadFromFile(); // Load existing data if the file exists
}

//destructor
movie_DB::~movie_DB() {
    saveToFile(); // save the current state of the database back to the file.
}

bool movie_DB::userExists(int userID) const { //Checks if a user with the given userID exists in the database.
    return userMovies.find(userID) != userMovies.end();
}

//Adds a new user with the given userID to the database
void movie_DB::addUser(int userID) {
    userMovies[userID] = {}; // Initialize an empty set for the user
    saveToFile(); // Save the updated database to the file
}

//Checks if a specific movie (movieID) is already associated with a specific user (userID).
bool movie_DB::movieExistsForUser(int userID, int movieID) const {
    auto it = userMovies.find(userID);
    return it != userMovies.end() && it->second.find(movieID) != it->second.end();
    //Returns true if the movie exists for the user, false otherwise. 
}

//Adds the given movieID to the set of movies for the specified userID.
void movie_DB::addMovieToUser(int userID, int movieID) {
    userMovies[userID].insert(movieID);
    saveToFile(); // Save the updated database to the file
}

//Writes the current state of the userMovies database to the file specified by databaseFile.
void movie_DB::saveToFile() const {
    ofstream outFile(databaseFile);
    if (!outFile) {
        cerr << "Error: Unable to open file for writing.\n";        //check if neccecery 
        return;
    }
    for (const auto& [userID, movies] : userMovies) {
        outFile << userID;
        for (int movieID : movies) {
            outFile << " " << movieID;
        }
        outFile << "\n"; //Each line in the file represents one user and their associated movies
    }
}

//Reads the file specified by databaseFile and populates the userMovies database.
void movie_DB::loadFromFile() {
    ifstream inFile(databaseFile);
    if (!inFile) {
        cerr << " ";
        return;
    }

    int userID, movieID;
    //for each line: The first number is the userID, and Subsequent numbers are the movieIDs associated with that user.

    while (inFile >> userID) {
        unordered_set<int> movies; 
        while (inFile.peek() != '\n' && inFile >> movieID) { 
            movies.insert(movieID);
        }
        userMovies[userID] = movies;
    }
}
//Returns a list (vector) of all the movies associated with a specific userID.
unordered_set<int> movie_DB::getMoviesForUser(int userID) const {
    unordered_set<int> movies;
    auto it = userMovies.find(userID);
    if (it != userMovies.end()) {
        movies = it->second;
    }
    return movies;
    //Allows other parts of the program to query a user’s movies and use this data
    // for operations like recommendations or displaying user data.
}

unordered_map<int, unordered_set<int>> movie_DB::getAllUserMovies() const {
    return userMovies;
}


void movie_DB::removeMovieFromUser(int userID, int movieID) {
    // Remove the movie from the user's set
    userMovies[userID].erase(movieID);
    
    // Save the updated database to the file
    saveToFile();
}

