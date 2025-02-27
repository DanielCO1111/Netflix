#ifndef MOVIE_DB_H
#define MOVIE_DB_H

#include <unordered_map>
#include <unordered_set>
#include <string>

using namespace std;

class movie_DB {
public:
    // Constructor and destructor
    movie_DB(const string& filename = "movie_db.txt");
    ~movie_DB();

    // User management
    bool userExists(int userID) const;
    void addUser(int userID);

    // Movie management
    bool movieExistsForUser(int userID, int movieID) const;
    void addMovieToUser(int userID, int movieID);
    void removeMovieFromUser(int userID, int movieID); // Added declaration

    // File operations
    void saveToFile() const;
    void loadFromFile();

    // Get all movies for a user
    unordered_set<int> getMoviesForUser(int userID) const;
    unordered_map<int, unordered_set<int>> getAllUserMovies() const;

private:
    unordered_map<int, unordered_set<int>> userMovies; // Maps userID to their watched movies
    string databaseFile; // Path to the database file
};

#endif
