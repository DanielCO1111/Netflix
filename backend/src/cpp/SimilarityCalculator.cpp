#include "SimilarityCalculator.hpp"
#include <unordered_set>
#include <unordered_map>

using namespace std;

// Data structure to store the movies watched by each user (userID -> set of movies)
unordered_map<int, unordered_set<int>> userMovies;

/**
 * @brief Constructor for SimilarityCalculator.
 * Initializes the similarity calculator (no specific initialization needed).
 */
SimilarityCalculator::SimilarityCalculator() {}

/**
 * @brief Calculate similarity between two users based on common movies watched.
 * 
 * The similarity score is simply the count of common movies watched by both users.
 * A higher score indicates more common movies.
 * 
 * @param userID1 The ID of the first user (positive integer).
 * @param userID2 The ID of the second user (positive integer).
 * @return int The similarity score, i.e., the number of common movies.
 */
int SimilarityCalculator::calculateSimilarity(int userID1, int userID2) const {
    // Check if userID1, userID2 exists
    if (userMovies.find(userID1) == userMovies.end() || userMovies.find(userID2) == userMovies.end()) {
        return 0; // Return 0 similarity if either user is missing
    }

    // Retrieve the set of movies watched by userID1 and userID2
    const unordered_set<int>& movies1 = userMovies.at(userID1); 
    const unordered_set<int>& movies2 = userMovies.at(userID2); 

    // Find the intersection of the two movie sets (common movies)
    int commonMoviesCount = 0;
    for (int movie : movies1) {
        if (movies2.find(movie) != movies2.end()) {
            commonMoviesCount++;
        }
    }
    return commonMoviesCount; // Return the number of common movies
}