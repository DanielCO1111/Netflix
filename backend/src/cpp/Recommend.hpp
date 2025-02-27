#ifndef RECOMMEND_HPP
#define RECOMMEND_HPP

#include "movie_DB.h"
#include "Recommend.hpp"
#include "SimilarityCalculator.hpp"
#include "RelevanceCalculator.hpp"
#include "GenerateMovieRecommendation.hpp"
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <iostream>

using namespace std;

/**
 * @class Recommend
 * @brief Combines the logic of similarity, relevance, and recommendation generation.
 * 
 * This class acts as a controller that integrates the components:
 * - SimilarityCalculator (calculates similarity between users)
 * - RelevanceCalculator (calculates movie relevance based on similarity)
 * - GenerateMovieRecommendation (recommends movies based on relevance)
 * 
 * Example usage:
 * @code
 * Recommend recommender;
 * unordered_map<int, unordered_set<int>> userMovies = { ... };
 * recommender.setUserMovies(userMovies);
 * vector<int> recommendations = recommender.getRecommendation(targetUserID, targetMovieID);
 * @endcode
 */
class Recommend {
private:
    movie_DB& db; ///< Reference to the movie database
    SimilarityCalculator similarityCalculator; ///< Instance for calculating user similarities
    RelevanceCalculator relevanceCalculator;   ///< Instance for calculating relevance scores
    GenerateMovieRecommendation movieRecommender; ///< Instance for generating movie recommendations

public:
    /**
     * @brief Constructor for the Recommend class.
     * Initializes all the components needed for the recommendation system.
     * @param db Reference to the movie database instance.
     */
    Recommend(movie_DB& db);

    /**
     * @brief Gets the recommended movies for a user based on a target movie.
     * This function calculates similarity, relevance, and recommends movies that are not yet watched by the user.
     * 
     * @param targetUserID The user for whom the recommendation is calculated (positive integer).
     * @param targetMovieID The target movie ID, which acts as a context for the recommendation (positive integer).
     * @return A vector of recommended movie IDs.
     */
    vector<int> getRecommendation(int targetUserID, int targetMovieID);
};
#endif // RECOMMEND_HPP