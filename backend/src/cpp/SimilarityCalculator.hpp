#ifndef SIMILARITY_CALCULATOR_HPP
#define SIMILARITY_CALCULATOR_HPP

#include <unordered_set>
#include <unordered_map>

using namespace std;

/**
 * @class SimilarityCalculator
 * @brief This class is responsible for calculating the similarity between users
 * based on the common movies they have watched.
 * 
 * Example usage:
 * @code
 * SimilarityCalculator sc;
 * int similarity = sc.calculateSimilarity(userID1, userID2);
 * @endcode
 */
class SimilarityCalculator {
public:
    /**
     * @brief Constructor for SimilarityCalculator.
     * Initializes the similarity calculator (though no specific initialization is required for now).
     */
    SimilarityCalculator();

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
    int calculateSimilarity(int userID1, int userID2) const;  
    // Data structure to store the movies watched by each user (userID -> set of movies)
    unordered_map<int, unordered_set<int>> userMovies;

};

#endif // SIMILARITY_CALCULATOR_HPP