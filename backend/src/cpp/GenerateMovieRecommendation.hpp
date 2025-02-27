#ifndef GENERATE_MOVIE_RECOMMENDATION_HPP
#define GENERATE_MOVIE_RECOMMENDATION_HPP

#include <vector>

using namespace std;

/**
 * @class GenerateMovieRecommendation
 * @brief Recommends movies based on relevance scores.
 * 
 * Example usage:
 * @code
 * GenerateMovieRecommendation genRec;
 * vector<int> recommendations = genRec.generateRecommendations(sortedMovies);
 * @endcode
 */
class GenerateMovieRecommendation {
public:
    /**
     * @brief Finds the most relevant movies from the scores.
     * 
     * This method extracts the movie IDs from the sorted relevance scores and returns them
     * as a list of recommendations.
     * 
     * @param sortedMovies A vector of pairs, where each pair consists of a movie ID and its relevance score,
     *                     sorted by relevance score in descending order.
     * @return A vector of movie IDs, representing the recommended movies.
     */
    vector<int> generateRecommendations(const vector<pair<int, double>>& sortedMovies);
};

#endif // GENERATE_MOVIE_RECOMMENDATION_HPP