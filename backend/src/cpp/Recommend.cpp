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
 * @brief Constructor for the Recommend class.
 * Initializes all the components needed for the recommendation system.
 * @param db Reference to the movie database instance.
 */
Recommend::Recommend(movie_DB& db) 
    : db(db), similarityCalculator(), relevanceCalculator(similarityCalculator) {}

/**
 * @brief Gets the recommended movies for a user based on a target movie.
 * This function calculates similarity, relevance, and recommends movies that are not yet watched by the user.
 * 
 * @param targetUserID The user for whom recommendations are being calculated.
 * @param targetMovieID The movie that acts as the context for the calculation.
 * @return A vector of recommended movie IDs.
 */
vector<int> Recommend::getRecommendation(int targetUserID, int targetMovieID) {
    // Check if the user exists in the database
    if (!db.userExists(targetUserID)) {
        return {};
    }

    // Populate the userMovies map in SimilarityCalculator
    similarityCalculator.userMovies = db.getAllUserMovies();

    // Calculate relevance scores for all movies based on the target movie
    vector<pair<int, double>> sortedMovies = relevanceCalculator.calculateRelevance(targetUserID, targetMovieID);
    
    // Generate the recommended list of movies based on the sorted scores
    return movieRecommender.generateRecommendations(sortedMovies);
}