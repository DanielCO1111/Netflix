import socket
import sys
import time

def main():
    if len(sys.argv) < 3:
        print("Usage: python tcp_c.py <server_ip> <server_port> [command1 command2 ...]")
        sys.exit(1)

    server_ip = sys.argv[1]
    try:
        server_port = int(sys.argv[2])
    except ValueError:
        print("Error: server_port must be an integer.")
        sys.exit(1)

    # Create and connect the socket.
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        client_socket.connect((server_ip, server_port))
    except Exception as e:
        print(f"Error connecting to {server_ip}:{server_port} - {e}")
        sys.exit(1)

    # Check if running interactively (sys.stdin.isatty() is True)
    if sys.stdin.isatty() and len(sys.argv) == 3:
        print("Interactive mode: Type your commands (Ctrl+C to exit)")
        try:
            while True:
                command = input("Enter command: ").strip()
                if not command:
                    continue
                client_socket.sendall((command + "\n").encode())
                response = client_socket.recv(4096).decode().strip()
                print(f"Server response: {response}")
        except KeyboardInterrupt:
            print("\nClient disconnected.")
    else:
        # If extra commands were passed, process them instead.
        commands = sys.argv[3:] if len(sys.argv) > 3 else [
            "POST 1 10 20 30",
            "GETALL 1",
            "GET 1 10"
        ]
        for command in commands:
            print(f"Sending command: {command.strip()}")
            client_socket.sendall((command + "\n").encode())
            response = client_socket.recv(4096).decode().strip()
            print(f"Server response: {response}")
            time.sleep(1)  # Optional delay between commands

    client_socket.close()

if __name__ == "__main__":
    main()