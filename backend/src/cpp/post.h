#ifndef POST_H
#define POST_H

#include "movie_DB.h"
#include <vector>

using namespace std;

class Post {
private:
    movie_DB& db; // Reference to a movie_DB instance

public:
    Post(movie_DB& db); // Constructor
    bool postMovies(int userID, const vector<int>& movieIDs); // Return type changed to bool
};

#endif