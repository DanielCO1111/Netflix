#include <iostream>
#include <thread>
#include <vector>
#include <string>
#include <mutex>

#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

#include <sstream>
#include <regex>
#include "movie_DB.h"
#include "Recommend.hpp"
#include "post.h"
#include "ThreadPool.hpp"

using namespace std;

mutex data_mutex; // A mutex to protect shared data access among threads 

// Helper function to check if a string is a valid integer
bool is_valid_int(const string& str) {
    return regex_match(str, regex("^[0-9]+$"));
}

void handle_client(int client_socket, movie_DB& db) { // Function to handle client requests
    char buffer[1024]; // Buffer to store incoming data from the client
    while (true) {
        // Receive data from the client
        int bytes_received = recv(client_socket, buffer, sizeof(buffer) - 1, 0);
        if (bytes_received <= 0) break;  // If no data is received, exit the loop
        buffer[bytes_received] = '\0'; // Null-terminate the received data

        cout << buffer << endl; // Print the received command for debugging

        string command(buffer); // Convert the buffer to a string
        string response; // Response to be sent back to the client
        istringstream iss(command); // Create a string stream from the command
        string cmd; // Extract the command keyword
        iss >> cmd;

        // Handle POST command
        if (cmd == "POST") {
            int userID;
            if (!(iss >> userID) || !is_valid_int(to_string(userID))) {
                response = "400 Bad Request\n";
            } else {
                vector<int> movieIDs;
                int movieID;
                bool valid = true;
                while (iss >> movieID) {
                    if (iss.fail() || !is_valid_int(to_string(movieID))) {
                        valid = false;
                        break;
                    }
                    movieIDs.push_back(movieID);
                }
                if (!valid || movieIDs.empty()) {
                    response = "400 Bad Request\n";
                } else {
                    lock_guard<mutex> lock(data_mutex);
                    Post postManager(db);
                    if (postManager.postMovies(userID, movieIDs)) {
                        response = "201 Created\n";
                    } else {
                    response = "200 OK\n";  // Return 200 if nothing new was added
                    }
                }
            }

        // Handle GET command
        } else if (cmd == "GET") {
            int userID, movieID;
            if (!(iss >> userID >> movieID) || !is_valid_int(to_string(userID)) || !is_valid_int(to_string(movieID))) {
                response = "400 Bad Request\n";
            } else {
                Recommend recommender(db);
                if (!db.userExists(userID) || !db.movieExistsForUser(userID, movieID)) {
                    response = "404 Not Found\n";
                } else {
                    response = "200 Ok\n";
                    vector<int> recommendedMovies = recommender.getRecommendation(userID, movieID);
                    for (int movie : recommendedMovies) {
                        response += to_string(movie) + " ";
                    }
                    response += "\n";
                }
            }
        } else if (cmd == "GETALL") {
            int userID;
            if (!(iss >> userID) || !is_valid_int(to_string(userID))) {
                response = "400 Bad Request\n";
            } else {
                lock_guard<mutex> lock(data_mutex);
                // Check if user exists
                if (!db.userExists(userID)) {
                    response = "404 Not Found\n";
                } else {
                    // userMoviesForUser returns all movieIDs for that user
                    response = "200 Ok\n";
                    auto userMovies = db.getMoviesForUser(userID);
                    // e.g. userMovies = {15,30,7} ...
                    for (int movieID : userMovies) {
                        response += to_string(movieID) + " ";
                    }
                    response += "\n"; // finish with newline
                }
            }
        } else {
            response = "400 Bad Request\n";
        }
        // Send the response to the client
        send(client_socket, response.c_str(), response.size(), 0);
    }
    close(client_socket); // Close the client socket
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cerr << "Usage: " << argv[0] << " <port>\n";
        return 1;
    }

    int port = stoi(argv[1]);

    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == -1) {
        cerr << "Failed to create socket\n";
        return 1;
    }

    sockaddr_in server_addr = {AF_INET, htons(port), INADDR_ANY};

    if (bind(server_socket, (sockaddr*)&server_addr, sizeof(server_addr)) == -1) {
        cerr << "Bind failed\n";
        return 1;
    }

    if (listen(server_socket, 5) == -1) {
        cerr << "Listen failed\n";
        return 1;
    }

    movie_DB db("movieDB.txt");

    ThreadPool pool(4); // Create a thread pool with 4 threads

    while (true) {
        int client_socket = accept(server_socket, nullptr, nullptr);
        if (client_socket == -1) {
            cerr << "Accept failed\n";
            continue;
        }
        pool.enqueue([client_socket, &db] {
            handle_client(client_socket, db);
        });
    }

    close(server_socket);

    return 0;
}