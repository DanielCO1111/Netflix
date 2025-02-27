# Stage 1: Build Stage
FROM gcc:latest AS builder

# Install necessary build tools
RUN apt-get update && apt-get install -y cmake g++ git wget unzip

# Set the working directory
WORKDIR /app

# Copy the entire backend directory to ensure src/cpp exists
COPY ./backend/src/cpp /app/src/cpp
COPY ./backend/src/cpp/CMakeLists.txt /app/CMakeLists.txt

# Run CMake and build
RUN cmake -S /app -B /app/build && cmake --build /app/build

# Stage 2: Runtime Stage
FROM gcc:latest

# Install necessary runtime libraries
RUN apt-get update && apt-get install -y libc6 libstdc++6

# Copy compiled binary from build stage
COPY --from=builder /app/build/tcp_server /backend/src/cpp/tcp_server
RUN chmod +x /backend/src/cpp/tcp_server

# Set working directory in runtime
WORKDIR /backend/src/cpp

# Expose port for TCP server
EXPOSE 12345

# Run the TCP server
CMD ["./tcp_server", "12345"]