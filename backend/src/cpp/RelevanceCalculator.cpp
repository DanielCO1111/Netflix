#include "RelevanceCalculator.hpp"
#include <algorithm>
#include <vector>
#include <unordered_map>
#include <map>

using namespace std;

/**
 * @brief Constructor for RelevanceCalculator.
 * @param simCalc Reference to the SimilarityCalculator instance.
 */
RelevanceCalculator::RelevanceCalculator(const SimilarityCalculator& simCalc)
    : similarityCalculator(simCalc) {}

/**
 * @brief Calculates the relevance scores for all movies.
 * The relevance score for a movie is calculated based on the similarity scores
 * between the target user and other users who have watched the target movie.
 * A higher relevance score indicates a higher likelihood of the movie being recommended.
 * @param targetUserID The user for whom recommendations are being calculated (positive integer).
 * @param targetMovieID The movie that acts as the context for the calculation (positive integer).
 * @return A vector of pairs, where each pair consists of a movie ID and its relevance score,
 *         sorted by relevance score in descending order.
 */
vector<pair<int, double>> RelevanceCalculator::calculateRelevance(int targetUserID, int targetMovieID) {
    const unordered_map<int, unordered_set<int>>& userMovies = similarityCalculator.userMovies;
    map<int, double> movieRelevanceScores;
    
    // Check if the targetUserID exists
    if (userMovies.find(targetUserID) == userMovies.end()) {
        return {}; // Return an empty vector if the target user doesn't exist
    }
    for (const auto& [userID, movies] : userMovies) {

        // Skip the target user, and only consider users who watched the target movie
        if ((movies.find(targetMovieID) != movies.end()) && (userID != targetUserID)) {
            int similarityScore = similarityCalculator.calculateSimilarity(targetUserID, userID);
            // Add similarity score to other movies watched by this user
            for (int movie : movies) {
                if (movie != targetMovieID) {
                    movieRelevanceScores[movie] += similarityScore;
                }
            }
        }
    }
    
    // Sort the movies by relevance score in descending order, and then by movie ID ascending if tie
    vector<pair<int, double>> sortedMovies(movieRelevanceScores.begin(), movieRelevanceScores.end());
    sort(sortedMovies.begin(), sortedMovies.end(), [](const auto& a, const auto& b) {
        if (a.second == b.second) {
            return a.first < b.first; // Sort by movieID if relevance score is the same
        }
        return a.second > b.second; // Sort by relevance score in descending order
    });

    return sortedMovies; // Return the movies sorted by highest relevance score
}