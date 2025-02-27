#ifndef RELEVANCE_CALCULATOR_HPP
#define RELEVANCE_CALCULATOR_HPP

#include "SimilarityCalculator.hpp"
#include <algorithm>
#include <vector>
#include <unordered_map>
#include <map>
#include <utility>

using namespace std;

/**
 * @class RelevanceCalculator
 * @brief Aggregates relevance scores for movies based on user similarity.
 * 
 * Example usage:
 * @code
 * SimilarityCalculator simCalc;
 * RelevanceCalculator relCalc(simCalc);
 * vector<pair<int, double>> relevanceScores = relCalc.calculateRelevance(targetUserID, targetMovieID);
 * @endcode
 */
class RelevanceCalculator {
public:
    // Constructor
    RelevanceCalculator(const SimilarityCalculator& simCalc);

    /**
     * @brief Calculates the relevance scores for all movies.
     * 
     * The relevance score for a movie is calculated based on the similarity scores
     * between the target user and other users who have watched the target movie.
     * A higher relevance score indicates a higher likelihood of the movie being recommended.
     * 
     * @param targetUserID The user for whom recommendations are being calculated (positive integer).
     * @param targetMovieID The movie that acts as the context for the calculation (positive integer).
     * @return A vector of pairs, where each pair consists of a movie ID and its relevance score,
     *         sorted by relevance score in descending order.
     */
    vector<pair<int, double>> calculateRelevance(int targetUserID, int targetMovieID);
private:
    const SimilarityCalculator& similarityCalculator;
};

#endif // RELEVANCE_CALCULATOR_HPP