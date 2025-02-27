# Specify the minimum CMake version
cmake_minimum_required(VERSION 3.10)

# Project name
project(backend)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Define project source directory
set(SRC_DIR "${CMAKE_SOURCE_DIR}/src/cpp")

# List source files
set(SOURCES
    ${SRC_DIR}/SimilarityCalculator.cpp
    ${SRC_DIR}/RelevanceCalculator.cpp
    ${SRC_DIR}/GenerateMovieRecommendation.cpp
    ${SRC_DIR}/Recommend.cpp
    ${SRC_DIR}/tcp_s.cpp
    ${SRC_DIR}/movie_DB.cpp
    ${SRC_DIR}/post.cpp
    ${SRC_DIR}/ThreadPool.cpp
)

# Create an executable
add_executable(tcp_server ${SOURCES})

# Link pthread library
target_link_libraries(tcp_server pthread)

# Specify the build directory
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)