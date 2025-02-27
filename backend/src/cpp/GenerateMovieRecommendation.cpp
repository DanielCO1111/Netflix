#include "GenerateMovieRecommendation.hpp"
#include <vector>

using namespace std;

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
vector<int> GenerateMovieRecommendation::generateRecommendations(const vector<pair<int, double>>& sortedMovies) {
    vector<int> recommendations;
    // Extract the movie IDs from sorted relevance scores
    for (const auto& movie : sortedMovies) {
        recommendations.push_back(movie.first);
    }
    
    return recommendations;
}