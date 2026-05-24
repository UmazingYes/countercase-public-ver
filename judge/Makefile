CXX = g++
CXXFLAGS = -std=c++17 -O2 -Wall -Wextra -pedantic

SRC = src/main.cpp src/registry.cpp src/puzzles/broken_binary_search.cpp
OUT = build/judge

all:
	mkdir -p build
	$(CXX) $(CXXFLAGS) $(SRC) -o $(OUT)

clean:
	rm -rf build
